# CricketPulse Live TODO

## Completed

- Reworked the app into a cricket-first live dashboard.
- Added Cricbuzz web live-score parsing with reliable fallback.
- Redesigned score, commentary, food, navigation, and stadium pulse views.
- Added automated unit tests for score rendering, run rate, and live simulation.
- Fixed TypeScript type configurations and cleaned unused dependencies.
- Fixed memory leaks, AbortController unhandled rejections, and stale state updates.
- Optimized performance with memoized date formatting and removed dead styles.
- Enhanced accessibility with ARIA attributes across all interactive components.

## Optional Next Steps

- Move `/api/cricbuzz/live` from the Vite dev server into a production backend before deployment.
- Add team badge assets once final teams/leagues are chosen.
