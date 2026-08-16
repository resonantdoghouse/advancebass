"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SCALES, WESTERN_ROOTS, getScaleNotes, getAllFretboardNotes, normalizeRoot, getInterval } from "@/lib/music-theory";
import { useBassSynth } from "@/hooks/useBassSynth";
import { TUNING_PRESETS } from "@/lib/tuner-utils";
import type { FretboardNote } from "@/components/tools/fretboard-trainer/types";
import { ChordScaleFretboard } from "@/components/tools/shared/ChordScaleFretboard";

// Map tuning preset IDs to friendly names for the selector
const TUNING_OPTIONS = [
    { id: "4-string-standard", name: "4 String (Standard)" },
    { id: "5-string-standard-low-b", name: "5 String (Low B)" },
    { id: "5-string-standard-high-c", name: "5 String (High C)" },
    { id: "6-string-standard", name: "6 String (Standard)" },
];

type ScaleVisualizerProps = {
  rootNote?: string;
  onRootNoteChange?: (note: string) => void;
  tuningPresetId?: string;
  onTuningPresetChange?: (id: string) => void;
  hideRootControl?: boolean;
  hideTuningControl?: boolean;
};

export function ScaleVisualizer({
  rootNote: rootNoteProp,
  onRootNoteChange,
  tuningPresetId: tuningPresetIdProp,
  onTuningPresetChange,
  hideRootControl = false,
  hideTuningControl = false,
}: ScaleVisualizerProps = {}) {
  const [internalPresetId, setInternalPresetId] = useState<string>("4-string-standard");
  const [internalRootNote, setInternalRootNote] = useState<string>("C");
  const [scaleType, setScaleType] = useState<keyof typeof SCALES>("major");

  const selectedPresetId = tuningPresetIdProp ?? internalPresetId;
  const setSelectedPresetId = onTuningPresetChange ?? setInternalPresetId;
  const rootNote = rootNoteProp ?? internalRootNote;
  const setRootNote = onRootNoteChange ?? setInternalRootNote;

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
            {!hideTuningControl && (
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
            )}

            {!hideRootControl && (
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
            )}

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
        <ChordScaleFretboard
            stringsData={stringsData}
            numStrings={numStrings}
            numFrets={numFrets}
            rootNote={rootNote}
            isNoteHighlighted={isNoteInScale}
            isRoot={isRoot}
            getNoteColorClass={getNoteColorClass}
            onNoteClick={handleNoteClick}
        />

        <p className="text-center text-xs text-muted-foreground/60 font-mono">
            Click any note to hear it · Use the controls above to change tuning, key, and scale
        </p>

    </div>
  );
}
