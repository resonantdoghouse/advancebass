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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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

      {/* Practice Tools Section */}
      <section className="container py-20 space-y-12 mx-auto px-4 md:px-8 bg-muted/30 rounded-3xl">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Practice & Study Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tools designed specifically for bass players to improve timing,
            tuning, and theory knowledge.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/tools/metronome">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
              <CardHeader>
                <Timer className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Metronome</CardTitle>
                <CardDescription>Develop rock-solid timing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Customizable metronome with accent patterns and subdivisions.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/tuner">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
              <CardHeader>
                <Mic2 className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Tuner</CardTitle>
                <CardDescription>Stay in tune</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simple and accurate chromatic tuner for quick adjustments.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/scale-visualizer">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
              <CardHeader>
                <Grid className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Scale Visualizer</CardTitle>
                <CardDescription>Master the fretboard</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize scales and modes across the entire fretboard.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/circle-of-fifths">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
              <CardHeader>
                <Disc className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Circle of Fifths</CardTitle>
                <CardDescription>Understand harmony</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Interactive tool to learn key signatures and harmonic
                  relationships.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/arpeggio-visualizer">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
              <CardHeader>
                <Music2 className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Arpeggio Visualizer</CardTitle>
                <CardDescription>Chord tone mapping</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize chord tones and arpeggios across the fretboard.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tools/video-looper">
            <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
              <CardHeader>
                <Repeat className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Video Looper</CardTitle>
                <CardDescription>Practice with videos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Loop YouTube videos and control speed to master difficult
                  sections.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Featured Transcriptions */}
      <section className="container py-20 space-y-12 mx-auto px-4 md:px-8">
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
    </div>
  );
}
