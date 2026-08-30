# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

There is no test suite. Verify changes by running the dev server and exercising the feature in the browser.

## Architecture

**Next.js 16 App Router** site for bass players — interactive practice tools + markdown-based transcriptions.

### Routing & pages

- `/` — Home
- `/tools` — Tools gallery; each tool lives at `/tools/[tool-name]`
- `/transcriptions/[slug]` — Individual transcription articles
- `/[category]/[slug]` — Generic dynamic route (currently only `transcriptions` category is active)
- Static pages: `/bass-lessons`, `/bassist-for-hire`, `/contact`, `/recording`

### Tool component pattern

Each interactive tool follows this pattern:

```
src/app/tools/[tool-name]/page.tsx          ← server component, metadata export
src/components/tools/ToolName.tsx           ← client component with "use client"
src/hooks/useToolName.ts                    ← all state and audio logic
```

Some tools split into sub-components under `src/components/tools/[tool-name]/`.

### Audio hooks

All Web Audio API work lives in hooks:

- `useBassSynth` — synth tones for ear training / arpeggio / scale tools
- `useDrumSynth` — sample-based drum playback for the drum machine
- `useMetronome` — precise BPM scheduling via `AudioContext`
- `useTuner` — microphone pitch detection

### Keyboard shortcuts

`useToolKeyboard(shortcuts, enabled?)` in `src/hooks/useToolKeyboard.ts` is the single shared shortcut system. It matches `e.code` first, then `e.key` as fallback, and silently skips when focus is inside an input. Every tool that has keyboard shortcuts uses this hook and renders a `<KeyboardHints>` component.

### Content (transcriptions)

Markdown files in `content/transcriptions/*.md` with gray-matter frontmatter (`title`, `date`, `author`, `tags`, `category`, `excerpt`, `image`, `pages`). Processed server-side by `src/lib/data.ts` using `remark` + `remark-html`. No CMS — add a new `.md` file to publish a new transcription.

### UI primitives

`src/components/ui/` contains shadcn/ui-style wrappers around Radix UI primitives (Button, Card, Dialog, Slider, etc.). Extend by adding new files here; don't reach into Radix directly from tool components.

### Music theory data

`src/lib/music-theory.ts` exports `NOTES`, `SCALES`, `CHORDS`, and related constants used by the visualizer, arpeggio, and ear training tools. `src/data/drum-patterns.ts` holds named drum patterns for the drum machine.

### OG images

Generated with `next/og`. Most use the edge runtime; the dynamic transcription OG image (`/[category]/[slug]/opengraph-image.tsx`) uses the nodejs runtime. Shared layout lives in `src/lib/og-image.tsx`.

### CSP & security headers

`next.config.ts` sets a strict Content-Security-Policy and other security headers. When adding new external scripts, fonts, or media sources, update the relevant directive in `next.config.ts`.

### Theme

`next-themes` with `defaultTheme="system"`. The `<GlobalThemeProvider>` wraps the entire app in `src/app/layout.tsx`. Use Tailwind's `dark:` variant for dark mode styles.

### Contact form

Handled client-side via EmailJS (`@emailjs/browser`). No server action or API route is involved.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
