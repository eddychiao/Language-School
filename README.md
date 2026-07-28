# Chinese School

A fully static web app for studying HSK 3.0 vocabulary — flashcards with
spaced repetition, browsable word lists, custom test sessions, and a lesson
planner. No backend; all progress is stored in your browser's `localStorage`.
Installable as a PWA on mobile.

See [PLAN.md](./PLAN.md) for the full design spec.

## Develop

```bash
npm install
npm run dev
```

`npm run dev` regenerates `src/data/levels/*.json` from `data/complete.json`
automatically (via the `predev` hook), so a fresh clone works with no manual
steps.

To use it from another device (e.g. a phone) on the same Wi-Fi network:

```bash
npm run dev -- --host
```

then open `http://<your-computer's-LAN-IP>:5173` on that device.

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Deploy

This repo is set up to deploy to GitHub Pages automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push
to `main`. To enable it on a new repo:

1. Push this repo to GitHub as `chinese-school` (the Vite `base` path in
   `vite.config.ts` is hardcoded to `/chinese-school/` — update it if you use
   a different repo name).
2. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` — the workflow builds and publishes automatically.

Routing uses `HashRouter` (URLs like `/#/words/1`) since GitHub Pages has no
server-side rewrites for deep links.

## Scripts

| Command              | What it does                                      |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Start the dev server                               |
| `npm run build`       | Type-check and build for production                |
| `npm run preview`     | Preview the production build locally               |
| `npm run build:data`  | Regenerate `src/data/levels/*.json` from the source dataset |
| `npm run lint`        | Run ESLint                                          |
