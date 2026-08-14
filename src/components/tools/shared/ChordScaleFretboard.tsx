import { cn } from "@/lib/utils";
import { getNoteName } from "@/lib/music-theory";
import type { FretboardNote } from "@/components/tools/fretboard-trainer/types";

interface ChordScaleFretboardProps {
  stringsData: FretboardNote[][];
  numStrings: number;
  numFrets: number;
  rootNote: string;
  isNoteHighlighted: (note: string) => boolean;
  isRoot: (note: string) => boolean;
  getNoteColorClass: (note: string, isRootNote: boolean) => string;
  onNoteClick: (note: FretboardNote) => void;
  /** Appended to each note button's hover title, e.g. " — click to hear". */
  titleSuffix?: string;
  /** Renders open-string note names in a column left of the nut (Arpeggio Visualizer style). */
  showStringLabels?: boolean;
  openStringNotes?: string[];
}

// Shared fretboard renderer for Scale Visualizer and Arpeggio Visualizer —
// both tools highlight a set of notes (scale/chord) over the same bass
// fretboard layout and differ only in the highlight predicate and coloring.
export function ChordScaleFretboard({
  stringsData,
  numStrings,
  numFrets,
  rootNote,
  isNoteHighlighted,
  isRoot,
  getNoteColorClass,
  onNoteClick,
  titleSuffix = "",
  showStringLabels = false,
  openStringNotes = [],
}: ChordScaleFretboardProps) {
  const nutOffset = showStringLabels ? "left-4" : "left-12";
  const containerPadding = showStringLabels ? "pl-4" : "pl-12";
  const openFretLeft = showStringLabels ? "-18px" : "-30px";

  const fretboard = (
    <div
      id="fretboard-container"
      className={cn(
        "select-none pr-4 py-8 rounded-[16px] relative fretboard-container border border-slate-700/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]",
        showStringLabels ? "flex-1" : "min-w-[800px]",
        containerPadding,
      )}
    >
      {/* Nut */}
      <div
        className={cn(
          "absolute top-8 bottom-8 w-3.5 bg-gradient-to-r from-neutral-500 to-neutral-400 shadow-md z-10 border-r border-neutral-700 rounded-sm",
          nutOffset,
        )}
      ></div>

      {/* Strings & Frets Container */}
      <div
        className="relative flex flex-col justify-between"
        style={{ height: `${numStrings * 40}px` }}
      >
        {/* Fret Markers (Background) */}
        <div className="absolute inset-0 w-full pointer-events-none">
          {Array.from({ length: numFrets }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 bg-white/10"
              style={{
                left: `${(i + 1) * (100 / (numFrets + 1))}%`,
                width: "1px",
                transform: "translateX(-50%)",
              }}
            >
              {/* Fret Numbers */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <span
                  className="w-6 h-6 flex items-center justify-center font-mono font-bold rounded-full"
                  style={{
                    color: [3, 5, 7, 9, 12, 15].includes(i + 1)
                      ? "#5b9bff"
                      : "#3d4f6b",
                    fontSize: [3, 5, 7, 9, 12, 15].includes(i + 1)
                      ? "11px"
                      : "10px",
                  }}
                >
                  {i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Strings and Notes */}
        {stringsData
          .slice()
          .reverse()
          .map((stringVar, sIdx) => {
            const actualStringIndex = numStrings - 1 - sIdx;

            return (
              <div
                key={actualStringIndex}
                className="relative w-full h-8 flex items-center"
              >
                {/* String Line */}
                <div
                  className="absolute w-full z-0"
                  style={{
                    height: `${2 + sIdx * 0.5}px`,
                    background: "rgba(148,163,184,0.45)",
                  }}
                ></div>

                {/* Notes */}
                {stringVar.map((noteData, fretIdx) => {
                  const highlighted = isNoteHighlighted(noteData.note);
                  const isRootNote = isRoot(noteData.note);

                  // Fret spacing logic
                  const notePercentage =
                    fretIdx === 0
                      ? -2.5
                      : (fretIdx - 0.5) * (100 / numFrets);

                  const displayName = getNoteName(
                    noteData.noteIndex,
                    rootNote,
                  );

                  return (
                    <div
                      key={fretIdx}
                      className="absolute z-10 flex items-center justify-center"
                      style={{
                        left: fretIdx === 0 ? openFretLeft : `${notePercentage}%`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onNoteClick(noteData)}
                        aria-label={`${displayName}${noteData.octave}, string ${noteData.stringIndex + 1}, ${noteData.fret === 0 ? "open" : `fret ${noteData.fret}`}${isRootNote ? ", root" : ""}`}
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border shadow-sm",
                          highlighted
                            ? cn(
                                getNoteColorClass(noteData.note, isRootNote),
                                isRootNote
                                  ? "scale-110 shadow-md"
                                  : "hover:scale-110",
                              )
                            : "bg-transparent text-transparent border-transparent w-4 h-4 hover:w-7 hover:h-7 hover:bg-white/20 hover:text-white opacity-0 hover:opacity-100",
                        )}
                        title={`${displayName}${noteData.octave}${titleSuffix}`}
                      >
                        {displayName}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="relative overflow-x-auto pb-4 custom-scrollbar">
      {/* Scroll Hint */}
      <div className="md:hidden text-xs text-center text-muted-foreground mb-2 italic">
        &larr; Scroll to see higher frets &rarr;
      </div>

      {showStringLabels ? (
        <div className="flex items-stretch min-w-[800px]">
          {/* String Labels (left column) */}
          <div
            className="flex flex-col justify-between py-8 pr-2 flex-shrink-0"
            style={{ width: "40px", height: `${numStrings * 40 + 64}px` }} // match fretboard py-8 (32px top + 32px bottom)
          >
            {[...openStringNotes].reverse().map((noteName, i) => (
              <div key={i} className="flex items-center justify-end h-8">
                <span
                  className="text-[11px] font-bold font-mono"
                  style={{ color: "#5b6b85" }}
                >
                  {noteName}
                </span>
              </div>
            ))}
          </div>

          {fretboard}
        </div>
      ) : (
        fretboard
      )}
    </div>
  );
}
