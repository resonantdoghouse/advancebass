import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Repeat,
  Zap,
  FileText,
  MoveRight,
  MapPin,
  Globe,
  Mic2,
  Music2,
} from "lucide-react";
import { getAllArticles, Article } from "@/lib/data";
import { FEATURED_TRANSCRIPTION_SLUGS } from "@/lib/featured";
import { TranscriptionCard } from "@/components/content/TranscriptionCard";
import { ToolsGallery } from "@/app/tools/ToolsGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Advance Bass | Online & Vancouver Bass Lessons, Transcriptions & Tools",
  description:
    "Professional bass instruction by Jim Bennett. In-person lessons in Vancouver, BC and online lessons worldwide. Plus free transcriptions and practice tools.",
};

export default async function Home() {
  const allArticles = await getAllArticles();
  const featuredArticles = FEATURED_TRANSCRIPTION_SLUGS.map((slug) =>
    allArticles.find((article) => article.slug === slug),
  ).filter((article): article is Article => article !== undefined);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32 xl:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-8xl">
              Master the <span className="text-primary">Low End</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              Free professional bass tools, studio-quality transcriptions, and
              expert instruction — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="h-12 w-full sm:w-auto rounded-full px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                <Link href="/tools">
                  Explore Tools <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full sm:w-auto rounded-full px-8 text-base border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm hover:bg-black/10 dark:hover:bg-white/10"
              >
                <Link href="/transcriptions">Browse Transcriptions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value-prop strip */}
      <div className="border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-6 md:gap-14 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary shrink-0" />
              <span>10 free practice tools</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              <span>Studio-quality transcriptions</span>
            </div>
            <div className="flex items-center gap-2">
              <MoveRight className="h-4 w-4 text-primary shrink-0" />
              <span>No account required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Spotlight: Video Looper */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-card to-background border border-primary/10 shadow-2xl transition-transform hover:-translate-y-1 duration-500">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative grid gap-8 lg:grid-cols-2 p-8 md:p-12 lg:p-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-sm">
                <Repeat className="h-5 w-5" />
                Featured Tool
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Video Looper
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Transform any YouTube video into a powerful practice backing track.
                Loop specific sections, slow down complex fills, and analyze harmony
                in real-time.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-muted-foreground">
                {["A/B Looping", "Speed Control", "Pitch Shifting", "Save Favorites"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="rounded-full mt-2">
                <Link href="/tools/video-looper">
                  Launch Looper <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 bg-black/40 flex items-center justify-center group-hover:border-primary/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-purple-500/20" />
              <Repeat className="h-24 w-24 text-white/20 group-hover:text-primary transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            </div>
          </div>
        </div>
      </section>

      {/* All Practice Tools */}
      <section
        id="tools"
        className="container mx-auto px-4 md:px-8 py-16 md:py-24 space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 pb-2">
            Your Digital Woodshed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to practice smarter, all free and in your browser.
          </p>
        </div>

        <ToolsGallery />
      </section>

      {/* Featured Transcriptions */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-24 space-y-12 border-t border-border/40">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Transcriptions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Meticulously verified bass tabs and sheet music — no guessing, no
            crowd-sourced errors.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <TranscriptionCard key={article.id} article={article} />
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/transcriptions">View All Transcriptions</Link>
          </Button>
        </div>
      </section>

      {/* Jim Bennett — compact strip */}
      <section className="border-t border-border/40 bg-muted/10">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 items-center">

            {/* Bio */}
            <div className="md:col-span-2 space-y-5">
              <div className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-xs">
                <Music2 className="h-4 w-4" />
                Bass Lessons &amp; More
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Study with Jim Bennett
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Professional bassist, educator, and producer with a{" "}
                <a
                  href="https://www.youtube.com/@JimBennettBassist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  YouTube community built on millions of views
                </a>
                . Specializing in Slap, Tap, Fingerstyle, Jazz harmony, and
                advanced technique for both Electric and Upright bass.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  Vancouver, BC — In-person
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  Online worldwide via Zoom
                </span>
                <span className="flex items-center gap-1.5">
                  <Mic2 className="h-4 w-4 text-primary shrink-0" />
                  Recording &amp; production
                </span>
              </div>
            </div>

            {/* CTA card */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card border shadow-sm">
              <p className="text-sm text-muted-foreground">
                Ready to take your playing to the next level?
              </p>
              <Button asChild size="lg" className="w-full rounded-full">
                <Link href="/contact">
                  Book a Lesson <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link href="/bass-lessons">Learn More</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
