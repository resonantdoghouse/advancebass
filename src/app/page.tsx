import Link from "next/link";
import { getAllArticles, Article } from "@/lib/data";
import { FEATURED_TRANSCRIPTION_SLUGS } from "@/lib/featured";
import { TranscriptionCard } from "@/components/content/TranscriptionCard";
import { Metadata } from "next";
import {
  Timer,
  Music,
  Repeat,
  Volume2,
  Ear,
  ArrowRight,
  Guitar,
  RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Advance Bass | Online & Vancouver Bass Lessons, Transcriptions & Tools",
  description:
    "Professional bass instruction by Jim Bennett. In-person lessons in Vancouver, BC and online lessons worldwide. Plus free transcriptions and practice tools.",
};

const FEATURED_TOOLS = [
  {
    id: "tuner",
    title: "Chromatic Tuner",
    description: "Cents-accurate pitch detection. Chromatic, bass, and guitar modes with strobe visualization.",
    href: "/tools/tuner",
    icon: <Music className="h-5 w-5" />,
  },
  {
    id: "metronome",
    title: "Metronome",
    description: "Precise BPM scheduling with subdivisions, tap-tempo, and odd time signatures.",
    href: "/tools/metronome",
    icon: <Timer className="h-5 w-5" />,
  },
  {
    id: "video-looper",
    title: "Video Looper",
    description: "Loop any YouTube section, control speed and pitch — your practice backing track.",
    href: "/tools/video-looper",
    icon: <Repeat className="h-5 w-5" />,
  },
  {
    id: "ear-training",
    title: "Ear Training",
    description: "Identify intervals and chord qualities by ear. Timed game for all levels.",
    href: "/tools/ear-training",
    icon: <Ear className="h-5 w-5" />,
  },
  {
    id: "drum-machine",
    title: "Drum Machine",
    description: "Program drum patterns and grooves to back your bass practice sessions.",
    href: "/tools/drum-machine",
    icon: <Volume2 className="h-5 w-5" />,
  },
  {
    id: "scale-visualizer",
    title: "Scale Visualizer",
    description: "Interactive fretboard to learn scales and modes on 4, 5, or 6 string basses.",
    href: "/tools/scale-visualizer",
    icon: <Guitar className="h-5 w-5" />,
  },
  {
    id: "arpeggio-visualizer",
    title: "Arpeggio Visualizer",
    description: "Visualize chord tones and arpeggios across the fretboard.",
    href: "/tools/arpeggio-visualizer",
    icon: <RefreshCw className="h-5 w-5" />,
  },
  {
    id: "circle-of-fifths",
    title: "Circle of Fifths",
    description: "Visual guide to key signatures, relative minors, and scale relationships.",
    href: "/tools/circle-of-fifths",
    icon: <span className="text-[11px] font-bold leading-none">5ths</span>,
  },
];

export default async function Home() {
  const allArticles = await getAllArticles();
  const featuredArticles = FEATURED_TRANSCRIPTION_SLUGS.map((slug) =>
    allArticles.find((article) => article.slug === slug),
  ).filter((article): article is Article => article !== undefined);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">

          {/* Copy */}
          <div>
            <h1 className="font-heading font-bold text-[52px] sm:text-[62px] lg:text-[68px] leading-[1.0] tracking-[-0.03em] mb-6">
              Master the<br />
              <span className="text-primary">Low End.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-[440px]">
              Free professional tools, studio-quality transcriptions, and expert
              instruction from a working bassist — all in your browser.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="/tools"
                className="bg-primary text-primary-foreground font-bold text-[15px] px-7 py-3.5 rounded-[11px] hover:opacity-90 transition-opacity"
              >
                Explore Free Tools
              </Link>
              <Link
                href="/transcriptions"
                className="flex items-center gap-2 font-semibold text-[15px] text-foreground px-6 py-3.5 border border-border rounded-[11px] hover:bg-muted/50 transition-colors"
              >
                Browse Transcriptions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>

          {/* Tuner mockup card */}
          <div className="relative">
            {/* glow — dark mode only */}
            <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl pointer-events-none dark:opacity-100 opacity-0 transition-opacity" />

            <div className="relative bg-card border border-border rounded-[22px] p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)]">
              {/* Header row */}
              <div className="flex justify-between items-center mb-7">
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                  Chromatic Tuner
                </span>
                <span className="font-mono text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  IN TUNE
                </span>
              </div>

              {/* Note display */}
              <div className="text-center">
                <span className="font-heading text-[82px] font-bold tracking-[-0.04em] leading-none">
                  A<sup className="text-3xl text-muted-foreground align-super">4</sup>
                </span>
              </div>
              <div className="font-mono text-sm text-muted-foreground text-center mt-1 mb-6">
                440.0 Hz
              </div>

              {/* Gauge */}
              <div className="relative h-2 rounded-full bg-muted mb-2.5">
                <div className="absolute left-0 top-0 bottom-0 w-1/2 border-r border-border/50" />
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-[5px] w-1 h-[18px] rounded-full bg-emerald-500"
                  style={{ boxShadow: "0 0 12px rgba(74,222,128,0.65)" }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground/60 mb-7">
                <span>−50</span><span>0</span><span>+50</span>
              </div>

              {/* String buttons */}
              <div className="flex gap-2">
                {(["E", "A", "D", "G"] as const).map((note) => (
                  <span
                    key={note}
                    className={`flex-1 text-center font-mono text-sm py-2.5 rounded-[8px] ${
                      note === "D"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-9 gap-4 flex-wrap">
          <h2 className="font-heading font-bold text-[32px] sm:text-[36px] tracking-[-0.025em] leading-[1.08] max-w-[440px]">
            Everything you'd open six apps for
          </h2>
          <span className="font-mono text-xs text-muted-foreground tracking-[0.05em]">
            08 TOOLS · IN YOUR BROWSER
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_TOOLS.map((tool, i) => {
            const isAccent = i === 2; // Video Looper gets the accent card
            return (
              <Link key={tool.id} href={tool.href} className="group block">
                <div
                  className={`h-full rounded-[16px] p-6 border transition-all duration-200 hover:-translate-y-0.5 ${
                    isAccent
                      ? "bg-foreground text-background border-foreground dark:bg-gradient-to-br dark:from-primary dark:to-blue-600 dark:border-primary dark:shadow-[0_0_40px_-10px_rgba(91,155,255,0.5)]"
                      : "bg-card border-border hover:border-primary/40 hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-5 ${
                      isAccent
                        ? "bg-white/15"
                        : "bg-secondary text-primary"
                    }`}
                  >
                    <span className={isAccent ? "text-white dark:text-white" : "text-primary"}>
                      {tool.icon}
                    </span>
                  </div>
                  <h3
                    className={`font-semibold text-[16px] mb-2 ${
                      isAccent ? "text-background dark:text-white" : "text-foreground"
                    }`}
                  >
                    {tool.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      isAccent ? "text-background/70 dark:text-white/75" : "text-muted-foreground"
                    }`}
                  >
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </section>

      {/* ── Scale / fretboard spotlight ───────────────────────────── */}
      <section className="border-t border-border/60">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">

            {/* Copy */}
            <div>
              <span className="font-mono text-xs tracking-[0.1em] text-primary uppercase">
                Scale Visualizer
              </span>
              <h2 className="font-heading font-bold text-[32px] sm:text-[36px] tracking-[-0.025em] leading-[1.06] mt-3.5 mb-4">
                See every scale<br />light up under<br />your fingers.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-[380px]">
                Pick a key and a mode — the fretboard maps every shape across
                4, 5, or 6-string bass in any tuning. Scales, arpeggios, and
                chord tones at a glance.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["Dorian", "Pentatonic", "Harmonic Minor"].map((mode, i) => (
                  <span
                    key={mode}
                    className={`text-sm font-semibold px-3.5 py-2 rounded-full ${
                      i === 0
                        ? "bg-secondary text-primary"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {mode}
                  </span>
                ))}
              </div>
              <Link
                href="/tools/scale-visualizer"
                className="inline-flex items-center gap-2 mt-6 font-semibold text-sm text-primary hover:underline"
              >
                Open Scale Visualizer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Fretboard card — always dark regardless of theme */}
            <div className="rounded-[18px] p-7" style={{ background: "#0c1424" }}>
              <div className="flex justify-between mb-5">
                <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: "#5b9bff" }}>A DORIAN</span>
                <span className="font-mono text-[11px]" style={{ color: "#5b6b85" }}>EADG</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { string: "G", dots: [true, false, false, true, false] },
                  { string: "D", dots: [false, true, false, true, false] },
                  { string: "A", dots: [true, false, true, false, false] },
                  { string: "E", dots: [false, true, false, false, true] },
                ].map(({ string, dots }) => (
                  <div key={string} className="flex gap-2.5 items-center">
                    <span className="font-mono text-[10px] w-3.5 shrink-0" style={{ color: "#475569" }}>
                      {string}
                    </span>
                    <div className="flex-1 flex gap-2">
                      {dots.map((filled, j) => (
                        <div
                          key={j}
                          className="flex-1 h-6 rounded-[6px] flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          {filled && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                background: j === 0 ? "#3056d3" : "#5b9bff",
                                boxShadow: j === 0 ? "0 0 8px rgba(91,155,255,0.5)" : "none",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Transcriptions ───────────────────────────────── */}
      <section className="border-t border-border/60">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10 space-y-3">
            <h2 className="font-heading font-bold text-[30px] sm:text-[34px] tracking-[-0.025em]">
              Featured Transcriptions
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Meticulously verified bass tabs and sheet music — no guessing,
              no crowd-sourced errors.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <TranscriptionCard key={article.id} article={article} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link
              href="/transcriptions"
              className="inline-flex items-center gap-2 font-semibold text-sm border border-border px-5 py-2.5 rounded-full hover:bg-muted/50 transition-colors"
            >
              View All Transcriptions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Attribution ───────────────────────────────────────────── */}
      <section className="border-t border-border/60">
        <div className="container mx-auto px-4 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Tools and transcriptions by{" "}
            <a
              href="https://www.youtube.com/@JimBennettBassist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium hover:text-primary transition-colors"
            >
              Jim Bennett
            </a>
            {" "}— professional bassist and educator based in Vancouver, BC.
          </p>
          <Link
            href="/bass-lessons"
            className="shrink-0 text-foreground font-medium hover:text-primary transition-colors"
          >
            Bass lessons →
          </Link>
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────────────── */}
      <section className="bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-heading font-bold text-[34px] sm:text-[38px] tracking-[-0.025em] leading-[1.05] mb-3">
              Start practicing tonight.
            </h2>
            <p className="text-background/70 text-[17px] leading-relaxed max-w-[420px]">
              Free tools and studio-quality transcriptions — no account, no signup.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0 flex-wrap">
            <Link
              href="/tools"
              className="bg-background text-foreground font-bold text-[15px] px-7 py-3.5 rounded-[11px] hover:opacity-90 transition-opacity"
            >
              Open Practice Tools
            </Link>
            <Link
              href="/transcriptions"
              className="border border-background/30 text-background font-bold text-[15px] px-7 py-3.5 rounded-[11px] hover:bg-background/10 transition-colors"
            >
              Browse Transcriptions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
