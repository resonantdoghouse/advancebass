
export type Instrument = "ride" | "openhat" | "hihat" | "tom" | "snare" | "kick";
export type Pattern = Record<Instrument, boolean[]>;

export const MAX_STEPS = 16;
// Visual Order: Cymbals top, Drums bottom
export const INSTRUMENTS: Instrument[] = ["ride", "openhat", "hihat", "tom", "snare", "kick"];

export const DEFAULT_PATTERN: Pattern = {
  ride:    Array(MAX_STEPS).fill(false),
  openhat: Array(MAX_STEPS).fill(false),
  hihat:   [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
  tom:     Array(MAX_STEPS).fill(false),
  snare:   [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
  kick:    [true, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false],
};

export const PRESETS: { name: string; pattern: Pattern; bpm: number; steps: number; swing?: number }[] = [
  {
    name: "Standard Rock",
    bpm: 100,
    steps: 16,
    swing: 0,
    pattern: {
      ...DEFAULT_PATTERN,
      hihat:   [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      snare:   [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      kick:    [true, false, false, false, false, false, false, false, true, false, true, false, false, false, false, false],
    }
  },
  {
    name: "Modern Jazz Swing",
    bpm: 140,
    steps: 16,
    swing: 66, 
    pattern: {
      ...DEFAULT_PATTERN,
      ride:    [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false], // Ride pattern
      hihat:   [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], // Foot HH on 2 & 4
      snare:   [false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false], // Comping
      kick:    [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false], // Feathering
      openhat: Array(MAX_STEPS).fill(false),
      tom:     Array(MAX_STEPS).fill(false),
    }
  },
  {
    name: "Neo Soul (Dilla)",
    bpm: 86,
    steps: 16,
    swing: 45, 
    pattern: {
      ...DEFAULT_PATTERN,
      openhat: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false], 
      hihat:   [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      snare:   [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      kick:    [true, false, false, true, false, false, false, false, false, false, true, false, false, true, false, false],
    }
  },
  {
    name: "Fast Afrobeat",
    bpm: 118,
    steps: 16,
    swing: 10, 
    pattern: {
      ...DEFAULT_PATTERN,
      ride:    [true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true], // Ride bell pattern
      kick:    [true, false, false, true, false, false, true, false, false, false, true, false, false, true, false, false], 
      snare:   [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], 
      hihat:   Array(MAX_STEPS).fill(false),
    }
  },
  {
    name: "Cuban Songo",
    bpm: 105,
    steps: 16,
    swing: 0,
    pattern: {
      ...DEFAULT_PATTERN,
      kick:    [false, false, false, true, false, true, false, false, false, false, true, false, false, true, false, false], 
      snare:   [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false], 
      hihat:   [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], // Cowbell usually
      tom:     [false, false, true, false, false, false, false, false, false, false, false, true, false, false, false, false],
      openhat: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true],
    }
  }
];
