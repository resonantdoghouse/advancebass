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

export function getScaleNotes(rootNote: string, scaleKey: keyof typeof SCALES): string[] {
  const rootIndex = NOTES.indexOf(rootNote);
  if (rootIndex === -1) return [];

  const pattern = SCALES[scaleKey].pattern;
  const scaleNotes = [NOTES[rootIndex]]; // Start with root
  
  let currentIndex = rootIndex;
  for (const interval of pattern) {
    currentIndex = (currentIndex + interval) % 12;
    scaleNotes.push(NOTES[currentIndex]);
  }
  
  // Remove the last note if it repeats the root (for 7 note scales patterns sometimes imply octave, but standard is to define intervals that sum to 12)
  // My patterns sum to 12 (e.g. major: 2+2+1+2+2+2+1 = 12).
  // The loop above adds the octave at the end. Let's keep it or remove it depending on UI preference. 
  // Usually for visualization we just want the unique notes in the scale.
  // Actually, let's keep unique notes.
  scaleNotes.pop(); 

  return scaleNotes;
}

export function getAllFretboardNotes(
  tuning: { note: string; octave: number }[],
  frets = 24
) {
  // Generate a map of all notes on the fretboard
  const fretboard: { stringIndex: number; fret: number; note: string; octave: number; frequency: number }[] = [];

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
      // We need absolute semitone index. MID note number.
      // C1 is midi 24. A1 is 33. E1 (bass low E) is 28.
      // noteIndex is 0-11 (C to B). 
      // Midi number = (octave + 1) * 12 + noteIndex
      // Wait, octave 0 is standard C0. 
      // Let's rely on relative calculation or just simple formula.
      
      const midiNumber = (currentOctave + 1) * 12 + currentNoteIndex;
      const frequency = 440 * Math.pow(2, (midiNumber - 69) / 12);

      fretboard.push({
        stringIndex,
        fret,
        note: noteName,
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
