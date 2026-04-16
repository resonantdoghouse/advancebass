import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ObfuscatedMailto } from "@/components/ui/obfuscated-mailto";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Music2,
  CheckCircle2,
  ArrowRight,
  Star,
  Mic2,
  Radio,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bassist for Hire Vancouver | Live & Session | Jim Bennett",
  description:
    "Hire Jim Bennett as your bassist in Vancouver and beyond. Experienced live performer available for gigs, tours, showcases, and events. Rock, funk, jazz, soul, and R&B.",
  keywords: [
    "bassist for hire",
    "bassist for hire Vancouver",
    "hire a bassist",
    "live bassist Vancouver",
    "bass player for hire",
    "session bassist Vancouver",
    "bass player Vancouver",
    "professional bassist Vancouver",
    "funk bassist",
    "jazz bassist Vancouver",
    "touring bassist",
    "bass musician for hire",
  ],
  openGraph: {
    title: "Bassist for Hire — Vancouver & Beyond | Jim Bennett",
    description:
      "Professional live bassist available for gigs, tours, and showcases. Versatile across Rock, Funk, Jazz, Soul, and R&B. Based in Vancouver, BC.",
    url: "https://advancebass.com/bassist-for-hire",
  },
  alternates: {
    canonical: "https://advancebass.com/bassist-for-hire",
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
        name: "Bassist for Hire",
        item: "https://advancebass.com/bassist-for-hire",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bassist for Hire — Live Performance",
    provider: {
      "@type": "Person",
      name: "Jim Bennett",
      url: "https://advancebass.com",
    },
    serviceType: "Live Music Performance",
    description:
      "Experienced professional bassist available for live gigs, tours, showcases, and events across Vancouver and beyond. Versatile across Rock, Funk, Jazz, Soul, and R&B.",
    areaServed: [
      { "@type": "City", name: "Vancouver", addressRegion: "BC" },
      { "@type": "Country", name: "CA" },
    ],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: "https://advancebass.com/bassist-for-hire",
    },
  },
];

const genres = [
  "Rock",
  "Funk",
  "Jazz",
  "Soul",
  "R&B",
  "Blues",
  "Pop",
  "Fusion",
  "Gospel",
  "Country",
];

const capabilities = [
  "Covers & tribute shows",
  "Original band support",
  "Corporate & private events",
  "Tours & extended runs",
  "Showcase & festival gigs",
  "Last-minute dep bookings",
  "Fly dates — travel available",
  "Upright bass available",
];

export default function BassistForHirePage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background" />
        <div className="container relative mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm mb-6">
            <Music2 className="h-5 w-5" />
            Live Performance
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Bassist for Hire —{" "}
            <span className="text-primary">Vancouver</span> &amp; Beyond
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Looking for a <strong>professional bassist</strong> for your next
            gig, tour, or event? Jim Bennett is an experienced live performer
            available in <strong>Vancouver, BC</strong> and beyond. Versatile,
            reliable, and well-prepared.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <ObfuscatedMailto
                user="jim"
                domain="advancebass.com"
                subject="Bassist for Hire Inquiry"
              >
                Check Availability <ArrowRight className="ml-2 h-4 w-4" />
              </ObfuscatedMailto>
            </Button>
          </div>
        </div>
      </section>

      {/* What Jim Offers */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-20 border-t">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A Bassist You Can Count On
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Jim has extensive live performance and touring experience spanning
              multiple genres. He arrives prepared, reads the room, and locks
              in — exactly what you need from a professional bassist.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you need a dep for a one-off gig, a bass player for a
              full tour, or someone to anchor your showcase, Jim brings
              professionalism and musical sensitivity to every performance.
            </p>
            <ul className="space-y-3">
              {capabilities.map((cap) => (
                <li key={cap} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-2xl border bg-card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                What to Expect
              </h3>
              <div className="space-y-5">
                {[
                  {
                    title: "Prepared & Professional",
                    desc: "Charts learned before the gig. No surprises on stage. Jim takes the prep work seriously so you don't have to worry.",
                  },
                  {
                    title: "Reliable Communication",
                    desc: "Quick responses, clear logistics, and no last-minute drop-outs. You'll know exactly what to expect.",
                  },
                  {
                    title: "Gear Covered",
                    desc: "Jim brings a full, professional rig. No need to source backline. Electric and upright bass both available.",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="space-y-1">
                    <div className="font-semibold">{title}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="py-16 border-t bg-muted/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Genres &amp; Styles
            </h2>
            <p className="text-muted-foreground text-lg">
              Versatile across a wide range of musical contexts.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-5 py-2 rounded-full border bg-card text-sm font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About Jim */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-20 max-w-3xl text-center">
        <div className="inline-block p-4 rounded-full bg-primary/10 border border-primary/10 mb-6">
          <Radio className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          About Jim Bennett
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-4">
          Jim Bennett is a Vancouver-based professional bassist with a degree
          from <strong>McGill University</strong> and a career spanning touring,
          recording, and education. He has built a global audience as an
          educator with millions of YouTube views, demonstrating the depth and
          breadth of his musicianship.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          On stage, Jim brings the same attention to detail he brings to the
          studio — a strong pocket, tasteful note choices, and the ability to
          adapt instantly to any musical situation.
        </p>
      </section>

      {/* CTA */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <Mic2 className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Book Jim for Your Show</h2>
          <p className="text-muted-foreground mb-8">
            Send a message with your date, venue, and genre and Jim will get
            back to you to confirm availability and discuss details.
          </p>
          <Button asChild size="lg" className="rounded-full px-10">
            <ObfuscatedMailto
              user="jim"
              domain="advancebass.com"
              subject="Bassist for Hire Inquiry"
            >
              Check Availability
            </ObfuscatedMailto>
          </Button>
        </div>
      </section>
    </>
  );
}
