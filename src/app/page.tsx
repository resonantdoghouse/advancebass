import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Timer,
  Mic2,
  Grid,
  Disc,
  MoveRight,
  Music2,
  Repeat,
  Zap,
  FileText,
  Volume2,
  Crosshair,
} from "lucide-react";
import { getAllArticles, Article } from "@/lib/data";
import { FEATURED_TRANSCRIPTION_SLUGS } from "@/lib/featured";
import { TranscriptionCard } from "@/components/content/TranscriptionCard";
import { ToolsGallery } from "@/app/tools/ToolsGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advance Bass | Professional Bass Transcriptions & Resources",
  description:
    "Free high-quality bass transcriptions, technique articles, and gear reviews. Learn bass lines from Daft Punk, Bach, and more.",
};

export default async function Home() {
  const allArticles = await getAllArticles();
  const featuredArticles = FEATURED_TRANSCRIPTION_SLUGS.map((slug) =>
    allArticles.find((article) => article.slug === slug),
  ).filter((article): article is Article => article !== undefined);

  return (
    <>
      <section className="relative overflow-hidden py-24 lg:py-32 xl:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Master the <span className="text-primary">Low End</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              The ultimate suite of professional practice tools and
              transcriptions for the modern bass player.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                <Link href="#tools">
                  Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-8 text-base border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10"
              >
                <Link href="/transcriptions">Browse Transcriptions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
                Transform any YouTube video into a powerful backing track. Loop
                specific sections, slow down complex fills, and analyze harmony
                in real-time.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>A/B Looping</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Speed Control</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Pitch Shifting</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Save Favorites</span>
                </li>
              </ul>
              <Button asChild size="lg" className="rounded-full mt-2">
                <Link href="/tools/video-looper">
                  Launch Looper <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 flex items-center justify-center group-hover:border-primary/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-purple-500/20" />
              <Repeat className="h-24 w-24 text-white/20 group-hover:text-primary transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Practice Tools Section */}
      <section
        id="tools"
        className="container mx-auto px-4 md:px-8 py-24 space-y-16"
      >
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 pb-2">
            Your Digital Woodshed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to practice efficiently, all in one place.
          </p>
        </div>

        <ToolsGallery />
      </section>

      {/* Why Advance Bass Section */}
      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                Why Advance Bass?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Studio-Quality Transcriptions
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Every tab and sheet music is meticulously transcribed and
                      verified for accuracy. No more guessing wrong notes from
                      crowd-sourced sites.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Modern Practice Suite
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Built-in tools that replace expensive apps. From tuning to
                      ear training with real-time feedback, everything runs in
                      your browser.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MoveRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Completely Free</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our mission is to make professional bass education
                      accessible to everyone. No paywalls, no subscriptions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-muted/50 border flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
              <div className="text-center p-8 space-y-4 relative z-10">
                <Music2 className="h-20 w-20 mx-auto text-primary/80 mb-4" />
                <h3 className="text-2xl font-bold">Ready to groove?</h3>
                <p className="text-muted-foreground">
                  Start exploring our library of songs and exercises.
                </p>
                <Button asChild className="rounded-full mt-4">
                  <Link href="/transcriptions">Start Playing Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Transcriptions */}
      <section className="container py-20 space-y-12 mx-auto px-4 md:px-8 border-t">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Transcriptions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Check out some of our most popular and interesting bass
            transcriptions.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <TranscriptionCard key={article.id} article={article} />
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/transcriptions">View All Transcriptions</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
