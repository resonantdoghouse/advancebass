"use client";

import { useState } from "react";
import { TUNING_PRESETS } from "@/lib/tuner-utils";
import { getAllFretboardNotes } from "@/lib/music-theory";
import { Instructions } from "@/components/tools/fretboard-trainer/Instructions";
import { GameStatus } from "@/components/tools/fretboard-trainer/GameStatus";
import { Fretboard } from "@/components/tools/fretboard-trainer/Fretboard";
import { useFretboardGame } from "@/hooks/useFretboardGame";
import { FretboardNote } from "@/components/tools/fretboard-trainer/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TUNING_OPTIONS = [
  { id: "4-string-standard", name: "4 String (Standard)" },
  { id: "5-string-standard-low-b", name: "5 String (Low B)" },
  { id: "5-string-standard-high-c", name: "5 String (High C)" },
  { id: "6-string-standard", name: "6 String (Standard)" },
];

export function FretboardTrainer() {
  const [showInstructions, setShowInstructions] = useState(false);
  const {
    gameState,
    score,
    timeLeft,
    tuningId,
    setTuningId,
    lastClickedFret,
    feedback,
    startGame,
    handleNoteClick,
    getTargetNoteName,
    getNoteStyle,
    GAME_DURATION,
  } = useFretboardGame();

  const currentTuning = TUNING_PRESETS[tuningId as keyof typeof TUNING_PRESETS];
  const numStrings = currentTuning.strings.length;
  const numFrets = 15;
  const fretboardData = getAllFretboardNotes(currentTuning.strings, numFrets);

  const stringsData: FretboardNote[][] = Array.from(
    { length: numStrings },
    () => [],
  );
  fretboardData.forEach((pos) => {
    // We can cast here because we know our lib returns compatible data structure
    // essentially matching FretboardNote but we need to ensure type safety if logic changes.
    // Ideally update lib return type or FretboardNote to match exactly.
    // For now assuming getAllFretboardNotes returns objects compatible with FretboardNote.
    stringsData[pos.stringIndex][pos.fret] = pos as unknown as FretboardNote;
  });

  return (
    <div className="w-full rounded-[22px] border border-border bg-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] p-6 md:p-8 space-y-8">
      <Instructions
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
        />

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase font-semibold">
            Tuning
          </span>
          <Select
            value={tuningId}
            onValueChange={setTuningId}
            disabled={gameState === "playing"}
          >
            <SelectTrigger className="w-full sm:w-[220px] bg-background/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TUNING_OPTIONS.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <GameStatus
          gameState={gameState}
          score={score}
          timeLeft={timeLeft}
          gameDuration={GAME_DURATION}
          targetNoteName={getTargetNoteName()}
          onStartGame={startGame}
        />

        <Fretboard
          numStrings={numStrings}
          numFrets={numFrets}
          stringsData={stringsData}
          gameState={gameState}
          onNoteClick={handleNoteClick}
          getNoteStyle={getNoteStyle}
          lastClickedFret={lastClickedFret}
          feedback={feedback}
        />

        <p className="text-center text-xs text-muted-foreground/60 font-mono">
          {gameState === "menu"
            ? "Press Start Game to begin training"
            : "Click the fretboard location matching the requested note"}
        </p>
    </div>
  );
}
