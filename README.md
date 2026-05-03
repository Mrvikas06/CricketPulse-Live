# CricketPulse Live

A cricket-first live score, AI commentary, and stadium operations dashboard built with Vite, React, Tailwind, Motion, and lucide-react.

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add keys as needed:

   ```bash
   GEMINI_API_KEY=your_gemini_key
   VITE_CRICBUZZ_WEB_FEED_URL=/api/cricbuzz/live
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

## Live Score API

The score centre reads Cricbuzz's public live scores page through a local Vite endpoint at `/api/cricbuzz/live`. It does not show fake demo scores; if there are no live matches or the page cannot be read, the UI shows the live-feed state honestly.

For production deployment, move the `/api/cricbuzz/live` scraper into your backend or serverless API.
