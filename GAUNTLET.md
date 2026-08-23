# AdvanceBass Gauntlet — Opportunity Analysis Backlog

> Note on stack: the loop brief describes the stack as "Next.js App Router · TypeScript ·
> Postgres/Drizzle · Better Auth · shadcn/Tailwind." Verified against `package.json` and the
> repo tree (2026-08-21): there is **no** Postgres, Drizzle, or Better Auth in this codebase.
> Actual stack is Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind/shadcn-style UI,
> static markdown content (`content/transcriptions/*.md` via gray-matter/remark), EmailJS for
> the contact form, and a single `/api/subscribe` route (Buttondown). No database, no auth.
> All findings below are grounded in the actual code.

## Shipped
- **#3 Transcription page images were unoptimized (raw PNG/JPG, no WebP)** — fixed 2026-08-23,
  via the *asset-conversion* path rather than swapping `<img>` for `next/image` (which was ruled
  out — `TranscriptionImageViewer`'s pan/zoom/crop/sharpen logic reads `naturalWidth`/canvas pixel
  data directly off the `<img>` element, and swapping to `next/image` risked destabilizing all of
  that for a live, well-tested interactive component). Instead: wrote a one-off Node script
  (using `sharp`, already present as a transitive `next` dependency) that converts all 27 source
  images in `public/images/transcriptions/` to WebP, trying both lossy (q82) and lossless
  encoding per file and keeping whichever is smaller — 3 of the 27 (flat-color notation graphics)
  compress *better* lossless than lossy. Result: 4.1MB → 1.4MB (66% smaller), every single file
  shrank. Updated all `image:` frontmatter fields and inline `<img src>` references across all 9
  `content/transcriptions/*.md` files to the new `.webp` paths, then deleted the now-unreferenced
  original PNG/JPG files (confirmed zero remaining references first). No component code touched.
  Verified live: page navigation, zoom, the sharpen/dark-mode filters, and — most importantly —
  the crop-and-export flow (canvas `drawImage` from a WebP-backed `<img>`) all work with no
  console errors; listing-page thumbnails (`next/image`) render correctly including the 3
  lossless-encoded files.
- **#8 Transcription image alt text was filename-derived** — fixed 2026-08-23. Rewrote alt text
  for all 27 `<img>` tags across `content/transcriptions/*.md` to describe song, arrangement type,
  and page number (e.g. `"Game of Thrones main theme — 4-string bass tab and notation, page 1"`)
  instead of raw filenames like `"Aerodynamic_1"`.
- **#12 `/api/subscribe` had no rate limiting** — fixed 2026-08-23. Added an in-memory sliding-
  window rate limiter (5 requests / 10 min per IP, with opportunistic cleanup of stale entries) to
  `src/app/api/subscribe/route.ts`. Tested live: requests 1–5 pass through to the (locally
  unconfigured) Buttondown call, request 6+ gets `429`. Caveat noted in-code: this doesn't
  coordinate across serverless instances, so it's a speed bump against a single abusive client,
  not a hard global cap — fine for current traffic levels.
- **#18 Transcription tags were inert (not links/filters)** — fixed 2026-08-23. Added
  `src/components/content/TranscriptionsGrid.tsx` (client component) with URL-synced tag chips
  (`?tag=X`) driving a client-side filter over the category's articles; wrapped in `<Suspense>` in
  `src/app/[category]/page.tsx` so the route stays statically generated. Tags on the article
  detail page's "Related Tags" section now link to `/transcriptions?tag=X`. Along the way, split
  `Article`/`getArticleUrl`/`getCategorySlug`/`getCategoryFromSlug` out of `src/lib/data.ts` into
  a new `src/lib/article-meta.ts` (no `fs`/`gray-matter`/`remark` imports) — needed so importing
  them into client components doesn't drag Node-only modules into the browser bundle; `data.ts`
  re-exports them for backward compatibility. Verified live: filtering by "Daft Punk" and by
  clicking a tag from an article page both work and update the URL correctly; build still shows
  all transcription routes as `●` (SSG).
- **#1 Transcription article + category pages are fully dynamic** — fixed 2026-08-21. Added
  `generateStaticParams` to `src/app/[category]/page.tsx` and `src/app/[category]/[slug]/page.tsx`.
  Build now shows both as `●` (SSG) instead of `ƒ` (dynamic).
- **#2 OG image routes pinned to deprecated Edge runtime** — fixed 2026-08-21. Removed
  `export const runtime = "edge"` from `src/app/opengraph-image.tsx` and
  `src/app/tools/opengraph-image.tsx`. Build shows both as `○` (static), Edge deprecation warning
  gone. Also corrected the stale "10 free tools" copy in `tools/opengraph-image.tsx` to 12 while
  in the file.
- **#4 GA loaded via generic `<Script>` instead of `@next/third-parties`** — fixed 2026-08-21.
  Installed `@next/third-parties`, replaced the two manual `next/script` tags in
  `src/app/layout.tsx` with `<GoogleAnalytics gaId="..." />`. Installing it also pulled `next` up
  to `16.3.2`, which happens to resolve most of Security finding #11 (see below) — `npm audit`
  dropped from 6 to 2 high-severity findings (`js-yaml`, `undici`), both transitive via `next`'s
  own deps with no fix yet available in `next`'s current line.
- **#11 `next` outdated with disclosed CVEs** — resolved as a side effect of the above. `next` is
  now `16.3.2` (was `16.3.1`). Remaining 2 `npm audit` findings (`js-yaml`, `undici`) are
  transitive and don't yet have an upstream fix.
- **#5 All 9 transcription articles had empty meta descriptions** — fixed 2026-08-21. Wrote a real
  `excerpt` for all 9 files in `content/transcriptions/*.md` (grounded in each article's title/
  tags/existing body text, no fabricated claims). Also added `deriveExcerpt()` in
  `src/lib/data.ts` — falls back to the first `<p>` of article content when frontmatter `excerpt`
  is blank, so this can't silently regress on a future post. Verified in the built HTML: the
  Aerodynamic page's `<meta name="description">` now carries real text.
- **#6 Sitemap omitted 5 of 13 tool pages** — fixed 2026-08-21. Added `/tools/fretboard-lab`,
  `/tools/fretboard-trainer`, `/tools/practice-routine`, `/tools/string-tension-calculator`,
  `/tools/strudel-generator` to `src/app/sitemap.ts`.
- **#9 Icon-only controls relied on `title` instead of `aria-label`** — fixed 2026-08-21. Added a
  matching `aria-label` to all 11 icon-only buttons in
  `src/components/content/TranscriptionImageViewer.tsx`. (`VideoLooper.tsx`'s smaller gap
  mentioned in the original finding is still open — not touched.)
- **#10 No skip-to-main-content link** — fixed 2026-08-21. Added a visually-hidden-until-focused
  skip link as the first element after `<JsonLd>` in `src/app/layout.tsx`, pointing to a new
  `id="main-content"` on the `<main>` element.
- **#7 No `alternates.canonical` on tool or article pages** — fixed 2026-08-21. Added
  `alternates: { canonical: path }` to all 12 tool pages' `metadata` and to the transcription
  article page's `generateMetadata` (`src/app/[category]/[slug]/page.tsx`).
- **#14 Homepage hero tuner mockup was internally inconsistent** — fixed 2026-08-21. Changed the
  highlighted string in `src/app/page.tsx` from `D` to `A` to match the displayed `A⁴ / 440.0 Hz`
  reading. Verified live via screenshot in both themes.
- **#15 Homepage tool count label was stale ("11 TOOLS")** — fixed 2026-08-21. Updated to
  "12 TOOLS" in `src/app/page.tsx`. Note: still a hand-typed string, not derived from the tools
  array — the drift-proofing recommendation from the original finding is still open if this
  matters enough to revisit (it's drifted twice now per prior UX audit memory).
- **#17 "Fretboard Lab" duplicated three tools with no visual relationship shown** — fixed
  2026-08-21 via option (b) from the finding: added a short cross-link clause ("Also in Fretboard
  Lab...") to the Scale Visualizer, Arpeggio Visualizer, and Circle of Fifths card descriptions in
  both `src/app/tools/ToolsGallery.tsx` and the homepage's separate `FEATURED_TOOLS` array in
  `src/app/page.tsx`. Verified live — card heights adapt fine to the extra sentence.
- **#20 Zero tool pages linked toward `/bass-lessons`** — fixed 2026-08-21. Added the same
  low-key CTA card pattern used on transcription pages to the shared `src/app/tools/layout.tsx`,
  so it appears once below every tool's content, above `ToolsDock`. Verified live on
  `/tools/metronome` and `/tools/video-looper` (different container widths) — renders cleanly on
  both.

## Backlog (ranked)

### 13. CSP `script-src` includes `'unsafe-inline'`, undermining most of its XSS value
- **Problem:** `next.config.ts` sets `script-src 'self' 'unsafe-inline' ...`. `'unsafe-inline'`
  permits any inline `<script>` to execute, which is exactly the vector CSP exists to block.
- **Attempted 2026-08-23, reverted:** Implemented the standard Next.js nonce-in-middleware
  pattern (`src/middleware.ts` generating a per-request nonce, `headers()` read in
  `RootLayout`/`JsonLd` to apply it). It worked functionally, but `headers()` is a dynamic API —
  calling it in the root layout forces **every single page in the app** out of static rendering.
  `npm run build` showed all routes flip from `○`/`●` back to `ƒ`, including the transcription
  pages fixed in finding #1 and every tool page. That's a much bigger regression than the CSP
  gain is worth, so it was reverted in full (middleware.ts deleted, layout.tsx/JsonLd.tsx back to
  prior state — verified via `git diff` showing only the unrelated prior-session changes remain).
- **Recommendation:** This is a real Next.js App Router constraint, not a mistake to fix — a
  nonce-based CSP and full static generation are fundamentally in tension when the nonce is read
  in a layout that wraps every route. Real options if this is revisited: (a) accept unsafe-inline
  as-is (current state, low actual risk here since the only inline scripts are two static,
  developer-authored ones — GA bootstrap and JSON-LD — not user-input-influenced), (b) scope the
  nonce/dynamic rendering to only the specific routes that need it via route-level opt-in rather
  than the root layout, or (c) pre-compute a fixed hash-based CSP (`'sha256-...'`) for the two
  known static inline scripts instead of a per-request nonce, which doesn't force dynamic
  rendering.
- **Re-assessed 2026-08-23, option (c) also ruled out:** the GA bootstrap script's content is
  fixed and hashable, but `JsonLd` is used at 17 call sites, each rendering *different* JSON
  (article title/date/tags, tool name/description, etc.) — hash-based CSP would need one
  `'sha256-...'` entry per unique payload, computed and baked into `next.config.ts` before that
  content is generated. That's real build tooling, not a config tweak, and not worth building for
  this site's actual risk profile (all inline scripts are developer-authored, never user input).
  **Decision: staying on `'unsafe-inline'`.** Closing this out as accepted risk rather than
  leaving it as an open TODO that keeps getting re-attempted.
- **Impact:** 3 · **Effort:** 3 (revised up — effort estimate didn't account for the static-
  rendering conflict, and option (c) turned out to need per-payload hashing, not a single hash)

### 16. Border-radius values bypass the design-token scale almost everywhere
- **Problem:** `globals.css` defines a proper radius token scale (`--radius: 0.625rem` →
  `rounded-lg`/`rounded-md`/`rounded-sm`), but 18 files in `src` use one-off arbitrary Tailwind
  values (`rounded-[6px]`, `rounded-[8px]`, `rounded-[11px]`, `rounded-[12px]`, `rounded-[16px]`,
  `rounded-[18px]`, `rounded-[22px]`, ...) instead of the tokens — `src/app/page.tsx` alone uses
  six different arbitrary radii in one file. None of these values line up with the token scale
  (`--radius-lg` = 10px, `-md` = 8px, `-sm` = 6px), so corner rounding is inconsistent across
  cards/buttons/panels with no single source of truth to adjust it from.
- **Evidence:** `grep -rl "rounded-\[" src` → 18 files; `src/app/page.tsx:137,156,194,225,228,311`
  span 6 distinct arbitrary radii in a single file.
- **Recommendation:** Not urgent to fix wholesale, but new components should default to the
  `rounded-lg`/`-md`/`-sm` tokens, and a follow-up pass could normalize the worst offenders
  (homepage, which has the most) onto the token scale for a tighter, more consistent feel.
- **Re-assessed 2026-08-23:** checked how many of `page.tsx`'s arbitrary values actually match a
  token exactly — only 2 of 6 (`rounded-[8px]`→`-md`, `rounded-[6px]`→`-sm`) are true 1:1 swaps;
  the rest (11px, 12px, 18px, 22px) don't correspond to any token and would need either a new
  token added to the scale or a genuine visual-design call about which radius each element should
  actually use — not a mechanical cleanup. Swapping only the 2 exact matches wouldn't meaningfully
  address the systemic pattern this finding describes (dozens of occurrences across 19 files), so
  it's not worth doing as a fractional fix. Leaving this open — it needs a real design pass
  (bring these under `frontend-design`/`artifact-design`-style judgment on the token scale itself)
  rather than a scripted find-replace.
- **Impact:** 1 · **Effort:** 3

### 19. Newsletter signup is still silently non-functional in production
- **Category:** Conversion & monetization
- **Problem:** `BUTTONDOWN_API_KEY` is empty in both `.env` and `.env.local`
  (`BUTTONDOWN_API_KEY=`), which means every submission to the footer `NewsletterSignup` (present
  on every page of the site) hits `src/app/api/subscribe/route.ts:9-12`'s early return and shows
  the visitor "Subscriptions are not configured." Building a real email list is an explicit
  near-term business priority, and the only capture mechanism on the entire site is currently
  broken for every visitor who tries it, silently, with no alerting.
- **Evidence:** `.env` / `.env.local` line 4: `BUTTONDOWN_API_KEY=` (empty);
  `src/app/api/subscribe/route.ts:9-12`. (Whether the *deployed* Vercel env var is also empty
  can't be confirmed from the repo — but local config gives no reason to believe it's been set.)
- **Recommendation:** Get a real Buttondown API key into the production environment variables.
  This is pure config, not code — the implementation is already correct and was verified
  end-to-end with a fake key. Highest-leverage single item in this whole audit: it's a list-
  building strategy with the pipe currently capped off.
- **Impact:** 5 · **Effort:** 1

### 21. No student testimonials/reviews anywhere on the lessons or homepage
- **Problem:** Credibility on `/bass-lessons` and `/` rests entirely on Jim's own credentials
  (McGill, "millions of views," touring experience) — there's no third-party voice (student
  testimonial, review, or even a single quote) anywhere near the booking CTA. For a service
  that's fully inquiry-gated (no visible pricing), removing purchase-decision friction with
  social proof from actual students matters more, not less, since the visitor has to commit to
  an inquiry before seeing any concrete terms.
- **Evidence:** `grep -in "testimonial|review" src/app/bass-lessons/page.tsx src/app/page.tsx` →
  no matches on either page.
- **Competitor reference:** Scott's Bass Lessons and TalkingBass both foreground student
  testimonials/success stories directly above or beside their enrollment CTAs.
- **Recommendation:** Add 2-3 short student quotes (even informal ones — a screenshot-style quote
  card) near the `InquiryForm` on `/bass-lessons`. Low effort if quotes already exist from past
  students; otherwise low-cost to solicit a few from recent students.
- **Impact:** 2 · **Effort:** 2

## Completed passes
- 2026-08-21 — Performance
- 2026-08-21 — SEO
- 2026-08-21 — Accessibility
- 2026-08-21 — Security
- 2026-08-21 — Design
- 2026-08-21 — UX/UI
- 2026-08-21 — Conversion & monetization

## Competitor notes
- StudyBass (studybass.com): serves images from a dedicated CDN host
  (`cdn.studybass.net`); uses SVG for logo/iconography. Could not confirm srcset/lazy-loading
  specifics from a single fetch, but the CDN separation itself is the notable practice —
  AdvanceBass serves all transcription images directly from `/public` with no CDN/transform layer.
