import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Music, Mic2, Wrench } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 px-4 text-center md:py-32 lg:py-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Elevate Your <span className="text-primary">Low End</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            The ultimate resource for modern bass players. Transcriptions, deep-dive articles, and tools to refine your craft.
          </p>
        </div>
        <div className="space-x-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/articles">
              Start Reading <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full">
            <Link href="/transcriptions">Browse Transcriptions</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 space-y-12 mx-auto px-4 md:px-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Everything you need to advance</h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            From technical exercises to gear analysis, we cover the spectrum of bass guitar mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Music className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Transcriptions</CardTitle>
              <CardDescription>Accurate tabs and notation for modern hits and classics.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Meticulously transcribed bass lines to help you learn faster and more accurately.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Mic2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Deep Dives</CardTitle>
              <CardDescription>Articles on theory, technique, and production.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Go beyond the notes with in-depth analysis of playing styles and tone creation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Wrench className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Tools & Gear</CardTitle>
              <CardDescription>Utilities and reviews for the working musician.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Essential tools for practice and performance, plus honest gear breakdowns.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
