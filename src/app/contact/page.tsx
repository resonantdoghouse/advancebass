import { Mail } from "lucide-react";
import { InquiryForm } from "@/components/ui/InquiryForm";

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
