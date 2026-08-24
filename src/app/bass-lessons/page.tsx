import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { InquiryForm } from "@/components/ui/InquiryForm";
import {
  GraduationCap,
  MapPin,
  Globe,
  CheckCircle2,
  Music2,
  ArrowRight,
  Mic2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bass Lessons Vancouver & Online | Jim Bennett",
  description:
    "Private bass lessons with Jim Bennett — in-person in Vancouver, BC or online worldwide via Zoom. Electric and upright bass, jazz theory, slap, tap, fingerstyle. All levels welcome.",
  openGraph: {
    title: "Bass Lessons in Vancouver & Online | Jim Bennett",
    description:
      "Study with a professional touring bassist. Private instruction for all levels — in Vancouver, BC or anywhere in the world via Zoom.",
    url: "https://advancebass.com/bass-lessons",
  },
  alternates: {
    canonical: "https://advancebass.com/bass-lessons",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://advancebass.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bass Lessons",
        item: "https://advancebass.com/bass-lessons",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Private Bass Lessons",
    provider: {
      "@type": "Person",
      name: "Jim Bennett",
      url: "https://advancebass.com",
      alumniOf: { "@type": "CollegeOrUniversity", name: "McGill University" },
    },
    serviceType: "Music Instruction",
    description:
      "Private electric and upright bass instruction for all levels. Available in-person in Vancouver, BC and online worldwide via Zoom.",
    areaServed: [
      { "@type": "City", name: "Vancouver", addressRegion: "BC" },
      { "@type": "Country", name: "CA" },
    ],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: "https://advancebass.com/bass-lessons",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need to own a bass before starting lessons?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. You can start lessons before purchasing an instrument. Jim can advise you on what to buy based on your goals and budget during your first session.",
        },
      },
      {
        "@type": "Question",
        name: "How much do bass lessons cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pricing is provided on inquiry and depends on lesson length and frequency. Contact Jim directly to discuss rates for in-person Vancouver lessons or online sessions.",
        },
      },
      {
        "@type": "Question",
        name: "Do you teach complete beginners?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, absolutely. Lessons are tailored to your current level — from complete beginners picking up the bass for the first time to advanced players working on jazz harmony or complex technique.",
        },
      },
      {
        "@type": "Question",
        name: "What platform do you use for online lessons?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Online bass lessons are conducted over Zoom. All you need is a stable internet connection, your bass, and a small amp or headphones.",
        },
      },
      {
        "@type": "Question",
        name: "Do you teach upright bass as well as electric bass?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Jim is trained in both electric and upright bass and can guide students through the technical differences, posture, tone production, and jazz walking bass lines on upright.",
        },
      },
      {
        "@type": "Question",
        name: "What music styles do you cover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lessons cover a wide range of styles including jazz, funk, rock, soul, R&B, and more. Techniques taught include slap bass, tapping, fingerstyle, and pick playing.",
        },
      },
    ],
  },
];

const techniques = [
  "Slap & Pop",
  "Two-Hand Tapping",
  "Fingerstyle",
  "Pick Technique",
  "Walking Bass Lines",
  "Jazz Harmony",
  "Music Theory",
  "Sight Reading",
  "Ear Training",
  "Funk & Groove",
  "Upright Bass",
  "Advanced Technique",
];

const faqs = [
  {
    q: "Do I need to own a bass before starting lessons?",
    a: "No. You can start lessons before purchasing an instrument. Jim can advise you on what to buy based on your goals and budget during your first session.",
  },
  {
    q: "How much do bass lessons cost?",
    a: "Pricing is provided on inquiry and depends on lesson length and frequency. Contact Jim directly to discuss rates for in-person Vancouver lessons or online sessions.",
  },
  {
    q: "Do you teach complete beginners?",
    a: "Yes, absolutely. Lessons are tailored to your current level — from complete beginners to advanced players working on jazz harmony or complex technique.",
  },
  {
    q: "What platform do you use for online lessons?",
    a: "Online bass lessons are conducted over Zoom. All you need is a stable internet connection, your bass, and a small amp or headphones.",
  },
  {
    q: "Do you teach upright bass as well as electric bass?",
    a: "Yes. Jim is trained in both electric and upright bass and covers the technical differences, posture, tone production, and jazz walking bass lines.",
  },
  {
    q: "What music styles do you cover?",
    a: "Lessons span jazz, funk, rock, soul, R&B, and more. Techniques include slap bass, tapping, fingerstyle, and pick playing — whatever matches your goals.",
  },
];

export default function BassLessonsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background" />
        <div className="container relative mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm mb-6">
            <GraduationCap className="h-5 w-5" />
            Private Instruction
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Bass Lessons in{" "}
            <span className="text-primary">Vancouver</span> &amp; Online
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Study privately with <strong>Jim Bennett</strong> — a professional
            touring bassist and educator. In-person lessons in{" "}
            <strong>Vancouver, BC</strong> or online via Zoom, available{" "}
            <strong>worldwide</strong>. All levels welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="#inquire">
                Book a Lesson <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8"
            >
              <Link href="/bassist-for-hire">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* In-Person vs Online */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-20 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            Choose Your Format
          </h2>
          <p className="text-muted-foreground text-lg">
            Same professional instruction, tailored to your location.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* In-Person */}
          <div className="flex flex-col p-8 rounded-2xl border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 w-fit mb-6">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              In-Person — Vancouver, BC
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Face-to-face lessons in Vancouver. Jim works directly with your
              posture, hand technique, and tone in real time — the fastest path
              to fixing bad habits and building muscle memory.
            </p>
            <ul className="space-y-2 text-muted-foreground mb-8">
              {[
                "Hands-on technique correction",
                "Gear advice and setup in person",
                "Access Jim's equipment if needed",
                "Local Vancouver scheduling",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-auto">
              <Link href="#inquire">Inquire About In-Person Lessons</Link>
            </Button>
          </div>

          {/* Online */}
          <div className="flex flex-col p-8 rounded-2xl border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 w-fit mb-6">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Online — Worldwide</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              High-quality online bass lessons via Zoom from anywhere in the
              world. Study with a pro bassist without leaving your home — same
              personalized curriculum, same results.
            </p>
            <ul className="space-y-2 text-muted-foreground mb-8">
              {[
                "Lesson recordings available on request",
                "Flexible scheduling across time zones",
                "Shared screen for charts and notation",
                "No commute — practice room ready",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-auto">
              <Link href="#inquire">Inquire About Online Lessons</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 md:py-20 bg-muted/20 border-t border-b">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              What You&apos;ll Learn
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A curriculum built around your goals, spanning technique, theory,
              and musicianship.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {techniques.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-2 p-4 rounded-xl border bg-card text-sm font-medium"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Jim */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm">
              <Music2 className="h-5 w-5" />
              Your Instructor
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Jim Bennett
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Jim is a professional bassist with a degree from{" "}
              <strong>McGill University</strong> and extensive touring and
              recording experience. He has built a YouTube community with{" "}
              <strong>millions of views</strong> teaching bass to players around
              the world.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              His teaching philosophy centres on giving students a deep
              understanding of the instrument — not just songs to copy, but the
              tools to learn anything on their own. Whether you&apos;re a
              complete beginner or an experienced player looking to break through
              a plateau, Jim&apos;s lessons are structured around your specific
              goals.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.youtube.com/@JimBennettBassist"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm font-medium"
              >
                Watch on YouTube →
              </a>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-[4/3] bg-muted border flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
            <div className="relative text-center space-y-3 p-8">
              <div className="inline-block p-4 rounded-full bg-primary/20 border border-primary/20 mb-2">
                <Music2 className="h-14 w-14 text-primary" />
              </div>
              <div className="text-xl font-bold text-white">Jim Bennett</div>
              <div className="text-white/70 text-sm">
                Professional Bassist &amp; Educator
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Lessons Work */}
      <section className="py-16 md:py-20 border-t bg-muted/10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Getting started is simple.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Get in Touch",
                desc: "Send an email describing your level, goals, and whether you prefer in-person or online. Jim will respond quickly to discuss availability.",
              },
              {
                step: "2",
                title: "First Lesson",
                desc: "Your first session covers where you are now and where you want to go. Jim designs a personalised plan from there.",
              },
              {
                step: "3",
                title: "Make Progress",
                desc: "Regular lessons with structured practice assignments. Most students notice clear improvement within the first month.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto">
                  {step}
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-20 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">{q}</h3>
              <p className="text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 border-t" id="inquire">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="text-center mb-10">
            <Mic2 className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Book a Lesson</h2>
            <p className="text-muted-foreground">
              Fill in the form below and Jim will get back to you to confirm
              availability and answer any questions.
            </p>
          </div>
          <InquiryForm
            subject="Bass Lesson Inquiry"
            successMessage="Thanks! Jim will be in touch shortly to discuss availability."
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
                name: "lesson_format",
                label: "Lesson Format",
                type: "select",
                required: true,
                options: ["In-Person (Vancouver)", "Online (Zoom)", "Not sure yet"],
              },
              {
                name: "experience_level",
                label: "Experience Level",
                type: "select",
                required: true,
                options: [
                  "Complete beginner",
                  "Some experience (< 2 years)",
                  "Intermediate (2–5 years)",
                  "Advanced (5+ years)",
                ],
              },
              {
                name: "message",
                label: "What are your goals?",
                type: "textarea",
                placeholder:
                  "Tell Jim what you'd like to work on — styles, techniques, goals, or anything else.",
                required: true,
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
