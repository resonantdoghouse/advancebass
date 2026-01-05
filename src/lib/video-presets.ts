
export interface BassistProfile {
  name: string;
  bio: string;
  style: string[];
  wikiUrl?: string;
}

export interface VideoPreset {
  id: string;
  title: string;
  artist: string;
  bassist: string;
  genre: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  tags?: string[];
}

export const BASSISTS: Record<string, BassistProfile> = {
  "Jaco Pastorius": {
    name: "Jaco Pastorius",
    bio: "The world's greatest bass player. Known for his fretless mastery, melodic solos, and complex 16th-note grooves.",
    style: ["Jazz Fusion", "Funk", "Fretless"],
  },
  "James Jamerson": {
    name: "James Jamerson",
    bio: "The uncredited genius behind the Motown sound. His syncopated, melodic lines redefined the role of the bass in pop music.",
    style: ["Motown", "R&B", "Soul"],
  },
  "Louis Johnson": {
    name: "Louis Johnson",
    bio: "Thunder Thumbs! One of the pioneers of slap bass, known for his aggressive thumb technique and funky lines.",
    style: ["Funk", "Slap", "Disco"],
  },
  "Flea": {
    name: "Flea",
    bio: "Bassist for Red Hot Chili Peppers. Blends punk aggression with funk slap bass and melodic sensitivity.",
    style: ["Funk Rock", "Alternative", "Slap"],
  },
  "Larry Graham": {
    name: "Larry Graham",
    bio: "The father of slap bass. Invented the 'thumpin' and pluckin'' technique while playing with Sly and the Family Stone.",
    style: ["Funk", "Soul", "Slap Originator"],
  },
  "Les Claypool": {
    name: "Les Claypool",
    bio: "Leader of Primus. Known for his eccentric, percussive style, flamenco-like strumming, and tapping.",
    style: ["Alternative Metal", "Funk Metal", "Experimental"],
  },
  "Geddy Lee": {
    name: "Geddy Lee",
    bio: "Frontman of Rush. Famous for his complex, driving bass lines, often playing keyboards and singing simultaneously.",
    style: ["Prog Rock", "Hard Rock"],
  },
  "Chris Wolstenholme": {
    name: "Chris Wolstenholme",
    bio: "Bassist for Muse. Known for his heavy, distorted synth-like bass tones and driving rock lines.",
    style: ["Alternative Rock", "Electronic Rock"],
  },
  "Bob Babbitt": {
    name: "Bob Babbitt",
    bio: "Legendary session bassist, member of the Funk Brothers. Known for his deep groove and pocket.",
    style: ["Motown", "R&B"],
  },
  "Hadrien Feraud": {
    name: "Hadrien Feraud",
    bio: "Modern fusion virtuoso. Known for his blistering speed, complex harmony, and influence from Jaco.",
    style: ["Jazz Fusion", "Modern Jazz"],
  },
  "Richard Bona": {
    name: "Richard Bona",
    bio: "Cameroonian jazz bassist and singer. Known for his smooth, vocal-like bass tone and incredible technique.",
    style: ["World Fusion", "Jazz"],
  },
  "Oteil Burbridge": {
    name: "Oteil Burbridge",
    bio: "Grammy-winning bassist known for his work with Aquarium Rescue Unit and Allman Brothers Band. Master of chordal bass and scat-singing solos.",
    style: ["Jazz Fusion", "Jam Band", "Rock"],
  },
  "John Patitucci": {
    name: "John Patitucci",
    bio: "Jazz virtuoso who plays both electric and upright bass. Known for his work with Chick Corea and his melodic 6-string playing.",
    style: ["Jazz", "Fusion", "Latin Jazz"],
  },
  "Thundercat": {
    name: "Thundercat",
    bio: "Stephen Lee Bruner. A virtuoso bassist/singer merging jazz fusion, R&B, and funk. Known for his complex 6-string chordal work and falsetto vocals.",
    style: ["Acid Jazz", "Funk", "R&B"],
  },
  "Charles Berthoud": {
    name: "Charles Berthoud",
    bio: "Modern YouTube bass phenomenon. Known for his incredible tapping technique and orchestral arrangements on bass.",
    style: ["Tap Bass", "Solo Bass", "Virtuoso"],
  },
};

export const VIDEO_PRESETS: VideoPreset[] = [
  // Jaco
  {
    id: "a3113eNj4IA",
    title: "Teen Town",
    artist: "Weather Report",
    bassist: "Jaco Pastorius",
    genre: ["Jazz Fusion"],
    difficulty: "Expert",
  },
  {
    id: "sMQUFvv0WRY",
    title: "Havona",
    artist: "Weather Report",
    bassist: "Jaco Pastorius",
    genre: ["Jazz Fusion"],
    difficulty: "Expert",
  },
  {
    id: "-0NNA6w8Zk4",
    title: "Donna Lee",
    artist: "Jaco Pastorius",
    bassist: "Jaco Pastorius",
    genre: ["Jazz"],
    difficulty: "Expert",
  },
  // Jamerson
  {
    id: "QLDqlgRK100",
    title: "Bernadette",
    artist: "The Four Tops",
    bassist: "James Jamerson",
    genre: ["Motown", "Soul"],
    difficulty: "Advanced",
  },
  {
    id: "jEpiyY1RpRI",
    title: "What's Going On",
    artist: "Marvin Gaye",
    bassist: "James Jamerson",
    genre: ["Motown", "Soul"],
    difficulty: "Intermediate",
  },
  {
    id: "kAT3aVj-A_E",
    title: "Ain't No Mountain High Enough",
    artist: "Marvin Gaye & Tammi Terrell",
    bassist: "James Jamerson",
    genre: ["Motown", "Soul"],
    difficulty: "Intermediate",
  },
  // Louis Johnson
  {
    id: "Zi_XLOBDo_Y",
    title: "Billie Jean",
    artist: "Michael Jackson",
    bassist: "Louis Johnson",
    genre: ["Pop", "Funk"],
    difficulty: "Intermediate",
  },
  {
    id: "B1Jzu3nl89Q",
    title: "Slap Bass Solo",
    artist: "Louis Johnson",
    bassist: "Louis Johnson",
    genre: ["Funk"],
    difficulty: "Advanced",
  },
  {
    id: "tPBDMihPRJA",
    title: "Stomp!",
    artist: "The Brothers Johnson",
    bassist: "Louis Johnson",
    genre: ["Disco", "Funk"],
    difficulty: "Intermediate",
  },
  // Larry Graham
  {
    id: "uMxkRT7bJ0w",
    title: "Killer Slap Bass",
    artist: "Larry Graham",
    bassist: "Larry Graham",
    genre: ["Funk"],
    difficulty: "Advanced",
  },
  {
    id: "_lIbvj2EBqM",
    title: "Ides of March",
    artist: "Charles Berthoud",
    bassist: "Charles Berthoud",
    genre: ["Solo Bass"],
    difficulty: "Expert",
  },
  // RHCP
  {
    id: "GLvohMXgcBo",
    title: "Under The Bridge",
    artist: "Red Hot Chili Peppers",
    bassist: "Flea",
    genre: ["Alternative Rock"],
    difficulty: "Intermediate",
  },
  {
    id: "Mr_uHJPUlO8",
    title: "Give It Away",
    artist: "Red Hot Chili Peppers",
    bassist: "Flea",
    genre: ["Funk Rock"],
    difficulty: "Intermediate",
  },
  // Others
  {
    id: "ftVTWDrtrlc",
    title: "YYZ",
    artist: "Rush",
    bassist: "Geddy Lee",
    genre: ["Prog Rock"],
    difficulty: "Expert",
  },
  {
    id: "953PkxFNiko",
    title: "My Name Is Mud",
    artist: "Primus",
    bassist: "Les Claypool",
    genre: ["Funk Metal"],
    difficulty: "Advanced",
  },
  {
    id: "3dm_5qWWDV8",
    title: "Hysteria",
    artist: "Muse",
    bassist: "Chris Wolstenholme",
    genre: ["Rock"],
    difficulty: "Intermediate",
  },
  {
    id: "57Ykv1D0qEE",
    title: "Inner City Blues",
    artist: "Marvin Gaye",
    bassist: "Bob Babbitt",
    genre: ["Soul"],
    difficulty: "Intermediate",
  },
  {
    id: "7fX92BSNiYw",
    title: "Bubbatron (Live)",
    artist: "Hadrien Feraud",
    bassist: "Hadrien Feraud",
    genre: ["Jazz Fusion"],
    difficulty: "Expert",
  },
  {
    id: "6PnYOZyRL74",
    title: "Amazing Bass Solo",
    artist: "Richard Bona",
    bassist: "Richard Bona",
    genre: ["Jazz", "World"],
    difficulty: "Advanced",
  },
  {
    id: "cKPXX08Q-HI",
    title: "Aquarium Rescue Unit (Live 1996)",
    artist: "Oteil Burbridge",
    bassist: "Oteil Burbridge",
    genre: ["Jam Band", "Fusion"],
    difficulty: "Advanced",
  },
  {
    id: "t-OGrVp9PGk",
    title: "Them Changes",
    artist: "Thundercat",
    bassist: "Thundercat",
    genre: ["Funk", "R&B"],
    difficulty: "Advanced",
  },
];
