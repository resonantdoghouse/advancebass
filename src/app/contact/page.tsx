import { Mail, Music2, Mic2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ObfuscatedMailto } from "@/components/ui/obfuscated-mailto";
import { InquiryForm } from "@/components/ui/InquiryForm";
import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bass Lessons, Recording & Live Performance | Work With Jim Bennett",
  description:
    "Book private bass lessons in Vancouver or online, hire Jim Bennett as a session bassist for remote recording, or book him for live performance. Get in touch to discuss your project.",
  openGraph: {
    title: "Work With Jim Bennett | Bass Lessons, Recording & Live Performance",
    description:
      "Private bass lessons in Vancouver & online, remote session recording, and live performance bookings. Professional bassist Jim Bennett — contact to get started.",
    url: "https://advancebass.com/contact",
  },
  alternates: {
    canonical: "https://advancebass.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-primary">
          Bass Lessons, Recording &amp; Live Performance
        </h1>
        <p className="text-xl text-muted-foreground">
          Professional bass services — private instruction in Vancouver &amp;
          online, remote session recording, and live performance bookings.
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
            Private instruction tailored to your goals. Specialized in{" "}
            <strong>Electric & Upright Bass</strong>. Expert guidance in Jazz,
            Theory, Slap, and Tapping. Available{" "}
            <strong>in-person in Vancouver</strong> or{" "}
            <strong>online worldwide</strong>.
          </p>
          <Button asChild variant="outline" className="mt-auto">
            <Link href="/bass-lessons#inquire">Book a Lesson</Link>
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
            <Link href="/recording#inquire">Book a Session</Link>
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

      {/* General Inquiry Form */}
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Get in Touch</h2>
          <p className="text-muted-foreground">
            Have a general question or not sure which service fits? Fill in the
            form and Jim will get back to you.
          </p>
        </div>
        <InquiryForm
          subject="Website Inquiry"
          successMessage="Message sent! Jim will get back to you as soon as possible."
          fields={[
            {
              name: "from_name",
              label: "Your Name",
              type: "text",
              placeholder: "Jane Smith",
              required: true,
            },
            {
              name: "reply_to",
              label: "Email Address",
              type: "email",
              placeholder: "jane@example.com",
              required: true,
            },
            {
              name: "service",
              label: "What are you enquiring about?",
              type: "select",
              required: true,
              options: [
                "Bass Lessons — In-Person (Vancouver)",
                "Bass Lessons — Online (Zoom)",
                "Recording Session",
                "Live Performance / Booking",
                "General Question",
              ],
            },
            {
              name: "message",
              label: "Message",
              type: "textarea",
              placeholder: "Tell Jim a bit about what you're looking for…",
              required: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
