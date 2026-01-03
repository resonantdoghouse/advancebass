"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NOTES, SCALES, getScaleNotes, getAllFretboardNotes } from "@/lib/music-theory";
import { useBassSynth } from "@/hooks/useBassSynth";
import { TUNING_PRESETS } from "@/lib/tuner-utils";

type FretboardNote = {
  stringIndex: number;
  fret: number;
  note: string;
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
  const isRoot = (note: string) => note === rootNote;

  const handleNoteClick = (noteData: FretboardNote) => {
      playTone(noteData.frequency);
  };

  return (
    <Card className="w-full shadow-xl border-2 bg-card/95 backdrop-blur">
      <CardContent className="p-6 space-y-8">
        
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
                        {NOTES.map(note => (
                            <SelectItem key={note} value={note}>{note}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-sm font-medium text-muted-foreground">Scale</span>
                <Select value={scaleType} onValueChange={(val) => setScaleType(val as keyof typeof SCALES)}>
                    <SelectTrigger className="w-full md:w-[200px]">
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
                                <span className={cn(
                                    "absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono font-bold",
                                    "text-neutral-500 dark:text-neutral-400"
                                )}>
                                    {i + 1}
                                </span>
                                {/* Dot Inlays */}
                                {[3, 5, 7, 9, 12, 15].includes(i + 1) && (
                                    <div className={cn(
                                        "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex flex-col items-center justify-center gap-1 opacity-70",
                                        "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex flex-col items-center justify-center gap-1 opacity-70",
                                        "bg-[hsl(var(--fretboard-dot))]"
                                    )}>
                                        {(i + 1) === 12 && <div className={cn(
                                            "w-4 h-4 rounded-full absolute top-[-20px]",
                                            "w-4 h-4 rounded-full absolute top-[-20px]",
                                            "bg-[hsl(var(--fretboard-dot))]"
                                        )}></div> }
                                    </div>
                                )}
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
                                                    inScale ? (
                                                        isRootNote 
                                                            ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md ring-2 ring-primary/30" 
                                                            : "bg-background text-foreground border-foreground/20 hover:scale-110 hover:border-primary/50" // High contrast notes
                                                    ) : "bg-transparent text-transparent border-transparent w-4 h-4 hover:w-7 hover:h-7 hover:bg-black/50 hover:text-white dark:hover:bg-white/20 dark:hover:text-white opacity-0 hover:opacity-100" // Ghost notes
                                                )}
                                                title={`${noteData.note}${noteData.octave}`}
                                            >
                                                {noteData.note}
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
            <p>Click any note to hear it. Use the controls above to change tuning, key, and scale.</p>
        </div>

      </CardContent>
    </Card>
  );
}
