import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory sliding window. Good enough to stop a single abusive client
// from hammering this endpoint within one warm server instance — it does not
// coordinate across serverless instances, so it's a speed bump, not a hard cap.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Opportunistic cleanup so requestLog doesn't grow unbounded on a long-lived instance.
  for (const [key, timestamps] of requestLog) {
    if (!timestamps.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
  }

  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    console.error("BUTTONDOWN_API_KEY is not set");
    return NextResponse.json({ error: "Subscriptions are not configured." }, { status: 500 });
  }

  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const buttondownRes = await fetch("https://api.buttondown.email/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (buttondownRes.ok) {
    return NextResponse.json({ ok: true });
  }

  // Buttondown returns 400 for an email that's already subscribed —
  // treat that as success from the visitor's perspective.
  const body = await buttondownRes.json().catch(() => null);
  const alreadySubscribed =
    buttondownRes.status === 400 &&
    JSON.stringify(body ?? "").toLowerCase().includes("already");

  if (alreadySubscribed) {
    return NextResponse.json({ ok: true });
  }

  console.error("Buttondown subscribe error:", buttondownRes.status, body);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
}
