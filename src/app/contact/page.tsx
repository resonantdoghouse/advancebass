import { Mail, Music2, Mic2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObfuscatedMailto } from "@/components/ui/obfuscated-mailto";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Advance Bass",
  description:
    "Get in touch for bass lessons, recording sessions, or live performances.",
};

export default function ContactPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
          Work With Me
        </h1>
        <p className="text-xl text-muted-foreground">
          Professional bass services for your musical journey or creative
          project.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {/* Bass Lessons */}
        <div className="flex flex-col items-center p-8 rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:bg-muted/50">
          <div className="p-3 rounded-full bg-primary/10 mb-6">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Bass Lessons</h2>
          <p className="text-center text-muted-foreground mb-6">
            Private instruction tailored to your goals. From beginner
            fundamentals to advanced theory and technique. Available in-person
            or online.
          </p>
          <Button asChild variant="outline" className="mt-auto">
            <ObfuscatedMailto
              user="jim"
              domain="advancebass.com"
              subject="Bass Lesson Inquiry"
            >
              Inquire About Lessons
            </ObfuscatedMailto>
          </Button>
        </div>

        {/* Recording */}
        <div className="flex flex-col items-center p-8 rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:bg-muted/50">
          <div className="p-3 rounded-full bg-primary/10 mb-6">
            <Mic2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Recording</h2>
          <p className="text-center text-muted-foreground mb-6">
            Professional remote bass tracks for your songs. High-quality audio
            files delivered with quick turnaround times.
          </p>
          <Button asChild variant="outline" className="mt-auto">
            <ObfuscatedMailto
              user="jim"
              domain="advancebass.com"
              subject="Recording Session Inquiry"
            >
              Book a Session
            </ObfuscatedMailto>
          </Button>
        </div>

        {/* Live Performance */}
        <div className="flex flex-col items-center p-8 rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:bg-muted/50">
          <div className="p-3 rounded-full bg-primary/10 mb-6">
            <Music2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Live Performance</h2>
          <p className="text-center text-muted-foreground mb-6">
            Experienced live bassist available for gigs, tours, and showcases.
            Versatile across genres including Rock, Funk, Soul, and Jazz.
          </p>
          <Button asChild variant="outline" className="mt-auto">
            <ObfuscatedMailto
              user="jim"
              domain="advancebass.com"
              subject="Live Performance Booking"
            >
              Check Availability
            </ObfuscatedMailto>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-muted/30">
        <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
          <Mail className="w-6 h-6" />
          Get in Touch
        </h2>
        <p className="text-muted-foreground mb-8">
          Have a general question or want to discuss a custom project? Drop me
          an email and I&apos;ll get back to you as soon as possible.
        </p>
        <Button size="lg" asChild className="text-base px-8">
          <ObfuscatedMailto user="jim" domain="advancebass.com">
            Contact Me
          </ObfuscatedMailto>
        </Button>
      </div>
    </div>
  );
}
