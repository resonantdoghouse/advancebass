export interface StrudelPreset {
  id: string;
  name: string;
  description: string;
  code: string;
  category: "Funk" | "Jazz" | "Electronic" | "Latin" | "Rock" | "World" | "Hip-Hop" | "Utility";
}

export const PRESETS: StrudelPreset[] = [
  {
    id: "teen-town",
    name: "Teen Town",
    description: "Alex Acuña's syncopated funk groove at the original 128 BPM. The kick's 'du-du' anticipation into beat 3 locks with Jaco's bass line.",
    category: "Funk",
    code: `// Jaco Pastorius' Teen Town - Alex Acuna's drum groove
// 128 BPM (original tempo)
setcps(0.533)

stack(
  // Constant driving 16th-note hi-hats - the engine of the groove
  s("hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh").gain(0.6),
  // Accented snare backbeat on beats 2 and 4
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(1.1),
  // Ghost notes on the "and" of each beat - the funky 16th-note texture
  s("~ ~ sd ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ sd ~").gain(0.3),
  // Kick: beat 1 then the signature "du-du" (a-of-2 into beat 3)
  // Bar 2: extra hit on a-of-3 mirrors Jaco's busier bass passages
  s("<bd ~ ~ ~ ~ ~ ~ bd bd ~ ~ ~ ~ ~ ~ ~> <bd ~ ~ ~ ~ ~ ~ bd bd ~ ~ bd ~ ~ ~ ~>").gain(1.2),
  // Open hi-hat on the "and" of beat 4 - subtle color accent
  s("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ oh ~").gain(0.65)
)
`
  },
  {
    id: "blues-shuffle",
    name: "Blues Shuffle",
    description: "Classic 12-bar Chicago blues shuffle perfect for practicing standard walking patterns.",
    category: "Jazz",
    code: `// Classic 12-Step Triplet Blues Shuffle
setcps(0.35)

stack(
  // The shuffle riding pattern
  s("rd ~ rd rd ~ rd rd ~ rd rd ~ rd").gain(0.9),
  // Clean cross-stick snapping the 2 and 4
  s("~ ~ ~ rim ~ ~ ~ ~ ~ rim ~ ~").gain(1.2),
  // Kick anchoring the 1 and 3
  s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").gain(1.1)
)
`
  },
  {
    id: "purdie-shuffle",
    name: "Half-Time Shuffle",
    description: "The legendary Purdie/Rosanna ghost-note shuffle groove.",
    category: "Rock",
    code: `// Legendary Ghost-Note Half-Time Shuffle (mapped over 12 triplet steps)
setcps(0.4)

stack(
  // The iconic hi-hat shuffle structure
  s("hh ~ hh hh ~ hh hh ~ hh hh ~ hh").gain(0.8),
  // The massive half-time backbeat snare on beat 3
  s("~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~").gain(1.3),
  // The intricate snare ghost notes filling the triplet pockets
  s("~ sd ~ ~ sd ~ ~ sd ~ ~ sd ~").gain(0.35),
  // Kick drum syncopating underneath
  s("bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~").gain(1.2)
)
`
  },
  {
    id: "4-on-the-floor",
    name: "4 On The Floor",
    description: "The classic house & techno foundation. Waiting for your synth bass.",
    category: "Electronic",
    code: `// Classic House Music groove
setcps(0.55)

stack(
  // Solid quarter note kick
  s("bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~").gain(1.2),
  // Essential offbeat open hi-hats
  s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(0.9),
  // Clap anchoring the 2 and 4
  s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~"),
  // Syncopated toms that enter every 4th cycle
  s("<~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~> <~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ mt ~ mt>").gain(0.6)
)
`
  },
  {
    id: "disco",
    name: "Disco",
    description: "Upbeat 70s groove with dynamic shaker and snare interaction.",
    category: "Electronic",
    code: `// Studio 54 Disco Style
setcps(0.6)

stack(
  // Driving 4 on the floor kick
  s("bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~").gain(1.1),
  // Constant 16th note closed hi-hat mimicking a shaker
  s("hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh").gain(0.5),
  // Dominant open hat on the 'and' of every beat
  s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(0.8),
  // Fat snare taking the entire 2 and 4
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(1.2)
)
`
  },
  {
    id: "drum-and-bass",
    name: "Drum & Bass (Jungle)",
    description: "Fast, chopped breakbeat style for modern rapid-fire playing.",
    category: "Electronic",
    code: `// Fast Jungle Breakbeat (16 steps)
setcps(0.85)

stack(
  // Deep syncopated kick
  s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~").gain(1.1),
  // Snare chopping the rhythm with a fast stutter
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ sd").gain(1.3),
  // Furious breakbeat hi-hats
  s("hh hh oh hh hh hh oh hh hh hh oh hh hh hh oh hh").gain(0.7)
)
`
  },
  {
    id: "boom-bap",
    name: "Hip Hop (Boom Bap)",
    description: "Gritty, heavily swung 90s hip-hop groove.",
    category: "Hip-Hop",
    code: `// Deeply Swung Boom-Bap Groove
setcps(0.4)

stack(
  // Fat, loose kick
  s("bd ~ ~ ~ ~ bd bd ~ ~ ~ bd ~ bd ~ ~ ~").gain(1.3),
  // Sharp backbeat snare
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(1.2),
  // Swung 8th-note hi-hats mapped explicitly across 16 steps
  s("<hh ~ hh ~ [hh hh] ~ hh ~ hh ~ hh ~ hh ~ [hh ~ hh] ~>").gain(0.9)
)
`
  },
  {
    id: "trap",
    name: "Modern Trap",
    description: "Sparse 808-style kicks and incredibly fast hi-hat rolls.",
    category: "Hip-Hop",
    code: `// Trap beat with mathematically fast hi-hat subdivisions
setcps(0.55)

stack(
  // Hard, sparse low-end kick framework
  s("bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~").gain(1.4),
  // Tight analog snare structure
  s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~").gain(1.2),
  // Rolling hi-hats utilizing Strudel's multiplier arrays for immense speed
  s("<hh*16 hh*24> hh hh <hh*32 hh> hh hh hh hh").gain(0.7)
)
`
  },
  {
    id: "jazz-swing",
    name: "Jazz Swing",
    description: "Authentic triplet-grid swing ride pattern with 2 & 4 hi-hat chicks. Ideal to practice your walking bass.",
    category: "Jazz",
    code: `// Authentic Jazz swing (mapped explicitly to a 12-step triplet grid)
setcps(0.35)

stack(
  // Ride cymbal standard jazz pattern: 1 & a 2 & a 3 & a 4 & a
  s("rd ~ ~ rd ~ rd rd ~ ~ rd ~ rd"),
  // Hi-hat pedal 'chick' exactly matching beats 2 and 4
  s("~ ~ ~ oh ~ ~ ~ ~ ~ oh ~ ~").gain(1.2),
  // Comping snare playing off-beat triplets randomly
  s("<~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~> <~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~>").gain(0.6)
)
`
  },
  {
    id: "bossa-nova",
    name: "Bossa Nova",
    description: "Authentic Brazilian syncopation with smooth hi-hats. Light surdo-style kick on beats 1 and 3.",
    category: "Latin",
    code: `// Smooth Bossa Nova (16 steps)
setcps(0.4)

stack(
  // 2-3 Bossa Clave on cross-stick / rim
  s("rim ~ ~ rim ~ ~ rim ~ ~ ~ rim ~ rim ~ ~ ~").gain(1.2),
  // Surdo-style kick: light hits on beats 1 and 3 only - bossa is NOT samba!
  s("bd ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~").gain(0.9),
  // Continuous smooth 8th-note hi-hat
  s("hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~").gain(0.7)
)
`
  },
  {
    id: "samba",
    name: "Samba",
    description: "Fast-paced Brazilian carnival rhythm.",
    category: "Latin",
    code: `// Energetic Carnival Samba
setcps(0.65)

stack(
  // Surdo bass drum emphasizing the upbeats heavily
  s("bd ~ bd ~ bd ~ bd ~ bd ~ bd ~ bd ~ bd ~").gain(1.1),
  // Rapid fire shaker via hi-hats
  s("hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh").gain(0.6),
  // Tamborim syncopated rim shots
  s("~ ~ rim ~ ~ rim ~ rim ~ ~ rim ~ ~ rim ~ rim").gain(1.3)
)
`
  },
  {
    id: "afro-cuban",
    name: "Afro-Cuban 6/8",
    description: "Traditional bell pattern in 6/8 time.",
    category: "Latin",
    code: `// Afro-Cuban 6/8 Bembe (mapped to a 12-step triplet grid)
setcps(0.6)

stack(
  // The iconic 6/8 cowbell/rim pattern
  s("rim ~ rim ~ rim rim ~ rim ~ rim ~ rim").gain(1.3),
  // Supporting heavy drum hits
  s("bd ~ ~ ~ bd ~ ~ ~ ~ bd ~ ~").gain(1.1),
  // Occasional conga response
  s("<~ ~ ~ ~ ~ ~ mt ~ lt ~ ~ ~> <~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~>")
)
`
  },
  {
    id: "salsa",
    name: "Salsa",
    description: "2-3 Son Clave basic salsa percussion structure.",
    category: "Latin",
    code: `// 2-3 Son Clave Salsa Percussion
setcps(0.35)

stack(
  // 2-3 Son Clave explicitly mapped out
  s("~ rim ~ rim ~ ~ ~ ~ rim ~ ~ rim ~ rim ~ ~").gain(1.3),
  // Classic Tumbao groove on Toms (Congas)
  s("~ ~ mt ~ ht ~ mt lt ~ ~ mt ~ ht ~ mt lt"),
  // Occasional Kick to anchor the downbeat
  s("<bd ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~> <~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~>")
)
`
  },
  {
    id: "reggae",
    name: "Reggae One Drop",
    description: "Classic one drop rhythm emphasizing beat 3.",
    category: "World",
    code: `// Authentic Reggae One-Drop
setcps(0.35)

stack(
  // The 'One Drop': Kick and Snare striking together only on beat 3
  s("~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~").gain(1.1),
  s("~ ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~").gain(1.1),
  // Constant 8th note hi-hat
  s("hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~").gain(0.8),
  // Occasional syncopated rim clicks
  s("<~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~> <~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~>")
)
`
  },
  {
    id: "african",
    name: "Afrobeat",
    description: "Complex polyrhythmic African drum cycles.",
    category: "World",
    code: `// Polyrhythmic Afrobeat (mapped over 16 steps)
setcps(0.45)

stack(
  // Syncopated rimshot/bell clave
  s("rim ~ ~ rim ~ ~ rim ~ ~ rim ~ rim ~ ~ rim ~").gain(1.2),
  // Driving off-beat kick 
  s("bd ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ ~ bd ~ ~"),
  // Snare alternating patterns
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ sd ~ <sd ~ sd ~> ~ ~ ~").gain(0.9)
)
`
  },
  {
    id: "funk",
    name: "Funk",
    description: "Heavy syncopation with tight drum pocket.",
    category: "Funk",
    code: `// Heavy Syncopated Funk Pocket
setcps(0.40)

stack(
  // Deep syncopated kick: 1, + of 2, e of 3, + of 4
  s("bd ~ ~ ~ ~ ~ bd ~ ~ bd ~ ~ ~ bd ~ ~").gain(1.1),
  // Main backbeat snare on beats 2 and 4
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(1.1),
  // Ghost notes (separate layer, quiet) on the "and" of each beat
  s("~ ~ sd ~ ~ ~ sd ~ ~ ~ sd ~ ~ ~ sd ~").gain(0.3),
  // Crisp 16th note hi-hat
  s("hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh").gain(0.7)
)
`
  },
  {
    id: "metal",
    name: "Metal",
    description: "Double kick drum driving blast beat.",
    category: "Rock",
    code: `// Intense Metal Blast Beat
setcps(0.7)

stack(
  // Relentless 16th note double kick drum
  s("bd bd bd bd bd bd bd bd bd bd bd bd bd bd bd bd"),
  // Blasting snare
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(1.2),
  // Ride cymbal bell matching the snare
  s("~ ~ ~ ~ rd ~ ~ ~ ~ ~ ~ ~ rd ~ ~ ~").gain(1.2),
  // Trashy crash cymbal accents
  s("cr ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(0.8)
)
`
  },
  {
    id: "rock-standard",
    name: "Standard Rock",
    description: "Straight 8th note rock groove with snare on 2 and 4.",
    category: "Rock",
    code: `// Standard Rock Backbeat
setcps(0.4)

stack(
  // Steady 8th note hi-hats
  s("hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~ hh ~").gain(0.9),
  // Heavy kick on 1 and 3 
  s("bd ~ ~ ~ ~ ~ bd ~ bd ~ ~ ~ ~ ~ ~ ~"),
  // Driving snare on 2 and 4
  s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~"),
  // Massive crash cymbal on the downbeat of every cycle
  s("cr ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(1.1)
)
`
  },
  {
    id: "metronome",
    name: "Metronome",
    description: "A pure, unadulterated click track for locking in your time.",
    category: "Utility",
    code: `// Simple 4/4 Quarter Note Metronome
setcps(0.4)

stack(
  // Dominant rimshot click exactly on the downbeat
  s("rim ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~").gain(1.4),
  // Secondary clicks explicitly on the remaining 3 quarter notes
  s("~ ~ ~ ~ hh ~ ~ ~ hh ~ ~ ~ hh ~ ~ ~").gain(1.1)
)
`
  }
];
