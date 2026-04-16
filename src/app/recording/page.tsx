import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ObfuscatedMailto } from "@/components/ui/obfuscated-mailto";
import { JsonLd } from "@/components/seo/JsonLd";
import { InquiryForm } from "@/components/ui/InquiryForm";
import {
  Mic2,
  CheckCircle2,
  ArrowRight,
  Music2,
  Zap,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Remote Bass Recording | Session Bassist for Hire | Advance Bass",
  description:
    "Professional remote bass recording by Jim Bennett. High-quality bass tracks delivered fast for your songs, albums, or productions. Session bassist available worldwide.",
  keywords: [
    "remote bass recording",
    "session bassist",
    "session bassist for hire",
    "hire session bassist",
    "bass recording online",
    "remote session recording",
    "studio bassist",
    "bass tracks for hire",
    "online session musician",
    "bass overdubs",
    "professional bass recording",
    "bass recording Vancouver",
  ],
  openGraph: {
    title: "Remote Bass Recording | Session Bassist Jim Bennett",
    description:
      "Need pro bass on your track? Jim Bennett delivers high-quality remote bass recording for any genre, fast turnaround, worldwide.",
    url: "https://advancebass.com/recording",
  },
  alternates: {
    canonical: "https://advancebass.com/recording",
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
        name: "Recording",
        item: "https://advancebass.com/recording",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Remote Bass Recording",
    provider: {
      "@type": "Person",
      name: "Jim Bennett",
      url: "https://advancebass.com",
    },
    serviceType: "Session Recording",
    description:
      "Professional remote bass recording for albums, singles, EPs, and productions. High-quality WAV files delivered digitally with fast turnaround.",
    areaServed: { "@type": "Country", name: "Worldwide" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: "https://advancebass.com/recording",
    },
  },
];

const deliverables = [
  "High-resolution WAV files (24-bit / 48kHz or higher)",
  "Dry DI track + processed track",
  "Multiple takes if required",
  "Stems on request",
  "Delivered via WeTransfer or Google Drive",
  "Fast turnaround — typically 2–4 business days",
];

const genres = [
  "Rock",
  "Funk",
  "Jazz",
  "Soul / R&B",
  "Pop",
  "Blues",
  "Gospel",
  "Fusion",
  "Country",
  "Electronic",
];

export default function RecordingPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background" />
        <div className="container relative mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm mb-6">
            <Mic2 className="h-5 w-5" />
            Session Recording
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Remote Bass Recording —{" "}
            <span className="text-primary">Session Bassist</span> for Hire
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Need <strong>professional bass tracks</strong> for your next
            recording? Jim Bennett delivers studio-quality remote bass recording
            for any genre, anywhere in the world. Fast turnaround, clean files,
            and the musicality your project deserves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <ObfuscatedMailto
                user="jim"
                domain="advancebass.com"
                subject="Recording Session Inquiry"
              >
                Book a Session <ArrowRight className="ml-2 h-4 w-4" />
              </ObfuscatedMailto>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-20 border-t max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            How Remote Recording Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple process, professional results.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              icon: <FileText className="h-6 w-6 text-primary" />,
              title: "Send Your Project",
              desc: "Share your session files, a rough mix or click track, chord chart, and any reference tracks. The more context the better.",
            },
            {
              step: "2",
              icon: <Mic2 className="h-6 w-6 text-primary" />,
              title: "Jim Records",
              desc: "Bass tracks are recorded in a controlled environment with professional gear. Jim will record multiple options if needed and communicate throughout.",
            },
            {
              step: "3",
              icon: <Zap className="h-6 w-6 text-primary" />,
              title: "Receive Your Files",
              desc: "High-resolution WAV files delivered digitally — typically within 2–4 business days. Revisions included.",
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                {icon}
              </div>
              <div className="text-sm text-primary font-semibold uppercase tracking-wide">
                Step {step}
              </div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What You Receive */}
      <section className="py-16 border-t bg-muted/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                What You Receive
              </h2>
              <ul className="space-y-3">
                {deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-2xl border bg-card space-y-5">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Music2 className="h-5 w-5 text-primary" />
                Genres &amp; Styles
              </h3>
              <p className="text-muted-foreground text-sm">
                Jim is a versatile bassist equally comfortable locking into a
                funk groove, laying back on a ballad, or cutting an upright
                jazz walking line. If you have a reference track, he can match
                the feel.
              </p>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1.5 rounded-full border bg-background text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Jim */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-20 max-w-3xl">
        <div className="text-center space-y-6">
          <div className="inline-block p-4 rounded-full bg-primary/10 border border-primary/10">
            <Mic2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            About Your Session Bassist
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Jim Bennett is a Vancouver-based professional bassist with a degree
            from <strong>McGill University</strong>. He has recording experience
            across a wide range of genres and brings a musician&apos;s ear to
            every session — not just playing notes, but playing what the song
            needs.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            As an educator with millions of YouTube views, Jim has a proven
            track record of deep musical understanding. In the studio, that
            translates to tracks that sit perfectly in the mix and serve the
            song.
          </p>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 border-t" id="inquire">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="text-center mb-10">
            <Mic2 className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">
              Book a Recording Session
            </h2>
            <p className="text-muted-foreground">
              Share your project details below and Jim will get back to you with
              availability and a quote.
            </p>
          </div>
          <InquiryForm
            subject="Recording Session Inquiry"
            successMessage="Thanks! Jim will review your project and be in touch soon."
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
                name: "genre",
                label: "Genre / Style",
                type: "select",
                required: true,
                options: [
                  "Rock",
                  "Funk",
                  "Jazz",
                  "Soul / R&B",
                  "Pop",
                  "Blues",
                  "Gospel",
                  "Fusion",
                  "Country",
                  "Electronic",
                  "Other",
                ],
              },
              {
                name: "project_details",
                label: "Project Details",
                type: "textarea",
                placeholder:
                  "Tell Jim about your project — tempo, key, number of tracks, reference songs, and anything else that would help him understand the vibe.",
                required: true,
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
