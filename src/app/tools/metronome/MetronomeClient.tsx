"use client";

import { Metronome, Theme, THEMES } from "@/components/tools/Metronome";
import React, { useState, useEffect } from "react";

const PAGE_THEMES: Record<Theme, string> = {
  default: "bg-background text-foreground",
  wood: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-950 via-neutral-900 to-black text-amber-50 [&_.metro-border]:border-amber-500/20",
  forest:
    "bg-[linear-gradient(to_bottom_right,_var(--tw-gradient-stops))] from-green-950 via-slate-900 to-black text-emerald-50 [&_.metro-border]:border-emerald-500/20",
  marble:
    "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-100 via-stone-50 to-zinc-200 text-zinc-900 [&_.metro-border]:border-zinc-300 [&_.metro-card]:bg-white/40",
  emerald:
    "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-950 via-teal-950 to-slate-950 text-teal-50 [&_.metro-border]:border-teal-500/20",
  stone:
    "bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black text-slate-50 [&_.metro-border]:border-slate-500/20",
};

export default function MetronomeClient() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("metronome-theme");
    if (saved && THEMES.some((t) => t.id === saved)) {
      setCurrentTheme(saved as Theme);
    }
    setMounted(true);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("metronome-theme", theme);
  };

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] w-full bg-background transition-colors duration-700">
        <div className="container mx-auto py-12 px-4 space-y-12 max-w-5xl">
          {/* Skeleton or loading state to prevent flash */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Metronome
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, accurate, and free online metronome for your daily
              practice.
            </p>
          </div>
          <div className="w-full max-w-3xl mx-auto h-[400px] bg-card/50 rounded-xl border-2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] w-full transition-all duration-700 relative isolate ${PAGE_THEMES[currentTheme]}`}
    >
      <div className="container mx-auto py-12 px-4 space-y-16 max-w-5xl">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight lg:text-6xl drop-shadow-sm">
            Metronome
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium">
            A simple, accurate, and free online metronome for your daily
            practice.
          </p>
        </div>

        <Metronome theme={currentTheme} onThemeChange={handleThemeChange} />

        {/* Features / Instructions Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="metro-card bg-background/5 backdrop-blur-md rounded-2xl p-8 border metro-border border-white/10 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📖</span> How to use
            </h2>
            <p className="opacity-90 leading-relaxed text-lg">
              This metronome simulates a real click track to help you keep time
              while practicing. Use the slider or the buttons to adjust the BPM
              (Beats Per Minute). You can also change the time signature to
              practice odd meters like 5/4 or 7/8.
            </p>
          </div>

          <div className="metro-card bg-background/5 backdrop-blur-md rounded-2xl p-8 border metro-border border-white/10 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> Features
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start opacity-90">
                <div className="mt-1 bg-primary/20 p-1 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <span>
                  <strong>BPM Control:</strong> Adjust from 30 to 300 BPM with
                  tap tempo support.
                </span>
              </li>
              <li className="flex gap-3 items-start opacity-90">
                <div className="mt-1 bg-primary/20 p-1 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <span>
                  <strong>Time Signatures:</strong> Full numerator/denominator
                  support for complex meters.
                </span>
              </li>
              <li className="flex gap-3 items-start opacity-90">
                <div className="mt-1 bg-primary/20 p-1 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <span>
                  <strong>Visual Cues:</strong> High-visibility accent
                  indicators and animations.
                </span>
              </li>
              <li className="flex gap-3 items-start opacity-90">
                <div className="mt-1 bg-primary/20 p-1 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <span>
                  <strong>Premium Themes:</strong> Accessible, Zen-inspired
                  designs for any environment.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
