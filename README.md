# Advance Bass

**Professional Bass Transcriptions & Interactive Practice Tools**

Advance Bass is a modern web application for bass players of all levels. It combines studio-quality transcriptions with a suite of browser-based practice tools — no expensive standalone software required.

## Mission

Make professional bass education accessible to everyone. Free tools, no ads, no paywalls.

---

## Features

### Video Looper

Transform any YouTube video into a practice session:

- Load any YouTube video by ID or choose from a curated preset library
- A/B loop — set precise start and end points to drill difficult sections
- Speed control — slow down to 50% or up to 200% without pitch change
- Pitch shifting — tune the recording to match your instrument

### Practice Tools

A complete woodshed running in the browser. All tools are free and require no account.

| Tool | Description |
|---|---|
| **Tuner** | Chromatic tuner for 4, 5, and 6-string bass with strobe visualization and reference tones |
| **Metronome** | Adjustable BPM with accent controls, odd time signatures, and visual beat indicators |
| **Drum Machine** | Step sequencer for building drum patterns to practice against |
| **Scale Visualizer** | Interactive fretboard showing scales and modes across 4, 5, and 6-string basses |
| **Arpeggio Visualizer** | Color-coded chord tone map across the fretboard for any chord type and root |
| **Fretboard Trainer** | Gamified note-finding — race against the clock to memorize the fretboard |
| **Ear Training** | Identify intervals and chord qualities by ear; timed game for all levels |
| **Circle of Fifths** | Visual guide to key signatures, relative minors, and scale relationships |
| **Strudel Generator** | Live-code beats, loops, and polyrhythms in the browser using Strudel JS |

### Transcriptions

- Studio-quality bass transcriptions — tabs and notation, meticulously verified
- Markdown-based content with image viewer for multi-page scores

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI / shadcn/ui
- **Icons**: Lucide React
- **Audio/Video**: Web Audio API, React Player

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Open Graph Images

Branded 1200×630 social preview images are generated dynamically using [`next/og`](https://nextjs.org/docs/app/api-reference/file-conventions/opengraph-image). Each image uses the same dark-background, gold-accent design with a sine-wave decoration.

| Route | OG Image URL | Notes |
|---|---|---|
| `/` (home) | `/opengraph-image` | Static default |
| `/tools` and all `/tools/*` | `/tools/opengraph-image` | Cascades to all tool sub-routes |
| `/transcriptions/[slug]` | `/transcriptions/[slug]/opengraph-image` | Dynamic — renders article title and tags |

**Testing locally**

```bash
open http://localhost:3000/opengraph-image
open http://localhost:3000/tools/opengraph-image
open http://localhost:3000/transcriptions/get-lucky-bass-cover-tabs/opengraph-image
```

**Validating social previews**

- [opengraph.xyz](https://www.opengraph.xyz)
- [Twitter/X Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

**Source files**

| File | Purpose |
|---|---|
| `src/lib/og-image.tsx` | Shared `OgCard` layout (brand, sine wave, typography) |
| `src/app/opengraph-image.tsx` | Default OG image (edge runtime) |
| `src/app/tools/opengraph-image.tsx` | Tools OG image (edge runtime) |
| `src/app/[category]/[slug]/opengraph-image.tsx` | Dynamic transcription OG image (nodejs runtime) |

---

## Theme

Supports light and dark mode, adapting to system preferences.

---

_Built for bass players, by bass players._
