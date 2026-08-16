"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "success" | "error";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus("sending");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: "Newsletter Subscriber",
          reply_to: email,
          subject: "New Newsletter Signup — Advance Bass",
          message: `${email} signed up for updates on new tools and transcriptions.`,
        },
        { publicKey },
      );
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      console.error("Newsletter signup error:", err);
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <CheckCircle2 className="h-4 w-4" />
        You&apos;re on the list.
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-1.5">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button
          type="submit"
          size="sm"
          disabled={status === "sending"}
          className="shrink-0 rounded-lg"
        >
          {status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </form>
      {status === "error" && (
        <p className="text-xs text-destructive" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
