"use client";

import { useState } from "react";
import { TUNING_PRESETS } from "@/lib/tuner-utils";
import { getAllFretboardNotes } from "@/lib/music-theory";
import { Instructions } from "@/components/tools/fretboard-trainer/Instructions";
import { GameStatus } from "@/components/tools/fretboard-trainer/GameStatus";
import { Fretboard } from "@/components/tools/fretboard-trainer/Fretboard";
import { useFretboardGame } from "@/hooks/useFretboardGame";
import { FretboardNote } from "@/components/tools/fretboard-trainer/types";

export function FretboardTrainer() {
  const [showInstructions, setShowInstructions] = useState(false);
  const {
    gameState,
    score,
    timeLeft,
    tuningId,
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
