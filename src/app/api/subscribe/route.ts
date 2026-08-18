import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
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
