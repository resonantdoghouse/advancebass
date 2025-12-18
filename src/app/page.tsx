import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advance Bass | Professional Bass Transcriptions & Resources",
  description: "Free high-quality bass transcriptions, technique articles, and gear reviews. Learn bass lines from Daft Punk, Bach, and more.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 px-4 text-center md:py-32 lg:py-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Professional Bass <span className="text-primary">Transcriptions</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            High-quality, accurate transcriptions of modern and classic bass lines, completely free.
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

      {/* Featured Transcriptions Preview or simple statement */}
      <section className="container py-12 space-y-12 mx-auto px-4 md:px-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Featuring transcriptions from Daft Punk, Bach, TV Themes, and more.
          </p>
        </div>
      </section>
    </div>
  );
}
