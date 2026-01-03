
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Music } from "lucide-react";

export const metadata = {
  title: "Practice Tools | Advance Bass",
  description: "Collection of free online tools for bass players including a metronome and more.",
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-12 max-w-4xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Practice Tools</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Essential tools to help you improve your timing, tuning, and technique.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/tools/metronome" className="block transition-transform hover:scale-105">
          <Card className="h-full hover:border-primary/50 transition-colors">
            <CardHeader>
              <Timer className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Metronome</CardTitle>
              <CardDescription>
                Accurate, adjustable metronome with visual beats and odd time signatures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm font-medium text-primary">Open Tool &rarr;</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tools/tuner" className="block transition-transform hover:scale-105">
          <Card className="h-full hover:border-primary/50 transition-colors">
            <CardHeader>
              <Music className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Bass Tuner</CardTitle>
              <CardDescription>
                Chromatic tuner with microphone input and reference tones for 4, 5, and 6 string basses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm font-medium text-primary">Open Tool &rarr;</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tools/scale-visualizer" className="block transition-transform hover:scale-105">
          <Card className="h-full hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-8 w-8 text-primary mb-2 flex items-center justify-center border-2 border-primary rounded-md text-xs font-bold">
                #:
              </div>
              <CardTitle>Scale Visualizer</CardTitle>
              <CardDescription>
                Interactive fretboard to learn scales and modes on 4, 5, or 6 string basses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm font-medium text-primary">Open Tool &rarr;</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tools/circle-of-fifths" className="block transition-transform hover:scale-105">
          <Card className="h-full hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-8 w-8 text-primary mb-2 flex items-center justify-center border-2 border-primary rounded-full text-xs font-bold">
                5th
              </div>
              <CardTitle>Circle of Fifths</CardTitle>
              <CardDescription>
                Visual guide to key signatures, relative minors, and scale relationships.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-sm font-medium text-primary">Open Tool &rarr;</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
