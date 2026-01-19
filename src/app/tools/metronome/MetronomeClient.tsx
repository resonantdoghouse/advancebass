"use client";

import { Metronome } from "@/components/tools/Metronome";
import React, { useState, useEffect } from "react";

export default function MetronomeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] w-full bg-background transition-colors duration-700">
        <div className="container mx-auto py-12 px-4 space-y-12 max-w-5xl">
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
    <div className="min-h-[calc(100vh-4rem)] w-full transition-all duration-700 relative isolate bg-background text-foreground">
      <div className="container mx-auto py-12 px-4 space-y-16 max-w-5xl">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight lg:text-6xl drop-shadow-sm">
            Metronome
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium text-muted-foreground">
            A simple, accurate, and free online metronome for your daily
            practice.
          </p>
        </div>

        <Metronome />

        {/* Features / Instructions Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="metro-card bg-card/50 backdrop-blur-md rounded-2xl p-8 border metro-border border-border shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📖</span> How to use
            </h2>
            <p className="opacity-90 leading-relaxed text-lg text-muted-foreground">
              This metronome simulates a real click track to help you keep time
              while practicing. Use the slider or the buttons to adjust the BPM
              (Beats Per Minute). You can also change the time signature to
              practice odd meters like 5/4 or 7/8.
            </p>
          </div>

          <div className="metro-card bg-card/50 backdrop-blur-md rounded-2xl p-8 border metro-border border-border shadow-lg space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> Features
            </h2>
            <ul className="space-y-4 text-muted-foreground">
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
