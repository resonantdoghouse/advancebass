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
} from "lucide-react";
import { getAllArticles } from "@/lib/data";
import { FEATURED_TRANSCRIPTION_SLUGS } from "@/lib/featured";
import { TranscriptionCard } from "@/components/content/TranscriptionCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advance Bass | Professional Bass Transcriptions & Resources",
  description:
    "Free high-quality bass transcriptions, technique articles, and gear reviews. Learn bass lines from Daft Punk, Bach, and more.",
};

export default async function Home() {
  const allArticles = await getAllArticles();
  const featuredArticles = FEATURED_TRANSCRIPTION_SLUGS.map((slug) =>
    allArticles.find((article) => article.slug === slug)
  ).filter((article) => article !== undefined); // Simple way to filter out not founds securely

  return (
    <>
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 px-4 text-center md:py-32 lg:py-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Bass Transcriptions &{" "}
            <span className="text-primary">Practice Tools</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Professional transcriptions and interactive study tools to master
            the low end.
          </p>
        </div>
        <div className="space-x-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/transcriptions">
              Browse Transcriptions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Feature Spotlight: Video Looper */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-background to-muted/50 border border-primary/20 shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative grid gap-8 lg:grid-cols-2 p-8 md:p-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                New Feature
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Master Any Song with the <br className="hidden lg:block" />
                <span className="text-primary">Video Looper</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Practice effectively with our advanced YouTube looper. Detect
                notes and chords in real-time, slow down difficult sections
                without changing pitch, and loop specific parts until you nail
                them.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-primary" />
                  <span>Precise A/B Looping controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-primary" />
                  <span>Variable speed playback (50% - 200%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mic2 className="h-4 w-4 text-primary" />
                  <span>AI-powered Real-time Note & Chord Detection</span>
                </li>
              </ul>
              <Button asChild size="lg" className="mt-4 rounded-full">
                <Link href="/tools/video-looper">
                  Try Video Looper <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border bg-black/50 flex items-center justify-center group">
              {/* Abstract Representation of the Tool */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
              <Repeat className="h-24 w-24 text-primary/50 group-hover:text-primary transition-colors duration-500 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* Practice Tools Section */}
      <section className="container py-20 space-y-12 mx-auto px-4 md:px-8 bg-muted/30 rounded-3xl">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Essential Practice Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Curated collection of interactive utilities designed to accelerate
            your bass playing progress.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/tools/metronome">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20 group">
              <CardHeader>
                <Timer className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle>Metronome</CardTitle>
                <CardDescription>Develop Internal Clock</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced metronome with subdivision controls, accent patterns,
                  and tap tempo.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/tuner">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20 group">
              <CardHeader>
                <Mic2 className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle>Tuner</CardTitle>
                <CardDescription>Precision Tuning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Chromatic tuner with high-accuracy frequency detection for 4,
                  5, and 6 string basses.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/scale-visualizer">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20 group">
              <CardHeader>
                <Grid className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle>Scale Visualizer</CardTitle>
                <CardDescription>Fretboard Mastery</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Interactive fretboard map for all modes, scales, and keys.
                  perfect for memorization.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/circle-of-fifths">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20 group">
              <CardHeader>
                <Disc className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle>Circle of Fifths</CardTitle>
                <CardDescription>Theory Decoder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visual reference for key signatures, relative minors, and
                  harmonic progression.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/arpeggio-visualizer">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20 group">
              <CardHeader>
                <Music2 className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle>Arpeggios</CardTitle>
                <CardDescription>Chord Tones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Map chord tones across the neck. Essential for walking bass
                  lines and improvisation.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/video-looper">
            <Card className="h-full bg-primary/5 hover:bg-primary/10 border-primary/40 transition-colors cursor-pointer group">
              <CardHeader>
                <Repeat className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle>Video Looper</CardTitle>
                <CardDescription>Practice Assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The ultimate practice tool. Loop, slow down, and analyze
                  YouTube videos.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
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
            <TranscriptionCard key={article.id} article={article as any} />
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
