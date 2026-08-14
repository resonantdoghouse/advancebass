"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Ear, Guitar, Music, Settings2 } from "lucide-react";
import { useTuner } from "@/hooks/useTuner";
import { TUNING_PRESETS, StringConfig, InstrumentType } from "@/lib/tuner-utils";
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
  const [instrumentMode, setInstrumentMode] = useState<InstrumentType | "chromatic">("bass");
  const [selectedPreset, setSelectedPreset] = useState<string>("4-string-standard");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const { isListening, startListening, stopListening, detectedNote, volume, playTone, stopTone, isPlayingTone } = useTuner();
  const [activeString, setActiveString] = useState<number | null>(null);

  const currentPreset = TUNING_PRESETS[selectedPreset as keyof typeof TUNING_PRESETS];
  const isNoteInTune = detectedNote && Math.abs(detectedNote.cents) < 5;

  // Smooth gauge position. Driven by rAF at up to 60fps — animating this via
  // React state would re-render the whole card every frame, so the needle
  // element's style is mutated directly instead.
  const needleElRef = useRef<HTMLDivElement>(null);
  const needleRotationRef = useRef(-90);
  const detectedNoteRef = useRef(detectedNote);
  useEffect(() => { detectedNoteRef.current = detectedNote; }, [detectedNote]);

  useEffect(() => {
    if (mode === "mic" && !isListening) startListening();
    else if (mode === "ear" && isListening) stopListening();
  }, [mode, isListening, startListening, stopListening]);

  useEffect(() => {
    if (instrumentMode === "bass" && TUNING_PRESETS[selectedPreset]?.instrument !== "bass")
      setSelectedPreset("4-string-standard");
    else if (instrumentMode === "guitar" && TUNING_PRESETS[selectedPreset]?.instrument !== "guitar")
      setSelectedPreset("guitar-standard");
  }, [instrumentMode]);

  const volumeRef = useRef(volume);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  useEffect(() => {
    let id: number;
    const animate = () => {
      let target = -90;
      if (detectedNoteRef.current && volumeRef.current > 0.02) {
        let cents = Math.max(-50, Math.min(50, detectedNoteRef.current.cents));
        target = cents * 1.8;
      }
      const diff = target - needleRotationRef.current;
      if (Math.abs(diff) > 0.1) {
        needleRotationRef.current += diff * 0.15;
        const percent = Math.max(2, Math.min(98, 50 + needleRotationRef.current / 1.8));
        if (needleElRef.current) {
          needleElRef.current.style.left = `${percent}%`;
        }
      }
      id = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(id);
  }, []);

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let speed = 0;
      if (detectedNote) {
        speed = Math.max(-12, Math.min(12, detectedNote.cents * 0.08));
      }
      phaseRef.current += speed;
      const totalWidth = 120;
      if (phaseRef.current >= totalWidth) phaseRef.current -= totalWidth;
      if (phaseRef.current <= -totalWidth) phaseRef.current += totalWidth;
      for (let x = -totalWidth; x < canvas.width + totalWidth; x += totalWidth) {
        const xPos = x + phaseRef.current;
        const gradient = ctx.createLinearGradient(xPos, 0, xPos + 60, 0);
        const colorBase = isNoteInTune ? "34, 197, 94" : "113, 113, 122";
        const opacity = detectedNote ? 0.6 : 0.1;
        gradient.addColorStop(0, `rgba(${colorBase}, 0)`);
        gradient.addColorStop(0.5, `rgba(${colorBase}, ${opacity})`);
        gradient.addColorStop(1, `rgba(${colorBase}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(xPos, 0, 60, canvas.height);
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
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

  const instrumentLabel =
    instrumentMode === "bass" ? "BASS TUNER"
    : instrumentMode === "guitar" ? "GUITAR TUNER"
    : "CHROMATIC TUNER";

  const cols = !currentPreset ? 4
    : currentPreset.strings.length <= 4 ? 4
    : currentPreset.strings.length <= 6 ? 6
    : 4;

  return (
    <div className="w-full max-w-2xl bg-card border border-border rounded-[22px] p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)]">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-7">
        <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          {instrumentLabel}
        </span>
        {mode === "mic" && isNoteInTune ? (
          <span className="font-mono text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
            IN TUNE
          </span>
        ) : mode === "mic" && isListening ? (
          <span className="font-mono text-[11px] font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            LISTENING
          </span>
        ) : (
          <span className="font-mono text-[11px] font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            EAR MODE
          </span>
        )}
      </div>

      {/* ── Instrument + Mode toggles ───────────────────── */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex bg-muted rounded-[10px] p-1 gap-0.5">
          {([
            { id: "bass",      label: "Bass",   Icon: Music    },
            { id: "guitar",    label: "Guitar", Icon: Guitar   },
            { id: "chromatic", label: "Strobe", Icon: Settings2 },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => {
                setInstrumentMode(id);
                if (id === "chromatic") setMode("mic");
              }}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-[8px] transition-all",
                instrumentMode === id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => { setMode("mic"); stopTone(); setActiveString(null); }}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-[8px] transition-all",
              mode === "mic"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            <Mic className="h-3.5 w-3.5" /> Mic
          </button>
          <button
            onClick={() => { setMode("ear"); stopListening(); }}
            disabled={instrumentMode === "chromatic"}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-[8px] transition-all",
              mode === "ear"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
              instrumentMode === "chromatic" && "opacity-30 cursor-not-allowed",
            )}
          >
            <Ear className="h-3.5 w-3.5" /> Ear
          </button>
        </div>
      </div>

      {/* ── Preset selector ─────────────────────────────── */}
      {instrumentMode !== "chromatic" && (
        <div className="mb-7">
          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
            <SelectTrigger className="w-full border-border bg-muted/40">
              <SelectValue placeholder="Select Tuning" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TUNING_PRESETS)
                .filter(([_, preset]) => preset.instrument === instrumentMode)
                .map(([key, preset]) => (
                  <SelectItem key={key} value={key}>{preset.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── Main display ────────────────────────────────── */}
      {mode === "mic" ? (
        detectedNote ? (
          <>
            {/* Note */}
            <div className="text-center mb-1">
              <span className="inline-flex items-start font-heading font-bold tracking-[-0.04em] leading-none">
                <span className="text-[80px]">{detectedNote.note.charAt(0)}</span>
                <sup className="text-3xl text-muted-foreground font-semibold mt-3 ml-1">
                  {detectedNote.note.slice(1)}{detectedNote.octave}
                </sup>
              </span>
            </div>
            <div className="font-mono text-sm text-muted-foreground text-center mb-7">
              {detectedNote.cents > 0 ? "+" : ""}{Math.round(detectedNote.cents)} cents
            </div>

            {/* Strobe canvas */}
            {instrumentMode === "chromatic" && (
              <div className="relative h-20 rounded-[12px] overflow-hidden bg-muted/50 mb-7">
                <canvas ref={canvasRef} width={670} height={80} className="w-full h-full mix-blend-screen" />
              </div>
            )}

            {/* Horizontal gauge */}
            {instrumentMode !== "chromatic" && (
              <>
                <div className="relative h-2 rounded-full bg-muted mb-2.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 border-r border-border/50" />
                  <div
                    ref={needleElRef}
                    className="absolute -translate-x-1/2 -top-[5px] w-1 h-[18px] rounded-full"
                    style={{
                      left: "50%",
                      background: isNoteInTune ? "#4ade80" : "hsl(var(--primary))",
                      boxShadow: isNoteInTune ? "0 0 12px rgba(74,222,128,0.65)" : "none",
                      transition: "background 0.3s, box-shadow 0.3s",
                    }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[10px] text-muted-foreground/60 mb-7">
                  <span>−50 Flat</span><span>In Tune</span><span>Sharp +50</span>
                </div>
              </>
            )}
          </>
        ) : (
          /* Listening placeholder */
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <Mic className={cn(
                "h-14 w-14 relative z-10 transition-all duration-300",
                isListening && volume > 0.05 ? "text-primary scale-110" : "text-muted-foreground/50",
              )} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Listening...</span>
              <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-75"
                  style={{ width: `${Math.min(100, volume * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )
      ) : (
        /* Ear mode */
        <div className="flex flex-col items-center py-8 gap-2">
          <Ear className="h-10 w-10 text-muted-foreground/30 mb-1" />
          <span className="text-sm text-muted-foreground font-medium">
            Select a string below to play a reference tone
          </span>
        </div>
      )}

      {/* ── String buttons ──────────────────────────────── */}
      {instrumentMode !== "chromatic" && currentPreset && (
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {currentPreset.strings.map((stringInfo, idx) => {
            const isDetected =
              mode === "mic" &&
              detectedNote &&
              detectedNote.note === stringInfo.note.replace(/[0-9]/g, "") &&
              detectedNote.octave === stringInfo.octave;
            const isActive = mode === "ear" && activeString === idx;

            return (
              <button
                key={idx}
                onClick={() => mode === "ear" && handlePlayString(stringInfo, idx)}
                disabled={mode === "mic"}
                className={cn(
                  "flex flex-col items-center justify-center py-3 rounded-[10px] font-mono font-semibold transition-all",
                  isDetected
                    ? "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30"
                    : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                  mode === "mic" ? "cursor-default" : "",
                )}
              >
                <span className="text-lg">{stringInfo.note}</span>
                <span className="text-[10px] opacity-50 mt-0.5">{currentPreset.strings.length - idx}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
