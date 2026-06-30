"use client";

import { useState } from "react";
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

      // Default Chord Note
      return "bg-white/15 text-white/90 border-white/20";
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
                    <span className="text-[11px] font-bold font-mono" style={{ color: "#5b6b85" }}>{noteName}</span>
                  </div>
                ))}
              </div>

              {/* Always-dark fretboard */}
              <div
                  id="fretboard-container"
                  className="flex-1 select-none pl-4 pr-4 py-8 rounded-[14px] shadow-inner relative"
                  style={{ background: "#0c1424" }}>

                  {/* Nut */}
                  <div className="absolute left-4 top-8 bottom-8 w-3 bg-neutral-600 shadow-md z-10 border-r border-neutral-700"></div>

                  {/* Strings & Frets Container */}
                  <div className="relative flex flex-col justify-between" style={{ height: `${numStrings * 40}px` }}>

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
                                          className="w-6 h-6 flex items-center justify-center font-mono font-bold rounded-full"
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
                                                      ) : "bg-transparent text-transparent border-transparent w-4 h-4 hover:w-7 hover:h-7 hover:bg-white/20 hover:text-white opacity-0 hover:opacity-100"
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

    </div>
  );
}
