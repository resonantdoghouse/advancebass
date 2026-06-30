import { Mail } from "lucide-react";
import { InquiryForm } from "@/components/ui/InquiryForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Jim Bennett | Advance Bass",
  description:
    "Get in touch with Jim Bennett — professional bassist and educator based in Vancouver, BC. Questions about lessons, recording, or anything else.",
  openGraph: {
    title: "Contact Jim Bennett | Advance Bass",
    description:
      "Get in touch with Jim Bennett — professional bassist and educator based in Vancouver, BC.",
    url: "https://advancebass.com/contact",
  },
  alternates: {
    canonical: "https://advancebass.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12 md:py-20">
      {/* General Inquiry Form */}
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Get in Touch</h1>
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
