# Chinese School — Design Spec & Plan

A fully static, frontend-only TypeScript web app for studying Chinese with HSK 3.0
vocabulary. Installable on mobile as a PWA. Browse words as a table or as flashcards,
mark words memorized, and generate customizable test sessions with spaced-repetition
tracking and right/wrong/skip grading.

---

## 1. Goals & Non-Goals

### Goals
- Study HSK 3.0 vocabulary (levels 1–9) by seeing the **Chinese character** and
  recalling the **pinyin** and **English meaning**.
- **Browse all words** in a **tabular list view**, filterable by level (levels 1–7
  each have their own filtered list).
- **Browse all words as flashcards** — same filtering, one row = one card, flip to
  reveal pinyin + meaning.
- **Mark words as memorized** ("check" a word) from either browse view, independent
  of SRS scheduling — a simple manual label/filter.
- Flashcards with **spaced-repetition scheduling (SRS)** so review sessions are timed
  optimally, independent of the manual memorized flag.
- Build a **customizable test session**: pick any combination of levels (1–7), a size
  up to 100 cards, and optionally restrict to **un-memorized words within the selected
  levels**, then grade each card **Right / Wrong / Skip**.
- Track **performance over time** (per-word and aggregate stats), Anki/Quizlet style.
- Responsive UI that works well on **desktop and phone**.
- **Installable PWA** with offline support (add-to-home-screen, works with no network).
- **Efficient word list retrieval** — never load or render more data than the current
  view needs.

### Non-Goals (v1)
- No backend, no database, no accounts. All state is local to the browser.
- No cross-device sync (may add manual JSON export/import later — see §11).
- No audio/TTS in v1.
- No handwriting recognition or character-by-character stroke practice.
- No HSK 2.0 study flows (data supports it, but UI targets HSK 3.0 / `new-*` levels).

---

## 2. Tech Stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Language       | TypeScript (strict mode)                           |
| Framework      | React 18                                           |
| Build tool     | Vite                                               |
| Styling        | CSS Modules (`*.module.css`) + a few CSS variables |
| Routing        | `react-router-dom` (`HashRouter` — see §12)        |
| State          | React state/context + a thin persistence layer     |
| Persistence    | `localStorage` (see §7)                            |
| PWA            | `vite-plugin-pwa` (Workbox service worker)         |
| List rendering | `@tanstack/react-virtual` (virtualized table/list) |
| Testing        | Vitest + React Testing Library                     |
| Lint/format    | ESLint + Prettier                                  |

No runtime dependency on a server. `npm run build` produces a static `dist/` that can
be hosted on any static host (GitHub Pages, Netlify, Vercel static, etc.).

### 2a. Visual Design Language

Clean, modern, simplistic, easy to read. Concretely:

- **Typography-first, minimal chrome.** Generous whitespace, no heavy borders/shadows,
  no decorative gradients. The Chinese character is always the visual focal point on
  any card — large, high-contrast, plenty of room around it.
- **Restrained color palette.** A neutral base (white/near-white background, dark
  gray text — no pure black) plus one accent color for primary actions/links, and
  semantic colors used sparingly and consistently: green = right/memorized,
  red = wrong, gray = skip/neutral. No rainbow of colors per screen.
- **Plain, legible type.** A single system/sans-serif font stack for UI text, and a
  font with solid CJK glyph coverage for Chinese characters (e.g. system CJK fonts —
  no decorative or handwriting-style fonts). Clear size hierarchy: big for the
  character, medium for pinyin, smaller for meanings/metadata.
- **Icons and symbols over emoji.** Use a small consistent icon set (e.g. a single
  lightweight icon library, or simple SVGs) for actions like check/memorized,
  right/wrong, navigation. Avoid emoji in UI copy and components — okay only if the
  user explicitly opts into something playful later. (Note: the ✓/✗ marks used
  earlier in this plan for readability are shorthand for "check/cross icon," not a
  literal emoji requirement.)
- **Consistent, simple components.** Flat buttons/cards with subtle hover/active
  states, one card style reused across List rows, Flashcards, and Lesson cards
  rather than bespoke looks per screen. A single `Toggle` switch component (not
  native checkboxes) is used everywhere a boolean setting is exposed.
- **Motion with restraint.** A 3D flip for flashcards, a directional slide when
  moving between cards, subtle hover-lift on clickable rows/cards, and a brief
  fade-in on route change — all short (~0.2–0.5s) and never blocking interaction.
- **Dark mode** follows the same restrained-palette rule (inverted neutrals, same
  single accent). Implemented as a `system` / `light` / `dark` setting (Settings
  page), defaulting to the OS preference but overridable at any time.
- **Responsive chrome, not just responsive content.** Mobile gets a top header +
  sticky bottom tab bar; desktop (≥768px) replaces both with a persistent left
  sidebar, rather than stretching the mobile nav to fill a wide screen.

---

## 3. Data

### Source
`data/complete.json` — 11,470 total entries (HSK 2.0 + 3.0 combined). Schema is in
`data/schema.md`. Relevant fields per entry:

```jsonc
{
  "simplified": "爱好",
  "radical": "爫",
  "level": ["new-1", "old-3"],   // we care about "new-1".."new-7"
  "frequency": 4902,             // lower = more common
  "pos": ["n", "v"],
  "forms": [{
    "traditional": "愛好",
    "transcriptions": { "pinyin": "ài hào", /* ...others */ },
    "meanings": ["to like; to be fond of ...", "interest; hobby"],
    "classifiers": ["个"]
  }]
}
```

HSK 3.0 subset (entries with any `new-*` level): **10,969 words**.

| Level | `new-*` tag | Words |
| ----- | ----------- | ----- |
| 1     | new-1       | 506   |
| 2     | new-2       | 750   |
| 3     | new-3       | 953   |
| 4     | new-4       | 972   |
| 5     | new-5       | 1059  |
| 6     | new-6       | 1123  |
| 7–9   | new-7       | 5606  |

> Note: a word can carry multiple `new-*` tags is rare; treat `level` as a set. For
> filtering, a word belongs to level N if `"new-N"` ∈ `level`.

### Build-time preprocessing (important for bundle size & runtime speed)
`complete.json` is ~9.8 MB — too large to ship raw, and too large to filter/scan at
runtime on every view. A **preprocessing script** (`scripts/build-dataset.ts`, run via
`npm run build:data`) transforms it into a trimmed, **pre-split, per-level** dataset:

1. Keep only entries with at least one `new-*` level.
2. Project to the fields the app needs:
   ```ts
   interface Word {
     id: string;          // stable id, e.g. simplified + "#" + pinyin
     simplified: string;
     traditional?: string;
     pinyin: string;      // forms[0].transcriptions.pinyin
     meanings: string[];  // forms[0].meanings
     levels: number[];    // parsed from "new-N" -> [N], usually a single entry
     pos: string[];
     frequency: number;
   }
   ```
3. **Split by level** into `src/data/levels/1.json` … `src/data/levels/7.json` (level 7
   = `new-7`, covering HSK 7–9). A word that legitimately carries more than one
   `new-*` tag is duplicated into each relevant level file (rare in practice).
4. Each level file is sorted by `frequency` ascending (most common first), so a level
   view or a "common words first" session ordering needs no extra sort at runtime.
5. Also emit `src/data/index.json` — a tiny manifest with just `{ level, count }` per
   level, so the Home dashboard and level chips can show counts without loading any
   word data.

The raw `data/complete.json` stays out of the shipped bundle; only the generated
per-level files are imported by the app.

> **Data quirk handled at build time:** many entries list a surname/proper-noun
> reading as `forms[0]` (e.g. 白 → `forms[0]` = "Bái" → "surname Bai", `forms[1]` =
> "bái" → "white", ...). The pipeline detects this via pinyin capitalization
> (proper-noun readings are capitalized in the source data) and prefers the first
> non-proper-noun form, falling back to `forms[0]` only if every form is a proper
> noun. See `pickForm` in `scripts/build-dataset.ts`.

### Runtime loading strategy (efficiency)
- Each level file is **dynamically imported** (`import(`../data/levels/${n}.json`)`)
  only when that level is actually viewed or included in a session — this code-splits
  the ~11k words across 7 chunks so, e.g., viewing Level 1 never pulls in Level 7's
  5,606 words.
- Loaded level chunks are cached in memory for the session (module cache / a small
  `Map<level, Word[]>`) so switching between already-viewed levels is instant.
- The **List** and **Flashcard browse** views are always scoped to a single level (or
  an explicit multi-level selection for test sessions) — there is no default
  "load all 10,969 words" view, keeping every list operation proportional to the
  levels actually selected, not the full dataset.
- Large tables (Level 7 alone is 5,606 rows) are rendered with a **virtualized list**
  (`@tanstack/react-virtual`) so only visible rows are mounted, keeping scroll
  performance smooth regardless of level size.
- Filtering/sorting within a loaded level operates on plain in-memory arrays (≤ ~5,600
  items worst case), which is trivially fast — no need for an index or search library.

### POS labels
`pos` codes (`n`, `v`, `a`, ...) map to human-readable labels via a small lookup table
built from the table in `schema.md` (`src/data/pos-labels.ts`).

---

## 4. Core Concepts

- **Word** — a static vocabulary entry (see interface above), loaded from the
  per-level generated data. Immutable at runtime.
- **Memorized flag** — a manual, per-word boolean the user toggles ("check") from the
  List or Flashcard browse view. Purely a label/filter — it does **not** feed the SRS
  scheduler and is **not** changed automatically by grading a card right or wrong.
  Persisted independently of SRS state.
- **Session (Test)** — a user-configured batch of up to 100 cards drawn from selected
  levels (optionally restricted to un-memorized words within those levels), with a
  chosen ordering. Ephemeral; results feed into stats + SRS.
- **Review grade** — one of `right | wrong | skip` applied to a card in a session;
  drives the SRS scheduler only (never touches the memorized flag).
- **SRS state** — per-word scheduling data (interval, ease, due date, streak),
  updated only by grading cards in a Session. Persisted, independent of the
  memorized flag.
- **Stats** — aggregate + per-word performance history. Persisted.

---

## 5. Spaced Repetition (SRS)

Use a simplified **SM-2** variant, adapted to a 3-button grade (right/wrong/skip):

Per-word `SrsCard`:
```ts
interface SrsCard {
  wordId: string;
  reps: number;        // successful reps in a row
  intervalDays: number;
  ease: number;        // ease factor, starts 2.5, floor 1.3
  dueDate: number;     // epoch ms; when it's next due
  lastGrade: Grade;
  history: { at: number; grade: Grade }[]; // capped (e.g. last 50)
}
```

Grade handling:
- **right** → increment `reps`; grow `intervalDays` (1 → 3 → interval * ease);
  nudge `ease` up slightly. Set `dueDate = now + intervalDays`.
- **wrong** → reset `reps = 0`, `intervalDays = ~0` (due again soon, same session or
  next day depending on mode); decrease `ease` (−0.2, floored at 1.3).
- **skip** → no scheduling change; card just isn't counted this session (optionally
  re-queued to end of current session).

New (never-seen) words have no `SrsCard` until first graded. "Due" = `dueDate <= now`.

> v1 keeps the exact numbers configurable in one module (`src/srs/scheduler.ts`) so the
> algorithm can be tuned without touching UI.

> **Independence from "memorized":** the SRS scheduler and the manual memorized flag
> are two separate systems that both happen to describe "how well I know this word."
> Grading a card right/wrong/skip in a test session never sets or clears `memorized`,
> and checking/unchecking `memorized` in a browse view never touches `SrsCard`. This
> keeps the mental model simple: SRS drives *when tests re-serve a word*, memorized
> drives *whether it's excluded from a test's un-memorized filter*.

---

## 6. Screens / UX

Single-page app with these routes:

1. **Home / Dashboard** (`/`)
   - Summary: total words studied, due-today count, current streak, accuracy,
     memorized count (overall + per level).
   - Primary CTAs: "Start Review (due cards)", "New Test Session", "Browse Words".
   - Small per-level progress bars (memorized vs total, from `index.json` counts).

2. **Words — List view** (`/words/:level`, e.g. `/words/1` … `/words/7`)
   - Level selector (tabs or chips for 1–7); each level loads only its own chunk
     (see §3 runtime loading strategy).
   - A `X / Y memorized` progress bar for the current level, always visible.
   - Virtualized **table**: columns = simplified, traditional (optional), pinyin,
     meaning(s), POS, memorized checkbox. Word/pinyin columns are narrow; meaning
     gets the most horizontal room. A meaning cell that's truncated can be clicked
     to expand to full, wrapped text in place (row height adjusts dynamically).
   - In-level search/filter box (by simplified, pinyin, or meaning substring) and a
     "hide memorized" toggle.
   - Clicking the **memorized checkbox** in a row toggles that word's flag instantly
     (optimistic, persisted).
   - A view switcher toggles between **List** and **Flashcard** for the same level.

3. **Words — Flashcard browse view** (`/words/:level/cards`)
   - Same level as the List view, with its own search/filter toggles (not shared
     state between the two views).
   - **Front:** simplified character. Flip (tap/space, animated 3D rotation) →
     **Back:** pinyin (toggleable) + meaning(s) + POS.
   - A `X / Y memorized` progress bar for the level, same as List view.
   - Toggles: **Hide memorized**, **Random order** (stable per-word shuffle key so
     marking a word memorized mid-browse doesn't reorder upcoming cards), **Reversed**
     (meaning/pinyin shows first, flip reveals the character), **Show pinyin**.
   - Per-card **"✓ Memorized"** toggle button, plus Prev/Next navigation (arrow keys
     or on-screen buttons, with a directional slide animation). Casual browsing, not
     graded — no SRS/right-wrong here.

4. **Test Session Builder** (`/study`)
   - Multi-select level chips (1, 2, 3, 4, 5, 6, 7). Any combination, e.g. 1+2+5.
     (Hidden and replaced with a static label when pre-filled from a Lesson — see §6a.)
   - Size input/slider, **1–100 cards** (clamped to however many match the filters).
   - Toggles: **"Only un-memorized words"** (filters candidates to `memorized=false`
     within the selected levels/lesson, per §4), **"Reversed"** (meaning/pinyin
     first), **"Show pinyin"**.
   - Ordering: `Due first`, `Frequency (common first)`, `Random`.
   - Live count preview ("87 words match — sampling 50") before starting.
   - "Start" builds the queue and navigates to the Session view.

5. **Session view** (`/study/session`)
   - **Front:** large simplified character (option to show traditional too), or the
     meaning/pinyin side first if the session was configured as Reversed.
   - Tap / space / click to **flip** (animated 3D rotation).
   - **Back:** pinyin (toggleable, with tone marks) + English meaning(s) + POS.
   - Grade buttons: **Wrong** / **Skip** / **Right** (keyboard: 1/2/3 or ←/↓/→),
     which update SRS state only. Each has a distinct soft-tinted background
     matching its semantic color.
   - A secondary "✓ mark memorized" affordance is also available here for
     convenience, but is entirely separate from grading.
   - Progress indicator (n of N), running right/wrong tally.
   - On finish → Session Summary (stat cards fade/stagger in on entrance).

6. **Session Summary**
   - Right / wrong / skipped counts, accuracy, time taken.
   - List of missed words (quick re-study option).
   - Buttons: "Study missed again", "Back home".

7. **Lesson Planner** (`/plan`) — see §6a for full design.

8. **Stats** (`/stats`)
   - Aggregate accuracy over time, reviews per day (simple chart or bars),
     per-level mastery, memorized vs un-memorized breakdown, hardest words
     (lowest accuracy).

9. **Settings** (`/settings`)
   - Theme: `System` / `Light` / `Dark` segmented control.
   - Show traditional characters on/off.
   - Show pinyin on cards on/off (also quick-toggleable directly from the Words
     Flashcard view, Lesson Flashcard view, and Test Session Builder — all read/write
     the same setting, so it stays in sync everywhere).
   - Reset progress (with confirm). (Export/import — see §11, optional v1.1.)

### 6a. Lesson Planner

Splits a level's words into a sequence of fixed-size, ordered flashcard sets — a
lightweight "curriculum" so you can work through a level in bite-size chunks instead
of one big undifferentiated pile.

- **Config:** pick a level (1–7, or a specific multi-level selection), and either a
  **set size** (e.g. 25 words/lesson) or a **number of lessons** (e.g. "split into 10
  lessons") — the other value is derived. Ordering for the split defaults to
  `frequency` (so Lesson 1 is the most common words) with `alphabetical`/`random`
  as options.
- **Output:** a **Lesson Plan** — an ordered list of **Lessons**, each a fixed,
  named slice of word IDs (e.g. "Level 1 · Lesson 1 (1–25)"). Computed once from the
  level's word list and persisted (so re-opening the plan doesn't reshuffle it).
- **Per-lesson actions:**
  - **Study as flashcards** — opens the Flashcard browse view scoped to just that
    lesson's word IDs (reuses the browse component, not a new one).
  - **Start test session** — opens the Test Session Builder pre-filled with that
    lesson's word IDs instead of a level filter.
  - Per-lesson progress: `x / N memorized`, shown as a small progress bar/badge on
    the lesson card, computed from the existing memorized flags — no separate
    lesson-progress state needed.
- **Multiple plans:** a user can create more than one plan (e.g. different set sizes
  for review vs. first-pass learning); plans are listed with delete actions.
- **Collapsible plan groups:** each plan's header (name + `N lessons · X/Y memorized`
  summary, always visible) can be clicked to collapse/expand its lesson grid, so a
  page with several plans (or a plan with many lessons) doesn't dominate the screen.
  Smooth height animation; collapse state is per-plan and resets on reload (not
  persisted - reopening the app shows everything expanded).
- Lesson Plans are pure **groupings of existing word IDs** — they don't duplicate
  word data, don't introduce new SRS/memorized state, and don't require any change to
  the per-level data files.

### Mobile considerations
- Layout is mobile-first; large tap targets for grade buttons and the memorized check.
- Character sizes scale with viewport.
- Swipe gestures optional (swipe left = wrong, right = right in sessions; swipe to
  advance in flashcard browse) as an enhancement.
- The List view's table becomes a stacked-card layout on narrow viewports (still
  virtualized) rather than a horizontally-scrolling table.
- Safe-area insets respected for notched phones.

---

## 7. Persistence Layer

All state in `localStorage` under a single namespaced key, versioned for migrations:

```
Key: "hsk-study:v1"
Value (JSON):
{
  version: 1,
  srs: Record<wordId, SrsCard>,
  memorized: Record<wordId, true>,   // presence = memorized; absence = not
  lessonPlans: LessonPlan[],         // see §6a / §9
  stats: {
    sessions: SessionRecord[],   // capped history
    daily: Record<isoDate, { reviews: number; right: number }>,
  },
  settings: {
    showTraditional: boolean;
    showPinyin: boolean;
    theme: "system" | "light" | "dark";
  }
}
```

- `memorized` is stored as a sparse set (`Record<wordId, true>`, keys present = checked)
  rather than a dense boolean map, since most words start un-memorized — keeps the
  persisted payload small.

- A `storage.ts` module wraps read/write with try/catch, JSON (de)serialization, and a
  `version` field to enable future migrations.
- Writes are debounced/batched to avoid thrashing on every grade.
- Guard against `localStorage` being unavailable (private mode) — degrade to in-memory.
- Loading merges `settings` one level deep against the current defaults (not just a
  top-level spread), so adding a new setting field later doesn't silently disappear
  for users with older saved data that predates it.

---

## 8. Project Structure

```
chinese-school/
├─ PLAN.md
├─ README.md
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts             # sets base path + PWA config for GH Pages (§12)
├─ .github/workflows/
│  └─ deploy.yml              # build + publish to GitHub Pages on push to main
├─ data/                      # source data (not shipped as-is)
│  ├─ complete.json
│  └─ schema.md
├─ scripts/
│  └─ build-dataset.ts        # trims + splits complete.json -> src/data/levels/*.json
├─ public/
│  ├─ manifest.webmanifest
│  └─ icons/ (192, 512, maskable)
└─ src/
   ├─ main.tsx                # HashRouter root (§12)
   ├─ App.tsx                 # route table
   ├─ vite-env.d.ts
   ├─ data/
   │  ├─ levels/              # generated, one file per level
   │  │  ├─ 1.json … 7.json
   │  ├─ index.json           # generated, { level, count }[] manifest
   │  └─ pos-labels.ts
   ├─ types.ts                # Word, SrsCard, Grade, Session, LessonPlan, Settings, etc.
   ├─ srs/
   │  └─ scheduler.ts
   ├─ store/
   │  ├─ storage.ts           # localStorage wrapper
   │  ├─ useStudyStore.tsx    # context/hook exposing state + actions
   │  └─ useLevelData.ts      # dynamic-import + cache per-level word chunks
   ├─ lib/
   │  ├─ sessionBuilder.ts    # filter + order + slice into a session queue
   │  ├─ lessonPlanner.ts     # split a word list into Lesson[] given size/count
   │  ├─ useFlashcardNav.ts   # shared prev/next/keyboard-arrow nav for browse views
   │  ├─ useRandomOrder.ts    # stable per-word shuffle key (see §6 item 3)
   │  ├─ words.ts             # resolveWords: word IDs -> Word[] from a loaded pool
   │  └─ random.ts            # shuffle()
   ├─ layout/
   │  └─ AppLayout.tsx        # sidebar (desktop) / header + bottom tabs (mobile)
   ├─ components/             # Flashcard, FlashcardStage, GradeButtons, LevelChips,
   │                          # ProgressBar, Toggle, WordTable (virtualized),
   │                          # MemorizedCheckbox, LessonCard...
   ├─ pages/                  # Home, Words (List/Cards), Study (Builder/Session),
   │                          # Plan, LessonCards, Stats, Settings
   └─ styles/                 # global.css, variables.css
```

---

## 9. Type Definitions (core)

```ts
type Grade = "right" | "wrong" | "skip";

interface Word {
  id: string;
  simplified: string;
  traditional?: string;
  pinyin: string;
  meanings: string[];
  levels: number[];   // 1..7  (7 == HSK 7-9)
  pos: string[];
  frequency: number;
}

interface SrsCard { /* see §5 */ }

// memorized flag lives in the store as Record<wordId, true>, not on Word itself

interface SessionConfig {
  levels: number[];          // ignored if wordIds is set (lesson-scoped session)
  wordIds?: string[];        // explicit pool, e.g. from a Lesson (§6a)
  size: number;              // 1..100
  onlyUnmemorized: boolean;  // filters candidates within levels/wordIds
  order: "due" | "frequency" | "random";
  reversed: boolean;         // true = meaning/pinyin shown first, flip to character
}

interface Settings {
  showTraditional: boolean;
  showPinyin: boolean;
  theme: "system" | "light" | "dark";
}

interface SessionRecord {
  at: number;
  config: SessionConfig;
  right: number; wrong: number; skipped: number;
  durationMs: number;
  wordIds: string[];
}

interface Lesson {
  id: string;
  label: string;       // e.g. "Lesson 1 (words 1-25)"
  wordIds: string[];
}

interface LessonPlan {
  id: string;
  name: string;               // e.g. "Level 1 · 25/lesson"
  levels: number[];           // source level(s) the plan was built from
  order: "frequency" | "alphabetical" | "random";
  lessons: Lesson[];          // computed once, persisted
  createdAt: number;
}
```

---

## 10. Build & Run

```
npm install
npm run build:data     # generate src/data/levels/*.json + index.json from data/complete.json
npm run dev            # Vite dev server
npm run dev -- --host  # also bind to the LAN so a phone on the same Wi-Fi can open it
npm run build          # static production build -> dist/
npm run preview        # preview the production build
npm test               # Vitest (test infra is scaffolded; no tests written yet)
```

`build:data` is also wired as a `prebuild`/`predev` step so a fresh clone works
without manual steps.

---

## 11. Future Enhancements (post-v1)
- Manual **export/import** of progress as a JSON file (cross-device transfer).
- Audio pronunciation (TTS or bundled audio).
- Example sentences / classifiers surfaced on card back.
- HSK 2.0 (`old-*`) study mode toggle.
- Configurable SRS parameters in Settings.
- Swipe gestures and haptics on mobile.
- Reordering/editing lesson contents after a plan is generated.
- Persist lesson-plan collapse state (currently resets to all-expanded on reload).

---

## 12. Deployment (GitHub Pages)

The app is a static SPA, deployed to GitHub Pages at
`https://<username>.github.io/chinese-school/`. Two things GH Pages requires that a
typical dev setup doesn't:

- **Base path.** GH Pages project sites are served from a `/repo-name/` subpath, not
  the domain root. `vite.config.ts` sets `base: "/chinese-school/"`, which Vite uses
  to prefix every built asset URL (JS/CSS chunks, icons, the PWA manifest's
  `start_url`/`scope`). If the repo is ever renamed, update `BASE_PATH` in
  `vite.config.ts` to match.
- **No server-side rewrites.** A deep link or page refresh on a route like
  `/words/3` would 404 on GH Pages, since there's no server to fall back to
  `index.html`. `main.tsx` uses `HashRouter` instead of `BrowserRouter` (URLs like
  `/#/words/3`) so routing is entirely client-side and every URL always resolves,
  at the cost of the `#` in the address bar.

**CI/CD:** `.github/workflows/deploy.yml` builds and publishes `dist/` via GitHub's
official Pages Actions (`configure-pages` / `upload-pages-artifact` /
`deploy-pages`) on every push to `main`. One-time setup on a new repo: push the code,
then in **Settings → Pages** set **Source** to **GitHub Actions**.
