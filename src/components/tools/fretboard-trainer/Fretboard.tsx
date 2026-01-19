import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FretboardNote, GameState } from "./types";

interface FretboardProps {
  numStrings: number;
  numFrets: number;
  stringsData: FretboardNote[][];
  gameState: GameState;
  onNoteClick: (note: FretboardNote) => void;
  getNoteStyle: (note: FretboardNote) => string;
  lastClickedFret: { string: number; fret: number } | null;
  feedback: { type: "correct" | "incorrect"; message: string } | null;
}

export function Fretboard({
  numStrings,
  numFrets,
  stringsData,
  gameState,
  onNoteClick,
  getNoteStyle,
  lastClickedFret,
  feedback,
}: FretboardProps) {
  return (
    <div className="relative pb-8 select-none">
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div
          className={cn(
            "min-w-[800px] pl-16 pr-4 py-10 rounded-xl border-y-4 border-x border-amber-900/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] relative transition-opacity duration-300",
            // Wood texture gradient background
            "bg-[#3e2723] bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:20px_20px]",
            gameState === "menu"
              ? "opacity-80 grayscale-[0.3]"
              : "opacity-100 ring-2 ring-primary/20",
          )}
        >
          {/* Nut (Left side bar) */}
          <div className="absolute left-16 top-0 bottom-0 w-4 bg-[#eecfa1] bg-[linear-gradient(to_right,rgba(0,0,0,0.1),transparent,rgba(0,0,0,0.2))] shadow-lg z-20 border-r border-[#8d6e63]"></div>

          {/* String Labels (Left of Nut) */}
          <div
            className="absolute left-4 top-10 bottom-10 flex flex-col justify-between items-center py-2 h-[calc(100%-80px)]"
            style={{ height: `${numStrings * 45}px` }}
          >
            {/* Match board height */}
            {stringsData
              .slice()
              .reverse()
              .map((stringVar, idx) => {
                // Determine label based on open string note
                const openNote = stringVar[0]; // Fret 0
                return (
                  <div
                    key={idx}
                    className="h-10 flex items-center justify-center font-bold text-muted-foreground w-8"
                  >
                    {openNote.note.replace(/[0-9]/g, "")}
                  </div>
                );
              })}
          </div>

          {/* Fretboard Layout */}
          <div
            className="relative flex flex-col justify-between"
            style={{ height: `${numStrings * 45}px` }}
          >
            {/* 1. Fret Wires (Background Layer) */}
            <div className="absolute inset-0 w-full pointer-events-none">
              {Array.from({ length: numFrets }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0"
                  style={{
                    left: `${(i + 1) * (100 / numFrets)}%`,
                    width: "0", // Wrapper
                  }}
                >
                  {/* Fret Wire */}
                  <div className="absolute left-0 top-[-4px] bottom-[-4px] w-1 bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 shadow-[2px_0_3px_rgba(0,0,0,0.3)] -translate-x-1/2 rounded-full z-10 opacity-90"></div>

                  {/* Fret Number */}
                  <div className="absolute -bottom-10 left-0 -translate-x-1/2 flex items-center justify-center">
                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold transition-colors",
                        [3, 5, 7, 9, 12, 15].includes(i + 1)
                          ? "text-primary/70"
                          : "text-muted-foreground/30",
                      )}
                    >
                      {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Frets Markers (Inlays & Side Dots) - Centered in Fret Space */}
            <div className="absolute inset-0 w-full pointer-events-none">
              {Array.from({ length: numFrets }).map((_, i) => {
                const fretCenterPercent = (i + 0.5) * (100 / numFrets);
                const isMarkerFret = [3, 5, 7, 9, 12, 15].includes(i + 1);

                if (!isMarkerFret) return null;

                return (
                  <div
                    key={`marker-${i}`}
                    className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
                    style={{
                      left: `${fretCenterPercent}%`,
                      width: "0",
                    }}
                  >
                    {/* Side Dot (Top Edge) */}
                    <div className="absolute top-[-24px] flex justify-center w-20">
                      {i + 1 === 12 ? (
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 shadow-sm"></div>
                          <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 shadow-sm"></div>
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 shadow-sm"></div>
                      )}
                    </div>

                    {/* Board Inlay (Middle) */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex justify-center opacity-40 mix-blend-overlay">
                      {i + 1 === 12 ? (
                        <div className="flex gap-8">
                          <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm shadow-inner"></div>
                          <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm shadow-inner"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm shadow-inner"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Strings & Interactive Hitboxes (Foreground Layer) */}
            {stringsData
              .slice()
              .reverse()
              .map((stringVar, sIdx) => {
                const actualStringIndex = numStrings - 1 - sIdx;
                // Visual thickness based on string index (Index 0 is thickest/Low E)
                const thickness = 4 - actualStringIndex * 0.6;

                return (
                  <div
                    key={actualStringIndex}
                    className="relative w-full h-10 flex items-center"
                  >
                    {/* String Shadow (Cast on Board) */}
                    <div
                      className="absolute w-full z-0 blur-[1px] opacity-40 pointer-events-none"
                      style={{
                        height: `${thickness}px`,
                        top: `calc(50% + ${thickness}px)`,
                        backgroundColor: "black",
                      }}
                    />

                    {/* String Graphic */}
                    <div
                      className="absolute w-full z-10 pointer-events-none transition-all"
                      style={{
                        height: `${Math.max(1, thickness)}px`,
                        background:
                          actualStringIndex < 2
                            ? "repeating-linear-gradient(90deg, #9ca3af, #9ca3af 1px, #d1d5db 2px, #9ca3af 3px)" // Heavy winding (E, A)
                            : actualStringIndex === 2
                              ? "repeating-linear-gradient(90deg, #9ca3af, #9ca3af 1px, #d1d5db 2px, #9ca3af 2px)" // Medium winding (D)
                              : "linear-gradient(to bottom, #e5e7eb, #9ca3af)", // Smooth plain string (G)
                        boxShadow: "0 1px 1px rgba(0,0,0,0.4)",
                      }}
                    ></div>

                    {/* Interactive Note Hitboxes */}
                    {stringVar.map((noteData, fretIdx) => {
                      const fretWidthPercentage = 100 / numFrets;
                      const leftPercentage =
                        (fretIdx - 1) * fretWidthPercentage;

                      return (
                        <div
                          key={fretIdx}
                          className="absolute z-20 flex items-center justify-end pr-2 h-[120%] -top-[10%] group cursor-pointer" // Taller hitbox, right aligned
                          style={{
                            left:
                              fretIdx === 0 ? "-30px" : `${leftPercentage}%`,
                            width:
                              fretIdx === 0
                                ? "40px"
                                : `${fretWidthPercentage}%`,
                          }}
                        >
                          {/* Hover Highlight Container - fills the fret space (Right aligned for fingering) */}
                          <div
                            className={cn(
                              "absolute right-1 top-1 bottom-1 w-[70%] rounded-md transition-all duration-150",
                              gameState === "playing"
                                ? "group-hover:bg-primary/20 group-hover:shadow-[inset_0_0_10px_rgba(var(--primary),0.3)]"
                                : "",
                            )}
                          ></div>

                          {/* Note Indicator (Circle) */}
                          <button
                            onClick={() => onNoteClick(noteData)}
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-150 relative z-30",
                              getNoteStyle(noteData),
                            )}
                          >
                            {/* Feedback Icon */}
                            {lastClickedFret?.string === noteData.stringIndex &&
                              lastClickedFret?.fret === noteData.fret &&
                              (feedback?.type === "correct" ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : feedback?.type === "incorrect" ? (
                                <XCircle className="h-6 w-6" />
                              ) : null)}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="absolute top-4 left-6 text-xs font-mono text-muted-foreground/50 rotate-90 origin-left">
          NUT
        </div>
      </div>
    </div>
  );
}
