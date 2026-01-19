"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Mic, Ear, Guitar, Music, Settings2 } from "lucide-react";
import { useTuner } from "@/hooks/useTuner";
import {
  TUNING_PRESETS,
  StringConfig,
  InstrumentType,
} from "@/lib/tuner-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function Tuner() {
  const [mode, setMode] = useState<"mic" | "ear">("ear");
  const [instrumentMode, setInstrumentMode] = useState<
    InstrumentType | "chromatic"
  >("bass");
  const [selectedPreset, setSelectedPreset] =
    useState<string>("4-string-standard");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const {
    isListening,
    startListening,
    stopListening,
    detectedNote,
    volume,
    playTone,
    stopTone,
    isPlayingTone,
  } = useTuner();
  const [activeString, setActiveString] = useState<number | null>(null);

  const currentPreset =
    TUNING_PRESETS[selectedPreset as keyof typeof TUNING_PRESETS];
  const isNoteInTune = detectedNote && Math.abs(detectedNote.cents) < 5;

  // Auto-start/stop listening based on mode
  useEffect(() => {
    if (mode === "mic" && !isListening) {
      startListening();
    } else if (mode === "ear" && isListening) {
      stopListening();
    }
  }, [mode, isListening, startListening, stopListening]);

  // Set default preset when changing instrument
  useEffect(() => {
    if (
      instrumentMode === "bass" &&
      TUNING_PRESETS[selectedPreset]?.instrument !== "bass"
    ) {
      setSelectedPreset("4-string-standard");
    } else if (
      instrumentMode === "guitar" &&
      TUNING_PRESETS[selectedPreset]?.instrument !== "guitar"
    ) {
      setSelectedPreset("guitar-standard");
    }
  }, [instrumentMode]);

  // Strobe Tuner Animation
  useEffect(() => {
    if (instrumentMode !== "chromatic" || mode !== "mic") {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update phase
      // Speed depends on cents error.
      // If cents = 0, speed = 0.
      // If cents > 0 (sharp), moves right.
      // If cents < 0 (flat), moves left.
      let speed = 0;
      if (detectedNote) {
        speed = detectedNote.cents * 0.15; // Tuning factor
      }

      phaseRef.current += speed;
      // Keep phase bounded
      if (phaseRef.current > 50) phaseRef.current -= 50;
      if (phaseRef.current < -50) phaseRef.current += 50;

      // Draw Pattern
      const barWidth = 20;
      const gap = 20;
      const totalWidth = barWidth + gap;

      ctx.fillStyle = isNoteInTune ? "rgb(34, 197, 94)" : "rgb(156, 163, 175)"; // Green or Gray
      if (!detectedNote) ctx.fillStyle = "rgba(156, 163, 175, 0.2)";

      for (let x = -50; x < canvas.width + 50; x += totalWidth) {
        ctx.fillRect(x + phaseRef.current, 0, barWidth, canvas.height);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [instrumentMode, mode, detectedNote, isNoteInTune]);

  const handlePlayString = (stringInfo: StringConfig, index: number) => {
    if (activeString === index && isPlayingTone) {
      stopTone();
      setActiveString(null);
    } else {
      playTone(stringInfo.frequency);
      setActiveString(index);
    }
  };

  const [needleRotation, setNeedleRotation] = useState(0);
  const needleRotationRef = useRef(0);
  const detectedNoteRef = useRef(detectedNote);

  useEffect(() => {
    detectedNoteRef.current = detectedNote;
  }, [detectedNote]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      let target = -50; // Rest position (left)

      // Only move needle if we have a note AND volume is decent
      if (detectedNoteRef.current && volume > 0.02) {
        let cents = detectedNoteRef.current.cents;
        if (cents > 50) cents = 50;
        if (cents < -50) cents = -50;
        target = cents * 1.8; // Map -50..50 cents to -90..90 visual range
      }

      // Physics Smoothing (Lerp)
      // factor 0.15 = smooth but responsive
      const factor = 0.15;
      const current = needleRotationRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.1) {
        needleRotationRef.current += diff * factor;
        setNeedleRotation(needleRotationRef.current);
      } else if (Math.abs(diff) > 0) {
        needleRotationRef.current = target;
        setNeedleRotation(target);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [volume]); // Re-run if volume logic changes, but mostly stable

  // Render helper replaced by state
  // const getNeedleRotation = ... (removed)

  return (
    <Card className="w-full max-w-2xl shadow-2xl border bg-zinc-900/50 backdrop-blur-xl border-white/10 ring-1 ring-white/5">
      <CardContent className="p-6">
        <div className="flex flex-col gap-8">
          {/* Top Controls */}
          <div className="flex flex-col gap-4">
            {/* Mode Selectors */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                <Button
                  variant="ghost"
                  onClick={() => setInstrumentMode("bass")}
                  className={cn(
                    "flex-1 sm:w-24 text-sm transition-all",
                    instrumentMode === "bass"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
                  )}
                  size="sm"
                >
                  <Music className="mr-2 h-3 w-3" /> Bass
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setInstrumentMode("guitar")}
                  className={cn(
                    "flex-1 sm:w-24 text-sm transition-all",
                    instrumentMode === "guitar"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
                  )}
                  size="sm"
                >
                  <Guitar className="mr-2 h-3 w-3" /> Guitar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setInstrumentMode("chromatic");
                    setMode("mic");
                  }}
                  className={cn(
                    "flex-1 sm:w-24 text-sm transition-all",
                    instrumentMode === "chromatic"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
                  )}
                  size="sm"
                >
                  <Settings2 className="mr-2 h-3 w-3" /> Strobe
                </Button>
              </div>

              <div className="flex gap-2 self-center sm:self-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode("mic");
                    stopTone();
                    setActiveString(null);
                  }}
                  className={cn(
                    "w-24 border-white/10 transition-all",
                    mode === "mic"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 hover:border-white/20",
                  )}
                >
                  <Mic className="mr-2 h-4 w-4" /> Mic
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode("ear");
                    stopListening();
                  }}
                  disabled={instrumentMode === "chromatic"}
                  className={cn(
                    "w-24 border-white/10 transition-all",
                    mode === "ear"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 hover:border-white/20",
                    instrumentMode === "chromatic" && "opacity-30",
                  )}
                >
                  <Ear className="mr-2 h-4 w-4" /> Ear
                </Button>
              </div>
            </div>

            {/* Preset Select (Hidden in Chromatic Mode) */}
            {instrumentMode !== "chromatic" && (
              <div className="flex justify-center">
                <Select
                  value={selectedPreset}
                  onValueChange={setSelectedPreset}
                >
                  <SelectTrigger className="w-full sm:w-[300px] bg-zinc-900/50 border-white/10 text-zinc-200">
                    <SelectValue placeholder="Select Tuning" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                    {Object.entries(TUNING_PRESETS)
                      .filter(
                        ([_, preset]) => preset.instrument === instrumentMode,
                      )
                      .map(([key, preset]) => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="focus:bg-zinc-800 focus:text-white"
                        >
                          {preset.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Main Visual Area */}
          <div
            className="h-72 flex flex-col items-center justify-center bg-zinc-950 rounded-3xl border border-white/10 relative overflow-hidden transition-all duration-500 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]"
            style={{
              boxShadow: isNoteInTune
                ? "inset 0 0 50px rgba(34, 197, 94, 0.2)"
                : "inset 0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            {mode === "mic" ? (
              <>
                {detectedNote ? (
                  <>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                      <div className="flex items-start">
                        <span className="text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
                          {detectedNote.note.charAt(0)}
                        </span>
                        <span className="text-4xl mt-4 text-zinc-400 font-bold">
                          {detectedNote.note.slice(1)}
                        </span>
                      </div>
                      <span className="text-2xl text-zinc-500 font-medium -mt-2">
                        {detectedNote.octave}
                      </span>
                    </div>

                    {/* Needle / Gauge (Standard Mode) */}
                    {instrumentMode !== "chromatic" && (
                      <div className="absolute bottom-0 w-full h-40 overflow-hidden flex justify-center items-end opacity-90">
                        {/* Ticks */}
                        <div
                          className="absolute bottom-0 w-full h-full flex justify-center"
                          style={{
                            maskImage:
                              "linear-gradient(to top, black 20%, transparent 100%)",
                            WebkitMaskImage:
                              "linear-gradient(to top, black 20%, transparent 100%)",
                          }}
                        >
                          <div className="w-0.5 h-6 bg-zinc-700 absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-32"></div>
                          {[-45, -30, -15, 15, 30, 45].map((deg) => (
                            <div
                              key={deg}
                              className="w-0.5 h-4 bg-zinc-800 absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-32 origin-bottom-center"
                              style={{
                                transform: `rotate(${deg}deg)`,
                                transformOrigin: "50% 100%",
                              }}
                            />
                          ))}
                        </div>

                        {/* Pivot/Needle */}
                        <div
                          className={`w-1 h-36 origin-bottom rounded-full ${isNoteInTune ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]" : "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"}`}
                          style={{
                            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
                          }}
                        ></div>
                        <div className="absolute bottom-[-20px] w-12 h-12 rounded-full bg-zinc-900 border-4 border-zinc-800 z-20 shadow-xl"></div>
                      </div>
                    )}

                    {/* Strobe Visualization (Chromatic Mode) */}
                    {instrumentMode === "chromatic" && (
                      <div className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-60">
                        <canvas
                          ref={canvasRef}
                          width={670}
                          height={288}
                          className="w-full h-full"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 via-transparent to-transparent"></div>
                      </div>
                    )}

                    <div className="absolute bottom-6 flex justify-between w-full max-w-[240px] text-xs font-mono text-zinc-500 z-20 uppercase tracking-widest">
                      <span>Flat</span>
                      <span
                        className={
                          isNoteInTune
                            ? "text-green-500 font-bold shadow-green-500/50 drop-shadow-lg"
                            : ""
                        }
                      >
                        {detectedNote.cents > 0 ? "+" : ""}
                        {Math.round(detectedNote.cents)}
                      </span>
                      <span>Sharp</span>
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-500 flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                      <Mic
                        className={cn(
                          "h-16 w-16 relative z-10 transition-all duration-300",
                          isListening && volume > 0.05
                            ? "text-primary scale-110 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                            : "opacity-50",
                        )}
                      />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-medium tracking-wide text-lg">
                        Listening...
                      </span>
                      <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-75 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                          style={{ width: `${Math.min(100, volume * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Ear className="h-16 w-16 mb-6 text-zinc-600" />
                <span className="text-zinc-500 font-medium">
                  Select a string below to play tone
                </span>
              </div>
            )}
          </div>

          {/* String Selection / Playback */}
          {instrumentMode !== "chromatic" ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {currentPreset &&
                currentPreset.strings.map((stringInfo, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={cn(
                      "h-32 flex flex-col justify-end pb-6 relative overflow-hidden transition-all duration-300 border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                      mode === "ear" && activeString === idx
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "",
                      mode === "mic" &&
                        detectedNote &&
                        detectedNote.note ===
                          stringInfo.note.replace(/[0-9]/g, "") &&
                        detectedNote.octave === stringInfo.octave
                        ? "border-green-500 bg-green-500/10 ring-2 ring-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                        : "",
                      mode === "mic" ? "pointer-events-none" : "",
                    )}
                    onClick={() =>
                      mode === "ear" && handlePlayString(stringInfo, idx)
                    }
                  >
                    <span
                      className={cn(
                        "text-3xl font-black z-10 transition-all duration-300 mb-2",
                        mode === "mic" &&
                          detectedNote &&
                          detectedNote.note ===
                            stringInfo.note.replace(/[0-9]/g, "")
                          ? "text-green-500 scale-125"
                          : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
                      )}
                    >
                      {stringInfo.note}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {currentPreset.strings.length - idx}
                    </span>

                    {/* String Visual */}
                    <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
                      <div
                        className={cn(
                          "w-0.5 bg-zinc-400 h-full transition-all duration-200",
                          mode === "ear" && activeString === idx
                            ? "bg-primary w-1 shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse"
                            : "",
                        )}
                        style={{ height: "100%" }}
                      ></div>
                    </div>
                  </Button>
                ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
