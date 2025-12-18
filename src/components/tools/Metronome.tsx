"use client";

import { useState } from "react";
import { useMetronome } from "@/hooks/useMetronome";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, Square, Settings, Volume2, GripHorizontal } from "lucide-react";

interface MetronomeProps {
  compact?: boolean;
}

export function Metronome({ compact = false }: MetronomeProps) {
  const {
    isPlaying,
    start,
    stop,
    bpm,
    setBpm,
    beatsPerMeasure,
    setBeatsPerMeasure,
    currentBeat,
  } = useMetronome();

  const handleBpmChange = (value: number[]) => {
    setBpm(value[0]);
  };

  const handleIncrement = () => setBpm((prev) => Math.min(prev + 1, 300));
  const handleDecrement = () => setBpm((prev) => Math.max(prev - 1, 30));

  const BeatsDisplay = () => (
    <div className="flex justify-center gap-1.5 mb-2 h-4 items-center">
      {Array.from({ length: beatsPerMeasure }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-75 ${
            currentBeat === i && isPlaying
              ? i === 0
                ? "bg-primary h-3 w-3 shadow-[0_0_8px_theme(colors.primary.DEFAULT)]" // Accent beat
                : "bg-primary/80 h-2.5 w-2.5" // Weak beat
              : "bg-muted h-2 w-2"
          }`}
        />
      ))}
    </div>
  );

  if (compact) {
    return (
      <Card className="w-56 shadow-lg border-2 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
        <div className="flex justify-center h-5 items-center cursor-move text-muted-foreground/50 hover:text-foreground/80 transition-colors" title="Drag to move">
            <GripHorizontal className="h-4 w-4" />
        </div>
        <CardContent className="p-3 pt-0 space-y-3">
          <div className="flex justify-between items-center">
             <div className="flex flex-col">
                 <div className="text-2xl font-bold tabular-nums leading-none">{bpm}</div>
                 <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">BPM</span>
             </div>
             <Button
                size="sm"
                variant={isPlaying ? "destructive" : "default"}
                onClick={isPlaying ? stop : start}
                aria-label={isPlaying ? "Stop Metronome" : "Start Metronome"}
                className="h-8 w-8 rounded-full"
              >
                {isPlaying ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
              </Button>
          </div>
          
          <BeatsDisplay />

          <Slider
            value={[bpm]}
            onValueChange={handleBpmChange}
            min={30}
            max={300}
            step={1}
            className="w-full"
            aria-label="Tempo Slider"
          />
          
          <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
             <div className="flex items-center gap-1 bg-muted/40 rounded px-1.5 py-0.5">
               <button onClick={() => setBeatsPerMeasure(Math.max(1, beatsPerMeasure - 1))} className="hover:text-foreground px-1 font-bold disabled:opacity-50" aria-label="Decrease Time Signature">-</button>
               <span className="tabular-nums w-3 text-center font-medium text-foreground">{beatsPerMeasure}</span>
               <button onClick={() => setBeatsPerMeasure(Math.min(16, beatsPerMeasure + 1))} className="hover:text-foreground px-1 font-bold" aria-label="Increase Time Signature">+</button>
               <span className="text-[10px] pl-0.5">/ 4</span>
             </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-6 w-6" />
            Metronome
        </CardTitle>
        <CardDescription>Precision timing for your practice sessions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <BeatsDisplay />

        <div className="text-center space-y-2">
          <div className="text-7xl font-bold tabular-nums tracking-tighter">
            {bpm}
          </div>
          <p className="text-muted-foreground uppercase tracking-widest font-medium">BPM</p>
        </div>

        <div className="space-y-4">
          <Slider
            value={[bpm]}
            onValueChange={handleBpmChange}
            min={30}
            max={300}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleDecrement} disabled={bpm <= 30}>-1</Button>
            <Button variant="outline" onClick={handleIncrement} disabled={bpm >= 300}>+1</Button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-1">
                <label className="text-sm font-medium">Time Signature</label>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setBeatsPerMeasure(Math.max(1, beatsPerMeasure - 1))} className="h-8 w-8">-</Button>
                     <span className="text-xl font-bold w-8 text-center">{beatsPerMeasure}</span>
                    <Button variant="outline" size="icon" onClick={() => setBeatsPerMeasure(Math.min(16, beatsPerMeasure + 1))} className="h-8 w-8">+</Button>
                    <span className="text-muted-foreground ml-1 text-lg">/ 4</span>
                </div>
            </div>

            <Button
              size="lg"
              className="h-16 w-16 rounded-full"
              variant={isPlaying ? "destructive" : "default"}
              onClick={isPlaying ? stop : start}
            >
              {isPlaying ? <Square className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current" />}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
