export type FretboardNote = {
  stringIndex: number;
  fret: number;
  note: string;
  noteIndex: number;
  octave: number;
  frequency: number;
};

export type GameState = "menu" | "playing" | "finished";
