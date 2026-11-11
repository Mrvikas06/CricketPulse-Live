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

4. Run tests and linting:

   ```bash
   npm test
   npm run lint
   npm run build
   ```

## Live Score API

The score centre reads live scores through the `/api/cricbuzz/live` endpoint. It extracts active match payloads and provides reliable real-time simulation fallback so matches and ball-by-ball commentary remain accessible under all network conditions.
