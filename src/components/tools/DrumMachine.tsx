"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { useDrumSynth } from "@/hooks/useDrumSynth";
import {
  Play,
  Square,
  Volume2,
  Trash2,
  Settings2,
  Music2,
  Loader2,
} from "lucide-react";
import {
  Instrument,
  Pattern,
  MAX_STEPS,
  INSTRUMENTS,
  DEFAULT_PATTERN,
  PRESETS,
} from "@/data/drum-patterns";

export function DrumMachine() {
  const {
    playKick,
    playSnare,
    playHiHat,
    playOpenHat,
    playRide,
    playTom,
    resumeContext,
    getCurrentTime,
    currentKit,
    setKit,
    samplesLoaded,
  } = useDrumSynth();

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [steps, setSteps] = useState(16);
  const [swing, setSwing] = useState(0); // 0 to 100%
  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);
  const [currentStep, setCurrentStep] = useState(0);

  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  const lookahead = 25.0;
  const scheduleAheadTime = 0.1;

  // Refs
  const bpmRef = useRef(bpm);
  const stepsRef = useRef(steps);
  const swingRef = useRef(swing);
  const patternRef = useRef(pattern);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);
  useEffect(() => {
    swingRef.current = swing;
  }, [swing]);
  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  // Audio Scheduler
  const nextNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    // Base step duration (16th note)
    const stepDuration = 0.25 * secondsPerBeat;

    // We increment TIME by the 'straight' duration + swing offset?
    // No, 'nextNoteTimeRef' tracks the THEORETICAL grid.
    // Swing is applied as a playback OFFSET when scheduling the specific note.
    // The grid itself advances consistently?
    // Actually, easier way:
    // Step 0 -> Step 1 (straight time)
    // Audio Event for Step 1 is delayed if it's an offbeat.
    // So nextNoteTimeRef advances rigidly.

    // Wait, if we delay the audio, we don't want to delay the grid advancement logic
    // UNLESS we want the "next note" text call to be accurate.
    // Let's keep nextNoteTimeRef on the STRAIGHT grid.
    nextNoteTimeRef.current += stepDuration;

    currentStepRef.current = (currentStepRef.current + 1) % stepsRef.current;
  }, []);

  const scheduleNote = useCallback(
    (stepNumber: number, time: number) => {
      const isOffbeat = stepNumber % 2 !== 0;
      const secondsPerBeat = 60.0 / bpmRef.current;
      const stepDuration = 0.25 * secondsPerBeat;

      const swingDelay = isOffbeat
        ? (swingRef.current / 100) * (stepDuration * 0.66)
        : 0;

      const playTime = time + swingDelay;

      // Audio
      if (patternRef.current.kick[stepNumber]) playKick(playTime);
      if (patternRef.current.snare[stepNumber]) playSnare(playTime);
      if (patternRef.current.hihat[stepNumber]) playHiHat(playTime);
      if (patternRef.current.ride[stepNumber]) playRide(playTime);
      if (patternRef.current.openhat[stepNumber]) playOpenHat(playTime);
      if (patternRef.current.tom[stepNumber]) playTom(playTime);

      // Visual (approximate)
      const drawTime = (playTime - getCurrentTime()) * 1000;
      setTimeout(
        () => {
          setCurrentStep(stepNumber);
        },
        Math.max(0, drawTime),
      );
    },
    [
      playKick,
      playSnare,
      playHiHat,
      playOpenHat,
      playRide,
      playTom,
      getCurrentTime,
    ],
  );

  const scheduler = useCallback(() => {
    const currentTime = getCurrentTime();

    while (nextNoteTimeRef.current < currentTime + scheduleAheadTime) {
      scheduleNote(currentStepRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  }, [nextNote, scheduleNote, getCurrentTime]);

  const togglePlay = () => {
    if (isPlaying) {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
      setIsPlaying(false);
    } else {
      resumeContext();
      // Start perfectly on grid
      nextNoteTimeRef.current = getCurrentTime() + 0.1;
      currentStepRef.current = 0;
      setIsPlaying(true);
      scheduler();
    }
  };

  useEffect(() => {
    return () => {
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
    };
  }, []);

  const toggleStep = (instrument: Instrument, stepIndex: number) => {
    setPattern((prev) => ({
      ...prev,
      [instrument]: prev[instrument].map((val, i) =>
        i === stepIndex ? !val : val,
      ),
    }));
  };

  const loadPreset = (preset: (typeof PRESETS)[0]) => {
    const newPattern = { ...DEFAULT_PATTERN };
    (Object.keys(preset.pattern) as Instrument[]).forEach((inst) => {
      const p = preset.pattern[inst];
      newPattern[inst] = newPattern[inst].map((_, i) => p[i] || false);
    });

    setPattern(newPattern);
    setBpm(preset.bpm);
    setSteps(preset.steps);
    setSwing(preset.swing || 0);
  };

  const clearPattern = () => {
    setPattern({
      kick: Array(MAX_STEPS).fill(false),
      snare: Array(MAX_STEPS).fill(false),
      hihat: Array(MAX_STEPS).fill(false),
      openhat: Array(MAX_STEPS).fill(false),
      ride: Array(MAX_STEPS).fill(false),
      tom: Array(MAX_STEPS).fill(false),
    });
  };

  return (
    <Card className="w-full shadow-xl border-t-4 border-t-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Volume2 className="h-6 w-6" />
              Drum Machine
            </CardTitle>
            <CardDescription>
              Create backing beats with realistic Swing and Sounds.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1 gap-1">
              {[
                { id: "electronic", label: "808" },
                { id: "techno", label: "909" },
                { id: "acoustic", label: "Real" },
                { id: "funk", label: "Funk" },
                { id: "percussion", label: "Perc" },
              ].map((kit) => (
                <Button
                  key={kit.id}
                  variant={currentKit === kit.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setKit(kit.id as any)}
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
        <div className="space-y-4 overflow-x-auto pb-4 custom-scrollbar">
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
