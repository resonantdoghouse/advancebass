"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useDrumMachine } from "@/hooks/useDrumMachine";
import { useWakeLock } from "@/hooks/useWakeLock";
import { Play, Square, Volume2, Trash2, Music2, Loader2 } from "lucide-react";
import { INSTRUMENTS, PRESETS } from "@/data/drum-patterns";
import { DrumInfoDialog } from "@/components/tools/drum-machine/DrumInfoDialog";
import type { DrumKit } from "@/hooks/useDrumSynth";

const KITS: { id: DrumKit; label: string }[] = [
  { id: "electronic", label: "808" },
  { id: "techno", label: "909" },
  { id: "acoustic", label: "Real" },
  { id: "funk", label: "Funk" },
  { id: "percussion", label: "Perc" },
];

export function DrumMachine() {
  const {
    isPlaying,
    togglePlay,
    bpm,
    setBpm,
    steps,
    setSteps,
    swing,
    setSwing,
    pattern,
    currentStep,
    toggleStep,
    loadPreset,
    clearPattern,
    currentKit,
    setKit,
    samplesLoaded,
  } = useDrumMachine();

  useWakeLock(isPlaying);

  return (
    <Card className="w-full shadow-xl border-t-4 border-t-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Volume2 className="h-6 w-6" />
              Drum Machine
              <DrumInfoDialog />
            </CardTitle>
            <CardDescription>
              Create backing beats with realistic Swing and Sounds.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1 gap-1">
              {KITS.map((kit) => (
                <Button
                  key={kit.id}
                  variant={currentKit === kit.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setKit(kit.id)}
                  className={cn(
                    "text-xs px-2 h-7",
                    currentKit === kit.id &&
                      "bg-background shadow-sm font-semibold",
                  )}
                >
                  {kit.label}
                  {(kit.id === "acoustic" || kit.id === "funk") &&
                    !samplesLoaded &&
                    currentKit === kit.id && (
                      <Loader2 className="ml-1 h-3 w-3 animate-spin" />
                    )}
                </Button>
              ))}
            </div>

            <Button
              variant={isPlaying ? "destructive" : "default"}
              onClick={togglePlay}
              className="w-32"
            >
              {isPlaying ? (
                <Square className="mr-2 h-4 w-4 fill-current" />
              ) : (
                <Play className="mr-2 h-4 w-4 fill-current" />
              )}
              {isPlaying ? "Stop" : "Play"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 p-4 bg-muted/50 rounded-lg items-center justify-between">
          <div className="space-y-4 w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tempo</span>
                  <span className="text-sm font-mono text-primary font-bold">
                    {bpm} BPM
                  </span>
                </div>
                <Slider
                  value={[bpm]}
                  onValueChange={(vals) => setBpm(vals[0])}
                  min={40}
                  max={200}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Swing (Groove)</span>
                  <span className="text-sm font-mono text-primary font-bold">
                    {swing}%
                  </span>
                </div>
                <Slider
                  value={[swing]}
                  onValueChange={(vals) => setSwing(vals[0])}
                  min={0}
                  max={80} // Cap at 80 for sanity
                  step={1}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Steps</span>
                <span className="text-sm font-mono text-primary font-bold">
                  {steps}
                </span>
              </div>
              <Slider
                value={[steps]}
                onValueChange={(vals) => setSteps(vals[0])}
                min={4}
                max={16}
                step={1} // Allow odd steps!
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-end max-w-sm">
            {PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => loadPreset(preset)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={clearPattern}
              title="Clear Pattern"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Sequencer Grid */}
        <div className="space-y-4 overflow-x-auto pt-1 pb-4 custom-scrollbar">
          {INSTRUMENTS.map((inst) => (
            <div key={inst} className="flex items-center gap-2 min-w-max">
              <div className="w-16 text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                {inst === "kick" && <Music2 className="w-3 h-3" />}
                {inst}
              </div>
              {/* Dynamic Grid */}
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${steps}, minmax(0, 1fr))`,
                  width: steps * 40,
                }}
              >
                {pattern[inst].slice(0, steps).map((isActive, step) => (
                  <button
                    key={step}
                    onClick={() => toggleStep(inst, step)}
                    aria-pressed={isActive}
                    aria-label={`${inst}, step ${step + 1}, ${isActive ? "on" : "off"}`}
                    className={cn(
                      "w-9 h-12 rounded-sm border transition-all duration-75 relative",
                      isActive
                        ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                        : "bg-muted/30 border-muted hover:border-primary/50",
                      step % 4 === 0 && !isActive && "bg-muted/60",
                      currentStep === step &&
                        "ring-2 ring-foreground brightness-125 z-10",
                    )}
                  >
                    {currentStep === step && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
