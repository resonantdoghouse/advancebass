export const NOTES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
export const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];

export const SCALES = {
  chromatic: { name: "Chromatic", pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  major: { name: "Major", pattern: [2, 2, 1, 2, 2, 2, 1] },
  natural_minor: { name: "Natural Minor", pattern: [2, 1, 2, 2, 1, 2, 2] },
  harmonic_minor: { name: "Harmonic Minor", pattern: [2, 1, 2, 2, 1, 3, 1] },
  melodic_minor: { name: "Melodic Minor", pattern: [2, 1, 2, 2, 2, 2, 1] },
  major_pentatonic: { name: "Major Pentatonic", pattern: [2, 2, 3, 2, 3] },
  minor_pentatonic: { name: "Minor Pentatonic", pattern: [3, 2, 2, 3, 2] },
  blues: { name: "Blues", pattern: [3, 2, 1, 1, 3, 2] },
  dorian: { name: "Dorian", pattern: [2, 1, 2, 2, 2, 1, 2] },
  phrygian: { name: "Phrygian", pattern: [1, 2, 2, 2, 1, 2, 2] },
  lydian: { name: "Lydian", pattern: [2, 2, 2, 1, 2, 2, 1] },
  mixolydian: { name: "Mixolydian", pattern: [2, 2, 1, 2, 2, 1, 2] },
  locrian: { name: "Locrian", pattern: [1, 2, 2, 1, 2, 2, 2] },
};

export const CHORDS = {
  major: { name: "Major", pattern: [4, 3, 5] },           // 1-3-5
  minor: { name: "Minor", pattern: [3, 4, 5] },           // 1-b3-5
  major7: { name: "Major 7", pattern: [4, 3, 4, 1] },     // 1-3-5-7
  minor7: { name: "Minor 7", pattern: [3, 4, 3, 2] },     // 1-b3-5-b7
  dominant7: { name: "Dominant 7", pattern: [4, 3, 3, 2] }, // 1-3-5-b7
  diminished: { name: "Diminished", pattern: [3, 3, 6] },   // 1-b3-b5 (dim triad) - technically 1-b3-b5. Full dim7 is 1-b3-b5-bb7
  m7b5: { name: "Half-Diminished (m7b5)", pattern: [3, 3, 4, 2] }, // 1-b3-b5-b7
  augmented: { name: "Augmented", pattern: [4, 4, 4] },    // 1-3-#5
};

// Map specific key names to our canonical 12-tone array names
const NOTE_ALIASES: Record<string, string> = {
  "Cb": "B",
  "Db": "C#/Db",
  "Eb": "D#/Eb",
  "Gb": "F#/Gb",
  "Ab": "G#/Ab",
  "Bb": "A#/Bb",
  "C#": "C#/Db",
  "D#": "D#/Eb",
  "F#": "F#/Gb",
  "G#": "G#/Ab",
  "A#": "A#/Bb",
  "E#": "F", // Theoretical but possible in C# Major
  "B#": "C"  // Theoretical
};

// Derived from Western Harmony (Standard Keys)
export const WESTERN_ROOTS = [
  "C",   "G",  "D",  "A",  "E",  "B",  "F#", 
  "Gb", "Db", "Ab", "Eb", "Bb", "F",
  // Minor roots often used
  "C#", "G#", "D#", "A#"
];

// Determine if a key uses sharps or flats
export function getKeyAccidental(root: string): 'sharp' | 'flat' {
  const flatKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"]; // Keys with flats
  return flatKeys.includes(root) ? 'flat' : 'sharp'; // Default to sharp for C and sharp keys
}

// Get the display name for a note index based on key context
export function getNoteName(noteIndex: number, keyRoot: string): string {
  const accidental = getKeyAccidental(keyRoot);
  return accidental === 'flat' ? NOTES_FLAT[noteIndex] : NOTES_SHARP[noteIndex];
}

// Helper to resolve any note name to canonical form
export function normalizeRoot(root: string): string {
    if (NOTES.includes(root)) return root;
    return NOTE_ALIASES[root] || root;
}

// Calculate the interval in semitones between a root and a target note
export function getInterval(root: string, note: string): number {
    const rootIndex = NOTES.indexOf(normalizeRoot(root));
    const noteIndex = NOTES.indexOf(normalizeRoot(note));
    if (rootIndex === -1 || noteIndex === -1) return -1;
    
    let interval = noteIndex - rootIndex;
    if (interval < 0) interval += 12;
    return interval;
}


export function getScaleNotes(rootNote: string, scaleKey: keyof typeof SCALES): string[] {
  const normalizedRoot = normalizeRoot(rootNote);
  const rootIndex = NOTES.indexOf(normalizedRoot);
  if (rootIndex === -1) return [];

  const pattern = SCALES[scaleKey].pattern;
  const scaleNotes = [NOTES[rootIndex]]; // Start with root
  
  let currentIndex = rootIndex;
  for (const interval of pattern) {
    currentIndex = (currentIndex + interval) % 12;
    scaleNotes.push(NOTES[currentIndex]);
  }
  
  scaleNotes.pop(); 

  return scaleNotes;
}

export function getChordNotes(rootNote: string, chordKey: keyof typeof CHORDS): string[] {
    const normalizedRoot = normalizeRoot(rootNote);
    const rootIndex = NOTES.indexOf(normalizedRoot);
    if (rootIndex === -1) return [];

    const pattern = CHORDS[chordKey].pattern;
    const chordNotes = [NOTES[rootIndex]]; 

    let currentIndex = rootIndex;
    for (const interval of pattern) {
        currentIndex = (currentIndex + interval) % 12;
        chordNotes.push(NOTES[currentIndex]);
    }
    
    chordNotes.pop();

    return chordNotes;
}

export function getAllFretboardNotes(
  tuning: { note: string; octave: number }[],
  frets = 24
) {
  // Generate a map of all notes on the fretboard
  const fretboard: { stringIndex: number; fret: number; note: string; noteIndex: number; octave: number; frequency: number }[] = [];

  tuning.forEach((stringInfo, stringIndex) => {
    // Find index of the open string note, handling enharmonics (e.g. "C#" matching "C#/Db")
    let currentNoteIndex = NOTES.findIndex(n => n === stringInfo.note || n.split('/').includes(stringInfo.note));
    
    // Fallback if not found (shouldn't happen with standard tunings but for safety)
    if (currentNoteIndex === -1) currentNoteIndex = 0;

    let currentOctave = stringInfo.octave;

    for (let fret = 0; fret <= frets; fret++) {
      const noteName = NOTES[currentNoteIndex];
      
      // Calculate frequency
      // Standard A4 = 440Hz. Formula: f = 440 * 2^((n - 69)/12)
      
      const midiNumber = (currentOctave + 1) * 12 + currentNoteIndex;
      const frequency = 440 * Math.pow(2, (midiNumber - 69) / 12);

      fretboard.push({
        stringIndex,
        fret,
        note: noteName,
        noteIndex: currentNoteIndex, // 0-11
        octave: currentOctave,
        frequency
      });

      // Increment
      currentNoteIndex++;
      if (currentNoteIndex >= 12) {
        currentNoteIndex = 0;
        currentOctave++;
      }
    }
  });

  return fretboard;
}
