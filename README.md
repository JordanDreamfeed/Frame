# FRAME

Mood board and shot list creator for photography and video production.

## Stack

- React 18 + Vite 5 (front end)
- Vercel Serverless Functions in `api/` (back end proxies)
- Anthropic Messages API for AI shot generation
- Unsplash search for moodboard images

## Run locally

```bash
npm install
cp .env.example .env.local       # then fill in your keys
npm run dev:full                  # web on :5173, api on :3001
```

`npm run dev:full` runs Vite and the local API server side-by-side. Vite proxies `/api/*` to the API server. `.env.local` is loaded automatically by `scripts/dev-api.mjs`.

If you only want to work on the UI without API keys, just run `npm run dev` — the AI generator and Unsplash search will return errors but the rest of the app works.

## Deploy to Vercel

```bash
vercel link        # one time
vercel             # preview
vercel --prod      # production
```

Set env vars in the Vercel dashboard:

- `ANTHROPIC_API_KEY`
- `UNSPLASH_ACCESS_KEY`

`vercel.json` already wires up the build (`vite build` → `dist/`) and the `api/` routes deploy as serverless functions automatically.

## Project layout

```
api/
  generate.js          POST  /api/generate    (Anthropic proxy)
  unsplash.js          GET   /api/unsplash    (Unsplash proxy)
scripts/
  dev-api.mjs          local API server that mimics Vercel
src/
  App.jsx              screen routing (Pricing → Auth → App)
  PricingPage.jsx
  AuthScreen.jsx
  FRAMEApp.jsx         main app: shots, moodboard, schedule, notes
  data.js              constants (PLANS, LIGHTING, LENSES, ...)
  index.css            all styles
  main.jsx             entry
index.html             Vite entry
legacy/
  index.html           original single-file Babel-in-browser prototype
```
