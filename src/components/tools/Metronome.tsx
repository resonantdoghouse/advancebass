"use client";

import { useMetronome } from "@/hooks/useMetronome";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Square,
  GripHorizontal,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Timer as TimerIcon,
  Hand,
  RotateCcw,
} from "lucide-react";
import React, { memo, useState, useEffect } from "react";

interface MetronomeProps {
  compact?: boolean;
}

const TONE_OPTIONS = ["digital", "woodblock", "drum", "ping", "blip"] as const;

// Extracted Timer Component
const SessionTimer = memo(() => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono tabular-nums bg-muted/50 border-border">
      <TimerIcon className="h-3 w-3 opacity-70" />
      <span className="min-w-[48px] text-center">{formatTime(time)}</span>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="hover:text-primary transition-colors"
        title={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? (
          <Square className="h-3 w-3 fill-current" />
        ) : (
          <Play className="h-3 w-3 fill-current" />
        )}
      </button>
      <button
        onClick={() => {
          setIsRunning(false);
          setTime(0);
        }}
        className="hover:text-primary transition-colors"
        title="Reset"
      >
        <RotateCcw className="h-3 w-3" />
      </button>
    </div>
  );
});
SessionTimer.displayName = "SessionTimer";

// Beats Display
const BeatsDisplay = memo(
  ({
    accentPattern,
    currentBeat,
    isPlaying,
    toggleAccent,
  }: {
    accentPattern: number[];
    currentBeat: number;
    isPlaying: boolean;
    toggleAccent: (index: number) => void;
  }) => (
    <div className="flex justify-center gap-2 mb-4 h-8 items-center">
      {accentPattern.map((level, i) => (
        <button
          key={i}
          onClick={() => toggleAccent(i)}
          className={`rounded-full transition-all duration-75 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring
            ${
              level === 2
                ? "h-5 w-5 shadow-[0_0_12px_theme(colors.primary.DEFAULT)]"
                : level === 1
                  ? "h-4 w-4"
                  : "h-3 w-3 opacity-30"
            } 
            ${
              currentBeat === i && isPlaying && level !== 0
                ? "bg-primary scale-125 brightness-125"
                : level === 0
                  ? "bg-muted-foreground"
                  : level === 2
                    ? "bg-primary"
                    : "bg-primary/70"
            }
          `}
          title={level === 2 ? "Accent" : level === 1 ? "Normal" : "Mute"}
        />
      ))}
    </div>
  ),
);
BeatsDisplay.displayName = "BeatsDisplay";

export function Metronome({ compact = false }: MetronomeProps) {
  const {
    isPlaying,
    start,
    stop,
    bpm,
    setBpm,
    beatsPerMeasure,
    setBeatsPerMeasure,
    noteValue,
    setNoteValue,
    currentBeat,
    subdivision,
    setSubdivision,
    tone,
    setTone,
    accentPattern,
    toggleAccent,
    volume,
    setVolume,
    tapTempo,
  } = useMetronome();

  // Memoized handlers
  const handleBpmChange = (value: number[]) => setBpm(value[0]);
  const handleHalfTime = () => setBpm(Math.floor(bpm / 2));
  const handleDoubleTime = () => setBpm(Math.min(300, bpm * 2));
  const togglePlay = isPlaying ? stop : start;
  const decreaseBeats = () =>
    setBeatsPerMeasure(Math.max(1, beatsPerMeasure - 1));
  const increaseBeats = () =>
    setBeatsPerMeasure(Math.min(16, beatsPerMeasure + 1));
  const decreaseNoteValue = () => setNoteValue(Math.max(1, noteValue / 2));
  const increaseNoteValue = () => setNoteValue(Math.min(32, noteValue * 2));

  return (
    <Card
      className={`shadow-xl border-2 transition-colors duration-300 bg-card border-border text-card-foreground ${
        compact ? "w-64" : "w-full max-w-3xl mx-auto"
      }`}
    >
      {compact && (
        <div className="flex justify-center h-5 items-center cursor-move text-muted-foreground/50 hover:text-foreground/80">
          <GripHorizontal className="h-4 w-4" />
        </div>
      )}

      <CardContent className={`p-6 ${compact ? "pt-0 space-y-3" : "pt-8"}`}>
        <div className={`grid gap-8 ${compact ? "" : "md:grid-cols-2"}`}>
          {/* Left Column: Main Controls */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <div className="text-6xl font-black tabular-nums leading-none tracking-tighter">
                  {bpm}
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
                  BPM
                </span>
              </div>

              <div className="flex gap-2 mb-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleHalfTime}
                  title="Half Time"
                  className="h-9 w-9"
                >
                  <Rewind className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDoubleTime}
                  title="Double Time"
                  className="h-9 w-9"
                >
                  <FastForward className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Slider
              value={[bpm]}
              onValueChange={handleBpmChange}
              min={30}
              max={300}
              step={1}
              className="w-full h-4"
            />

            <div className="flex gap-3">
              <Button
                size="lg"
                variant={isPlaying ? "destructive" : "default"}
                onClick={togglePlay}
                className="flex-1 h-14 text-xl rounded-xl shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Square className="fill-current mr-2" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="fill-current mr-2" /> Start
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={tapTempo}
                className="h-14 px-6 rounded-xl shadow-sm text-muted-foreground hover:text-foreground active:scale-95 transition-all"
                title="Tap Tempo"
              >
                <Hand className="h-5 w-5 mr-2" /> Tap
              </Button>
            </div>

            <BeatsDisplay
              accentPattern={accentPattern}
              currentBeat={currentBeat}
              isPlaying={isPlaying}
              toggleAccent={toggleAccent}
            />
          </div>

          {/* Right Column: Settings & Features */}
          <div className="space-y-6 flex flex-col justify-center bg-muted/20 p-6 rounded-2xl border border-border/10">
            {/* Time Signature */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Time Signature
              </label>
              <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-1 border border-border/10 shadow-sm">
                {/* Numerator */}
                <div className="flex items-center flex-1 justify-between bg-muted/30 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-background"
                    onClick={decreaseBeats}
                  >
                    -
                  </Button>
                  <span className="font-bold tabular-nums text-lg w-8 text-center">
                    {beatsPerMeasure}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-background"
                    onClick={increaseBeats}
                  >
                    +
                  </Button>
                </div>

                <span className="text-muted-foreground/50 text-xl font-light">
                  /
                </span>

                {/* Denominator */}
                <div className="flex items-center flex-1 justify-between bg-muted/30 rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-background"
                    onClick={decreaseNoteValue}
                  >
                    -
                  </Button>
                  <span className="font-bold tabular-nums text-lg w-8 text-center">
                    {noteValue}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-background"
                    onClick={increaseNoteValue}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Subdivision & Tone */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Subdivision
                </label>
                <select
                  className="w-full h-10 rounded-md border border-border/10 bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&>option]:bg-background [&>option]:text-foreground"
                  value={subdivision}
                  onChange={(e) => setSubdivision(Number(e.target.value))}
                >
                  <option value={1}>Quarter</option>
                  <option value={2}>Eighth</option>
                  <option value={3}>Triplet</option>
                  <option value={4}>Sixteenth</option>
                </select>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Sound
                </label>
                <select
                  className="w-full h-10 rounded-md border border-border/10 bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&>option]:bg-background [&>option]:text-foreground"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                >
                  {TONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  onValueChange={(v) => setVolume(v[0])}
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1"
                />
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Bottom Row: Timer (removed theme select) */}
            <div className="flex justify-end items-center">
              <SessionTimer />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
