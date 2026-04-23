"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { NOTES, CHORDS, WESTERN_ROOTS, getChordNotes, getAllFretboardNotes, getNoteName, normalizeRoot, getInterval } from "@/lib/music-theory";
import { useBassSynth } from "@/hooks/useBassSynth";
import { TUNING_PRESETS } from "@/lib/tuner-utils";

type FretboardNote = {
  stringIndex: number;
  fret: number;
  note: string;
  noteIndex: number; 
  octave: number;
  frequency: number;
};

// Map tuning preset IDs to friendly names for the selector
const TUNING_OPTIONS = [
    { id: "4-string-standard", name: "4 String (Standard)" },
    { id: "5-string-standard-low-b", name: "5 String (Low B)" },
    { id: "5-string-standard-high-c", name: "5 String (High C)" },
    { id: "6-string-standard", name: "6 String (Standard)" },
];

export function ArpeggioVisualizer() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("4-string-standard");
  const [rootNote, setRootNote] = useState<string>("C");
  const [chordType, setChordType] = useState<keyof typeof CHORDS>("major");
  
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
      if (isRootNote) return "bg-indigo-500 text-white border-indigo-500 ring-2 ring-indigo-500/30 dark:ring-indigo-400/30"; // Root: Indigo

      const interval = getInterval(rootNote, note);
      
      // Major/Minor 3rd (3 or 4 semitones)
      if (interval === 3 || interval === 4) {
          return "bg-sky-600 text-white border-sky-700"; // 3rd: Sky
      }
      
      // Perfect/Diminished/Augmented 5th (6, 7, 8 semitones)
      if (interval === 6 || interval === 7 || interval === 8) {
          return "bg-emerald-600 text-white border-emerald-700"; // 5th: Emerald
      }

      // Major/Minor 7th (10 or 11 semitones) or 6th for fully dim7 (9 semitones - bb7)
      if (interval === 9 || interval === 10 || interval === 11) {
          return "bg-amber-600 text-white border-amber-700"; // 7th: Amber/Orange
      }

      // Default Chord Note (if any overlap or weird extns)
      return "bg-background text-foreground border-foreground/20"; 
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
    <Card className="w-full shadow-xl border-2 bg-card/95 backdrop-blur">
      <CardContent className="p-6 space-y-6">

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-muted/30 p-4 rounded-lg border border-border/50">
            <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bass Tuning</span>
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

            <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Root Note</span>
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

            <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chord / Arpeggio</span>
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
          <div className="bg-muted/20 border border-border/60 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Now Showing</p>
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
          <div className="bg-muted/20 border border-border/60 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color Guide</p>
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
        <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm text-muted-foreground">
          <span className="text-lg mt-0.5">🎸</span>
          <div className="space-y-1">
            <p className="font-medium text-foreground">How to read the fretboard</p>
            <ul className="space-y-0.5 text-xs list-disc list-inside">
              <li>Each row is a string — thinnest string at top, thickest at bottom. String names appear on the left.</li>
              <li>Columns are frets. Position markers (3, 5, 7, 9, 12…) appear below the fretboard.</li>
              <li>Colored dots are the notes of the selected arpeggio. Tap to hear them.</li>
              <li>On mobile, swipe the fretboard left/right to see all 15 frets.</li>
            </ul>
          </div>
        </div>

        {/* Fretboard Visualizer */}
        <div className="relative overflow-x-auto pb-4 custom-scrollbar">
            {/* Scroll Hint */}
            <div className="md:hidden text-xs text-center text-muted-foreground mb-2 italic">
               &larr; Scroll to see higher frets &rarr;
            </div>

            {/* Wrapper for string labels + fretboard */}
            <div className="flex items-stretch min-w-[800px]">

              {/* String Labels (left column) */}
              <div
                className="flex flex-col justify-between py-8 pr-2 flex-shrink-0"
                style={{ width: "40px", height: `${numStrings * 40 + 64}px` }} // match fretboard py-8 (32px top + 32px bottom)
              >
                {[...openStringNotes].reverse().map((noteName, i) => (
                  <div key={i} className="flex items-center justify-end h-8">
                    <span className="text-[11px] font-bold text-muted-foreground font-mono">{noteName}</span>
                  </div>
                ))}
              </div>

              {/* Container with Theme-Aware Styles (Maple/Rosewood) */}
              <div
                  id="fretboard-container"
                  className={cn(
                  "flex-1 select-none pl-4 pr-4 py-8 rounded-xl border border-border shadow-inner relative transition-colors duration-300",
                  "bg-[hsl(var(--fretboard))]"
              )}>

                  {/* Nut (Left side bar) */}
                  <div className="absolute left-4 top-8 bottom-8 w-3 bg-neutral-300 dark:bg-neutral-600 shadow-md z-10 border-r border-neutral-400 dark:border-neutral-800"></div>

                  {/* Strings & Frets Container */}
                  <div className="relative flex flex-col justify-between" style={{ height: `${numStrings * 40}px` }}>

                      {/* Fret Markers (Background) */}
                      <div className="absolute inset-0 w-full pointer-events-none">
                           {Array.from({ length: numFrets }).map((_, i) => (
                               <div
                                  key={i}
                                  className="absolute top-0 bottom-0 bg-neutral-400/50 dark:bg-neutral-500/30"
                                  style={{
                                      left: `${(i + 1) * (100 / (numFrets + 1))}%`,
                                      width: '2px',
                                      transform: 'translateX(-50%)'
                                   }}
                               >
                                  {/* Fret Numbers */}
                                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
                                      <span className={cn(
                                          "w-6 h-6 flex items-center justify-center text-xs font-mono font-bold rounded-full",
                                          [3, 5, 7, 9, 12, 15].includes(i + 1)
                                              ? "text-primary font-extrabold scale-125"
                                              : "text-neutral-500 dark:text-neutral-400"
                                      )}>
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
                                      className="absolute w-full shadow-sm z-0 transition-colors bg-neutral-400 dark:bg-neutral-500"
                                      style={{ height: `${2 + (sIdx * 0.5)}px` }}
                                  ></div>

                                  {/* Notes */}
                                  {stringVar.map((noteData, fretIdx) => {
                                      const inChord = isNoteInChord(noteData.note);
                                      const isRootNote = isRoot(noteData.note);

                                      // Fret spacing logic
                                      const notePercentage = fretIdx === 0 ? -2.5 : ((fretIdx - 0.5) * (100 / numFrets));

                                      return (
                                          <div
                                              key={fretIdx}
                                              className="absolute z-10 flex items-center justify-center"
                                              style={{ left: fretIdx === 0 ? '-18px' : `${notePercentage}%` }}
                                          >
                                              <button
                                                  type="button"
                                                  onClick={() => handleNoteClick(noteData)}
                                                  className={cn(
                                                      "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border shadow-sm",
                                                      inChord ? cn(
                                                          getNoteColorClass(noteData.note, isRootNote),
                                                          isRootNote ? "scale-110 shadow-md" : "hover:scale-110"
                                                      ) : "bg-transparent text-transparent border-transparent w-4 h-4 hover:w-7 hover:h-7 hover:bg-black/50 hover:text-white dark:hover:bg-white/20 dark:hover:text-white opacity-0 hover:opacity-100"
                                                  )}
                                                  title={`${getNoteName(noteData.noteIndex, rootNote)}${noteData.octave} — click to hear`}
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
        </div>

      </CardContent>
    </Card>
  );
}
