"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CHORDS, WESTERN_ROOTS, getChordNotes, getAllFretboardNotes, normalizeRoot, getInterval } from "@/lib/music-theory";
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

type ArpeggioVisualizerProps = {
  rootNote?: string;
  onRootNoteChange?: (note: string) => void;
  tuningPresetId?: string;
  onTuningPresetChange?: (id: string) => void;
  hideRootControl?: boolean;
  hideTuningControl?: boolean;
};

export function ArpeggioVisualizer({
  rootNote: rootNoteProp,
  onRootNoteChange,
  tuningPresetId: tuningPresetIdProp,
  onTuningPresetChange,
  hideRootControl = false,
  hideTuningControl = false,
}: ArpeggioVisualizerProps = {}) {
  const [internalPresetId, setInternalPresetId] = useState<string>("4-string-standard");
  const [internalRootNote, setInternalRootNote] = useState<string>("C");
  const [chordType, setChordType] = useState<keyof typeof CHORDS>("major");

  const selectedPresetId = tuningPresetIdProp ?? internalPresetId;
  const setSelectedPresetId = onTuningPresetChange ?? setInternalPresetId;
  const rootNote = rootNoteProp ?? internalRootNote;
  const setRootNote = onRootNoteChange ?? setInternalRootNote;

  const { playTone } = useBassSynth();

  // Get current tuning strings
  const currentTuning = TUNING_PRESETS[selectedPresetId as keyof typeof TUNING_PRESETS];
  const numStrings = currentTuning.strings.length;
  
  // Calculate chord notes
  const chordNotes = getChordNotes(rootNote, chordType);
  
  // Mapped chord notes for quick lookup (Set for O(1))
  const chordNotesSet = new Set(chordNotes);

  // Generate all fretboard positions
  const numFrets = 15; // Show 15 frets + open (0)
  const fretboardData = getAllFretboardNotes(currentTuning.strings, numFrets);

  // Group by string index for easy rendering
  const stringsData: FretboardNote[][] = Array.from({ length: numStrings }, () => []);
  fretboardData.forEach(pos => {
      stringsData[pos.stringIndex][pos.fret] = pos;
  });

  const isNoteInChord = (note: string) => chordNotesSet.has(note);
  const isRoot = (note: string) => normalizeRoot(note) === normalizeRoot(rootNote);

  // Helper to determine note color class based on interval
  const getNoteColorClass = (note: string, isRootNote: boolean): string => {
      if (isRootNote) return "bg-indigo-500 text-white border-indigo-400 ring-2 ring-indigo-400/30 shadow-[0_0_14px_rgba(99,102,241,0.7)] scale-110";

      const interval = getInterval(rootNote, note);
      
      // Major/Minor 3rd (3 or 4 semitones)
      if (interval === 3 || interval === 4) {
          return "bg-sky-600 text-white border-sky-500 shadow-[0_0_10px_rgba(2,132,199,0.5)]";
      }
      
      // Perfect/Diminished/Augmented 5th (6, 7, 8 semitones)
      if (interval === 6 || interval === 7 || interval === 8) {
          return "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_10px_rgba(5,150,105,0.5)]";
      }

      // Major/Minor 7th (10 or 11 semitones) or 6th for fully dim7 (9 semitones - bb7)
      if (interval === 9 || interval === 10 || interval === 11) {
          return "bg-amber-600 text-white border-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.5)]";
      }

      // Default Chord Note
      return "bg-white/20 text-white border-white/30 hover:bg-white/30";
  };


  const handleNoteClick = (noteData: FretboardNote) => {
      playTone(noteData.frequency);
  };

  // Interval labels for chord notes (index → interval name)
  const INTERVAL_LABELS = ["Root", "3rd", "5th", "7th", "9th"];
  const INTERVAL_COLORS = [
    "bg-indigo-500 text-white border-indigo-600",
    "bg-sky-600 text-white border-sky-700",
    "bg-emerald-600 text-white border-emerald-700",
    "bg-amber-600 text-white border-amber-700",
    "bg-rose-500 text-white border-rose-600",
  ];
  const INTERVAL_DOT_COLORS = [
    "bg-indigo-500",
    "bg-sky-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-500",
  ];

  // Open string note names (high to low, matching reversed render order)
  const openStringNotes = currentTuning.strings.map(s => s.note);

  return (
    <div className="w-full rounded-[22px] border border-border bg-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] p-6 md:p-8 space-y-6">

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-muted/20 p-5 rounded-[14px]">
            {!hideTuningControl && (
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">Bass Tuning</span>
                  <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
                      <SelectTrigger className="w-full md:w-[200px]">
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
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">Root Note</span>
                  <Select value={rootNote} onValueChange={setRootNote}>
                      <SelectTrigger className="w-full md:w-[110px]">
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

            <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">Chord / Arpeggio</span>
                <Select value={chordType} onValueChange={(val) => setChordType(val as keyof typeof CHORDS)}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(CHORDS).map(([key, info]) => (
                            <SelectItem key={key} value={key}>{info.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Chord Display + Color Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Now Showing */}
          <div className="bg-muted/20 border border-border/50 rounded-[14px] p-5 space-y-3">
            <p className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">Now Showing</p>
            <p className="text-2xl font-bold tracking-tight">
              {rootNote} <span className="text-muted-foreground font-medium">{CHORDS[chordType].name}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {chordNotes.map((note, i) => (
                <span
                  key={note}
                  className={cn(
                    "inline-flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md border text-xs font-bold",
                    INTERVAL_COLORS[i] ?? "bg-muted text-foreground border-border"
                  )}
                >
                  <span className="text-sm font-extrabold">{note}</span>
                  <span className="text-[10px] font-semibold opacity-80">{INTERVAL_LABELS[i] ?? `Ext`}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Color Guide (Legend) */}
          <div className="bg-muted/20 border border-border/50 rounded-[14px] p-5 space-y-3">
            <p className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">Color Guide</p>
            <div className="grid grid-cols-2 gap-2">
              {INTERVAL_LABELS.slice(0, chordNotes.length).map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span className={cn("w-5 h-5 rounded-full flex-shrink-0 border-2 border-white/20 shadow", INTERVAL_DOT_COLORS[i])}></span>
                  <div className="leading-tight">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-xs text-muted-foreground block">{chordNotes[i]}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">
              Tap any highlighted dot to hear that note.
            </p>
          </div>
        </div>

        {/* How to Read section */}
        <div className="flex items-start gap-3 bg-muted/20 border border-border/50 rounded-[14px] px-5 py-4 text-sm text-muted-foreground">
          <div className="space-y-1">
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground/70 mb-2">Reading the fretboard</p>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Each row is a string — thinnest at top, thickest at bottom.</li>
              <li>Position markers (3, 5, 7, 9, 12…) appear below the fretboard.</li>
              <li>Colored dots are arpeggio notes — tap any to hear it.</li>
              <li>Swipe left/right on mobile to see all 15 frets.</li>
            </ul>
          </div>
        </div>

        {/* Fretboard Visualizer */}
        <ChordScaleFretboard
            stringsData={stringsData}
            numStrings={numStrings}
            numFrets={numFrets}
            rootNote={rootNote}
            isNoteHighlighted={isNoteInChord}
            isRoot={isRoot}
            getNoteColorClass={getNoteColorClass}
            onNoteClick={handleNoteClick}
            titleSuffix=" — click to hear"
            showStringLabels
            openStringNotes={openStringNotes}
        />

    </div>
  );
}
