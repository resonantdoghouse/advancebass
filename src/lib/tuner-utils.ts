export const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export interface Note {
  note: string;
  octave: number;
  frequency: number;
  cents: number;
  error: number; // Difference in frequency
}

/**
 * Converts a frequency to the nearest musical note.
 */
export function getNoteFromFrequency(frequency: number): Note {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
  const roundedNote = Math.round(noteNum);
  const cents = (noteNum - roundedNote) * 100;
  
  const noteIndex = roundedNote % 12;
  const octave = Math.floor(roundedNote / 12) - 1;
  const noteString = NOTE_STRINGS[noteIndex];
  
  // Calculate standard frequency for this note
  const standardFreq = 440 * Math.pow(2, (roundedNote - 69) / 12);
  
  return {
    note: noteString,
    octave,
    frequency: standardFreq,
    cents: cents,
    error: frequency - standardFreq
  };
}

/**
 * Auto-correlation algorithm for pitch detection.
 * Good balance of performance and accuracy for monophonic sources like bass.
 */
export function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  // Implements the YIN or simple autocorrelation algorithm
  let size = buf.length;
  let rms = 0;

  for (let i = 0; i < size; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / size);

  if (rms < 0.01) {
    return -1; // Not enough signal
  }

  let r1 = 0, r2 = size - 1, thres = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break; }
  }

  buf = buf.slice(r1, r2);
  size = buf.length;

  const c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] = c[i] + buf[j] * buf[j + i];
    }
  }

  let d = 0; while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

export type StringConfig = {
    note: string;
    octave: number;
    frequency: number;
};

export const TUNING_PRESETS = {
    "4-string-standard": {
        name: "Standard (4 String)",
        strings: [
            { note: "E", octave: 1, frequency: 41.203 },
            { note: "A", octave: 1, frequency: 55.000 },
            { note: "D", octave: 2, frequency: 73.416 },
            { note: "G", octave: 2, frequency: 97.999 },
        ]
    },
     "5-string-standard-low-b": {
        name: "Standard (5 String Low B)",
        strings: [
            { note: "B", octave: 0, frequency: 30.868 },
            { note: "E", octave: 1, frequency: 41.203 },
            { note: "A", octave: 1, frequency: 55.000 },
            { note: "D", octave: 2, frequency: 73.416 },
            { note: "G", octave: 2, frequency: 97.999 },
        ]
    },
    "5-string-standard-high-c": {
        name: "Standard (5 String High C)",
        strings: [
            { note: "E", octave: 1, frequency: 41.203 },
            { note: "A", octave: 1, frequency: 55.000 },
            { note: "D", octave: 2, frequency: 73.416 },
            { note: "G", octave: 2, frequency: 97.999 },
            { note: "C", octave: 3, frequency: 130.81 },
        ]
    },
    "6-string-standard": {
        name: "Standard (6 String)",
        strings: [
            { note: "B", octave: 0, frequency: 30.868 },
            { note: "E", octave: 1, frequency: 41.203 },
            { note: "A", octave: 1, frequency: 55.000 },
            { note: "D", octave: 2, frequency: 73.416 },
            { note: "G", octave: 2, frequency: 97.999 },
            { note: "C", octave: 3, frequency: 130.81 },
        ]
    },
    "drop-d": {
        name: "Drop D (4 String)",
        strings: [
             { note: "D", octave: 1, frequency: 36.708 },
             { note: "A", octave: 1, frequency: 55.000 },
             { note: "D", octave: 2, frequency: 73.416 },
             { note: "G", octave: 2, frequency: 97.999 },
        ]
    }
};
