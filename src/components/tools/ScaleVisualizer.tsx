"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { NOTES, SCALES, WESTERN_ROOTS, getScaleNotes, getAllFretboardNotes, getNoteName, normalizeRoot, getInterval } from "@/lib/music-theory";
import { useBassSynth } from "@/hooks/useBassSynth";
import { TUNING_PRESETS } from "@/lib/tuner-utils";
import type { FretboardNote } from "@/components/tools/fretboard-trainer/types";

// Map tuning preset IDs to friendly names for the selector
const TUNING_OPTIONS = [
    { id: "4-string-standard", name: "4 String (Standard)" },
    { id: "5-string-standard-low-b", name: "5 String (Low B)" },
    { id: "5-string-standard-high-c", name: "5 String (High C)" },
    { id: "6-string-standard", name: "6 String (Standard)" },
];

export function ScaleVisualizer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("4-string-standard");
  const [rootNote, setRootNote] = useState<string>("C");
  const [scaleType, setScaleType] = useState<keyof typeof SCALES>("major");
  
  const { playTone } = useBassSynth();

  // Get current tuning strings
  const currentTuning = TUNING_PRESETS[selectedPresetId as keyof typeof TUNING_PRESETS];
  const numStrings = currentTuning.strings.length;
  
  // Calculate scale notes
  const scaleNotes = getScaleNotes(rootNote, scaleType);
  
  // Mapped scale notes for quick lookup (Set for O(1))
  const scaleNotesSet = new Set(scaleNotes);

  // Generate all fretboard positions
  const numFrets = 15; // Show 15 frets + open (0)
  const fretboardData = getAllFretboardNotes(currentTuning.strings, numFrets);

  // Group by string index for easy rendering
  const stringsData: FretboardNote[][] = Array.from({ length: numStrings }, () => []);
  fretboardData.forEach(pos => {
      stringsData[pos.stringIndex][pos.fret] = pos;
  });

  const isNoteInScale = (note: string) => scaleNotesSet.has(note);
  const isRoot = (note: string) => normalizeRoot(note) === normalizeRoot(rootNote);

  // Helper to determine note color class based on interval
  const getNoteColorClass = (note: string, isRootNote: boolean): string => {
      if (isRootNote) return "bg-indigo-500 text-white border-indigo-400 ring-2 ring-indigo-400/30 shadow-[0_0_14px_rgba(99,102,241,0.7)] scale-110";

      const interval = getInterval(rootNote, note);
      
      // Major/Minor 3rd (3 or 4 semitones)
      if (interval === 3 || interval === 4) {
          return "bg-sky-600 text-white border-sky-500 shadow-[0_0_10px_rgba(2,132,199,0.5)]";
      }
      
      // Perfect 5th (7 semitones)
      if (interval === 7) {
          return "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_10px_rgba(5,150,105,0.5)]";
      }

      // Default Scale Note
      return "bg-white/20 text-white border-white/30 hover:bg-white/30";
  };


  const handleNoteClick = (noteData: FretboardNote) => {
      playTone(noteData.frequency);
  };

  return (
    <div className="w-full rounded-[22px] border border-border bg-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] p-6 md:p-8 space-y-8">

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-muted/30 border border-border/50 p-5 rounded-[16px] backdrop-blur">
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">Base Tuning</span>
                <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
                    <SelectTrigger className="w-full md:w-[200px] bg-background/60">
                        <SelectValue placeholder="Select Tuning" />
                    </SelectTrigger>
                    <SelectContent>
                        {TUNING_OPTIONS.map(opt => (
                            <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">Root</span>
                <Select value={rootNote} onValueChange={setRootNote}>
                    <SelectTrigger className="w-full md:w-[100px] bg-background/60">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {WESTERN_ROOTS.map(note => (
                            <SelectItem key={note} value={note}>{note}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">Scale</span>
                <Select value={scaleType} onValueChange={(val) => setScaleType(val as keyof typeof SCALES)}>
                    <SelectTrigger className="w-full md:w-[200px] bg-background/60">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(SCALES).map(([key, info]) => (
                            <SelectItem key={key} value={key}>{info.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Interval legend */}
        <div className="flex flex-wrap gap-4 items-center text-xs text-muted-foreground bg-muted/20 px-4 py-3 rounded-[12px] border border-border/40">
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground/80 font-semibold mr-1">Intervals</span>
            {[
              { color: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]", label: "Root" },
              { color: "bg-sky-600 shadow-[0_0_8px_rgba(2,132,199,0.5)]", label: "3rd" },
              { color: "bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]", label: "5th" },
              { color: "bg-white/30 border border-white/40", label: "Other" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 font-medium">
                <span className={`w-3 h-3 rounded-full ${color} block`} />
                <span>{label}</span>
              </div>
            ))}
        </div>

        {/* Fretboard Visualizer */}
        <div className="relative overflow-x-auto pb-4 custom-scrollbar">
            {/* Scroll Hint */}
            <div className="md:hidden text-xs text-center text-muted-foreground mb-2 italic">
               &larr; Scroll to see higher frets &rarr;
            </div>

            {/* Fretboard container with studio dark theme */}
            <div
                id="fretboard-container"
                className="min-w-[800px] select-none pl-12 pr-4 py-8 rounded-[16px] relative fretboard-container border border-slate-700/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]"
            >
                
                {/* Nut */}
                <div className="absolute left-12 top-8 bottom-8 w-3.5 bg-gradient-to-r from-neutral-500 to-neutral-400 shadow-md z-10 border-r border-neutral-700 rounded-sm"></div>

                {/* Strings & Frets Container */}
                <div className="relative flex flex-col justify-between" style={{ height: `${numStrings * 40}px` }}> {/* 40px spacing */}
                    
                    {/* Fret Markers (Background) */}
                    <div className="absolute inset-0 w-full pointer-events-none">
                         {Array.from({ length: numFrets }).map((_, i) => (
                             <div
                                key={i}
                                className="absolute top-0 bottom-0 bg-white/10"
                                style={{
                                    left: `${(i + 1) * (100 / (numFrets + 1))}%`,
                                    width: '1px',
                                    transform: 'translateX(-50%)'
                                 }}
                             >
                                {/* Fret Numbers */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
                                    <span
                                        className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold rounded-full"
                                        style={{
                                            color: [3, 5, 7, 9, 12, 15].includes(i + 1) ? "#5b9bff" : "#3d4f6b",
                                            fontSize: [3, 5, 7, 9, 12, 15].includes(i + 1) ? "11px" : "10px",
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                </div>
                             </div>
                         ))}
                    </div>

                    {/* Strings and Notes */}
                    {stringsData.slice().reverse().map((stringVar, sIdx) => {
                         const actualStringIndex = numStrings - 1 - sIdx;
                         
                         return (
                            <div key={actualStringIndex} className="relative w-full h-8 flex items-center">
                                {/* String Line */}
                                <div
                                    className="absolute w-full z-0"
                                    style={{ height: `${2 + (sIdx * 0.5)}px`, background: "rgba(148,163,184,0.45)" }}
                                ></div>
                                
                                {/* Notes */}
                                {stringVar.map((noteData, fretIdx) => {
                                    const inScale = isNoteInScale(noteData.note);
                                    const isRootNote = isRoot(noteData.note);
                                    
                                    // Fret spacing logic
                                    const notePercentage = fretIdx === 0 ? -2.5 : ((fretIdx - 0.5) * (100 / numFrets)); 
                                    
                                    return (
                                        <div 
                                            key={fretIdx}
                                            className="absolute z-10 flex items-center justify-center"
                                            style={{ left: fretIdx === 0 ? '-30px' : `${notePercentage}%` }}
                                        >
                                            <button
                                                onClick={() => handleNoteClick(noteData)}
                                                className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border shadow-sm",
                                                    inScale ? cn(
                                                        getNoteColorClass(noteData.note, isRootNote),
                                                        isRootNote ? "scale-110 shadow-md" : "hover:scale-110"
                                                    ) : "bg-transparent text-transparent border-transparent w-4 h-4 hover:w-7 hover:h-7 hover:bg-white/20 hover:text-white opacity-0 hover:opacity-100"
                                                )}
                                                title={`${getNoteName(noteData.noteIndex, rootNote)}${noteData.octave}`}
                                            >
                                                {getNoteName(noteData.noteIndex, rootNote)}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 font-mono">
            Click any note to hear it · Use the controls above to change tuning, key, and scale
        </p>

    </div>
  );
}
