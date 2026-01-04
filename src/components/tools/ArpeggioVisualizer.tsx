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

  return (
    <Card className="w-full shadow-xl border-2 bg-card/95 backdrop-blur">
      <CardContent className="p-6 space-y-8">
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start text-xs text-muted-foreground bg-muted/20 p-2 rounded-lg">
            <span className="font-semibold mr-2">Intervals:</span>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500 border border-indigo-500 ring-1 ring-indigo-500/30 block"></span>
                <span>Root</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-600 border border-sky-700 block"></span>
                <span>3rd</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-700 block"></span>
                <span>5th</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-600 border border-amber-700 block"></span>
                <span>7th</span>
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-lg">
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-sm font-medium text-muted-foreground">Base Tuning</span>
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

            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-sm font-medium text-muted-foreground">Root</span>
                <Select value={rootNote} onValueChange={setRootNote}>
                    <SelectTrigger className="w-full md:w-[100px]">
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
                <span className="text-sm font-medium text-muted-foreground">Chord Type</span>
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

        {/* Fretboard Visualizer */}
        <div className="relative overflow-x-auto pb-4 custom-scrollbar">
            {/* Scroll Hint */}
            <div className="md:hidden text-xs text-center text-muted-foreground mb-2 italic">
               &larr; Scroll to see higher frets &rarr;
            </div>

            {/* Container with Theme-Aware Styles (Maple/Rosewood) */}
            <div 
                id="fretboard-container"
                className={cn(
                "min-w-[800px] select-none pl-12 pr-4 py-8 rounded-xl border border-border shadow-inner relative transition-colors duration-300",
                "bg-[hsl(var(--fretboard))]" // Theme-aware background
            )}>
                
                {/* Nut (Left side bar) */}
                <div className="absolute left-12 top-8 bottom-8 w-3 bg-neutral-300 dark:bg-neutral-600 shadow-md z-10 border-r border-neutral-400 dark:border-neutral-800"></div>

                {/* Strings & Frets Container */}
                <div className="relative flex flex-col justify-between" style={{ height: `${numStrings * 40}px` }}> {/* 40px spacing */}
                    
                    {/* Fret Markers (Background) */}
                    <div className="absolute inset-0 w-full pointer-events-none">
                         {Array.from({ length: numFrets }).map((_, i) => (
                             <div 
                                key={i} 
                                className="absolute top-0 bottom-0 bg-neutral-400/50 dark:bg-neutral-500/30" 
                                style={{ 
                                    left: `${(i + 1) * (100 / (numFrets + 1))}%`, 
                                    width: '2px', // Slight visual weight to frets
                                    transform: 'translateX(-50%)'
                                 }}
                             >
                                {/* Fret Numbers */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
                                    <span className={cn(
                                        "w-6 h-6 flex items-center justify-center text-xs font-mono font-bold rounded-full",
                                        [3, 5, 7, 9, 12, 15].includes(i + 1) 
                                            ? "text-primary font-extrabold scale-125" // Subtle highlight: Primary color + Larger
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
                                            style={{ left: fretIdx === 0 ? '-30px' : `${notePercentage}%` }}
                                        >
                                            <button
                                                onClick={() => handleNoteClick(noteData)}
                                                className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border shadow-sm",
                                                    inChord ? cn(
                                                        getNoteColorClass(noteData.note, isRootNote),
                                                        isRootNote ? "scale-110 shadow-md" : "hover:scale-110"
                                                    ) : "bg-transparent text-transparent border-transparent w-4 h-4 hover:w-7 hover:h-7 hover:bg-black/50 hover:text-white dark:hover:bg-white/20 dark:hover:text-white opacity-0 hover:opacity-100" // Ghost notes
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

        <div className="text-center text-sm text-muted-foreground">
            <p>Click any note to hear it. Use the controls above to change tuning, root, and chord type.</p>
        </div>

      </CardContent>
    </Card>
  );
}
