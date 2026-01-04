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

/**
 * Convert a frequency (Hz) to the nearest musical note and octave.
 */
export function getNoteFromFrequency(frequency: number): { note: string; octave: number; cents: number } {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75); // ~16.35 Hz
  const name = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  if (frequency <= 0) return { note: "", octave: 0, cents: 0 };

  const h = Math.round(12 * Math.log2(frequency / C0));
  const octave = Math.floor(h / 12);
  const n = h % 12;
  
  // Calculate cents off
  // exact frequency of the note found:
  const noteFreq = C0 * Math.pow(2, h / 12);
  const cents = 1200 * Math.log2(frequency / noteFreq);

  return {
    note: name[n],
    octave: octave,
    cents: Math.round(cents)
  };
}

/**
 * Analyze frequency data to detect a chord.
 * Uses Peak Picking + simplified Chroma feature extraction.
 */
export function detectChord(frequencies: Uint8Array, sampleRate: number): string {
  if (!frequencies || frequencies.length === 0) return "-";

  const binCount = frequencies.length;
  // Frequency step per bin: sampleRate / (2 * binCount) if binCount = fftSize/2
  // For fftSize = 4096, binCount = 2048. Max Freq = 24000. BinWidth ~ 11.7Hz
  const binWidth = (sampleRate / 2) / binCount;

  // Chroma vector (12 pitch classes: C, C#, ..., B)
  const chroma = new Float32Array(12).fill(0);
  
  // Only check a relevant frequency range (e.g., 60Hz to 2000Hz)
  const minFreq = 60;
  const maxFreq = 2500;
  
  // Peak Picking Threshold
  const noiseThreshold = 100; // Increased threshold to ignore background
  
  let maxEnergies = 0;

  for (let i = 2; i < binCount - 2; i++) {
    const amplitude = frequencies[i];
    
    // 1. Threshold Gate
    if (amplitude < noiseThreshold) continue;

    // 2. Peak Picking: Must be a local maximum
    // Simple check: > prev and > next
    if (amplitude <= frequencies[i-1] || amplitude <= frequencies[i+1]) continue;

    const freq = i * binWidth;
    if (freq < minFreq || freq > maxFreq) continue;

    // Map to MIDI Note
    const midi = 69 + 12 * Math.log2(freq / 440);
    const roundedMidi = Math.round(midi);
    
    // Weight by amplitude and frequency relevance (lower frequencies often fundamental)
    // We just use amplitude for now, maybe log amplitude?
    const weight = amplitude; 
    
    const pitchClass = roundedMidi % 12; 
    
    if (pitchClass >= 0 && pitchClass < 12) {
       chroma[pitchClass] += weight;
    }
  }

  // Normalize chroma
  let maxChromaVal = 0;
  for(let i=0; i<12; i++) {
      if (chroma[i] > maxChromaVal) maxChromaVal = chroma[i];
  }
  
  if (maxChromaVal < 10) return "-"; 

  // Select active notes based on % of max energy
  const activeNotes: number[] = [];
  const relativeThreshold = maxChromaVal * 0.6; // Stricter: must be 60% of strongest note
  
  for(let i=0; i<12; i++) {
      if (chroma[i] >= relativeThreshold) {
          activeNotes.push(i);
      }
  }
  
  // Need at least 2 notes to imply a chord usually, but let's be lenient
  if (activeNotes.length < 2) return "-"; 

  const TRIAD_MAJ = [0, 4, 7];
  const TRIAD_MIN = [0, 3, 7];
  const SEVEN_DOM = [0, 4, 7, 10];
  const SEVEN_MAJ = [0, 4, 7, 11];
  const SEVEN_MIN = [0, 3, 7, 10];
  
  let bestMatch = "";
  let bestMatchScore = 0;

  function matchChord(activeNotes: number[], root: number, pattern: number[]): number {
      let matches = 0;
      let penalties = 0;
      
      // Check for presence of pattern notes
      for (const semitone of pattern) {
          const targetNote = (root + semitone) % 12;
          if (activeNotes.includes(targetNote)) {
              matches++;
          }
      }
      
      // Penalize active notes that are NOT in the pattern (optional tightness)
      // activeNotes.forEach(n => {
      //    // check if n fits in pattern relative to root
      //    const interval = (n - root + 12) % 12;
      //    if (!pattern.includes(interval)) penalties += 0.5;
      // });
      
      return matches - penalties;
  }

  function getNoteName(index: number): string {
      const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      return names[index];
  }

  // Try each active note as potential root
  for (const root of activeNotes) {
      const patterns = [
        { pat: TRIAD_MAJ, suffix: "", requiredMatches: 2.5 }, // 3 notes
        { pat: TRIAD_MIN, suffix: "m", requiredMatches: 2.5 }, // 3 notes
        { pat: SEVEN_DOM, suffix: "7", requiredMatches: 3 }, // 4 notes
        { pat: SEVEN_MAJ, suffix: "maj7", requiredMatches: 3 }, // 4 notes
        { pat: SEVEN_MIN, suffix: "m7", requiredMatches: 3 } // 4 notes
      ];
      
      for(const p of patterns) {
         const score = matchChord(activeNotes, root, p.pat);
         // Prioritize more complex matches if score is high
         // Normalize score? 
         // For now just raw matches. 
         
         // Require specific minimum matches
         if (score >= p.requiredMatches) {
             if (score > bestMatchScore) { 
                 bestMatchScore = score; 
                 bestMatch = getNoteName(root) + p.suffix; 
             }
         }
      }
  }
  
  if (bestMatch) { 
      return bestMatch;
  }

  return "-";
}

