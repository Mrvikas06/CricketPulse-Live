import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const CRICBUZZ_LIVE_SCORES_URL = 'https://www.cricbuzz.com/cricket-match/live-scores';

function extractJsonObjects(source: string, marker: string) {
  const objects: unknown[] = [];
  let index = 0;

  while ((index = source.indexOf(marker, index)) !== -1) {
    const start = source.lastIndexOf('{', index);
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let cursor = start; cursor < source.length; cursor += 1) {
      const char = source[cursor];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;
      if (char === '{') depth += 1;
      if (char === '}') depth -= 1;

      if (depth === 0) {
        try {
          objects.push(JSON.parse(source.slice(start, cursor + 1)));
        } catch {
          // Cricbuzz can change page chunks; skip partial objects.
        }
        index = cursor + 1;
        break;
      }
    }

    index += 1;
  }

  return objects;
}

function cricbuzzWebFeedPlugin(): Plugin {
  return {
    name: 'cricbuzz-web-feed',
    configureServer(server) {
      server.middlewares.use('/api/cricbuzz/live', async (_request, response) => {
        try {
          const html = await fetch(CRICBUZZ_LIVE_SCORES_URL, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
            },
          }).then((res) => {
            if (!res.ok) {
              throw new Error(`Cricbuzz page returned ${res.status}`);
            }
            return res.text();
          });

          const unescaped = html
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '')
            .replace(/\\u0026/g, '&');

          const seenMatchIds = new Set<string>();
          const matches = extractJsonObjects(unescaped, '"match":{"matchInfo"')
            .map((item) => (item as { match?: unknown }).match)
            .filter((match) => {
              const matchId = String(
                (match as { matchInfo?: { matchId?: number | string } } | undefined)?.matchInfo?.matchId || '',
              );

              if (!matchId || seenMatchIds.has(matchId)) {
                return false;
              }

              seenMatchIds.add(matchId);
              return true;
            });

          response.setHeader('Content-Type', 'application/json');
          response.end(
            JSON.stringify({
              source: 'cricbuzz-web',
              updatedAt: new Date().toISOString(),
              matches,
            }),
          );
        } catch (error) {
          response.statusCode = 502;
          response.setHeader('Content-Type', 'application/json');
          response.end(
            JSON.stringify({
              source: 'cricbuzz-web',
              error: error instanceof Error ? error.message : 'Unable to read Cricbuzz live page',
              matches: [],
            }),
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss(), cricbuzzWebFeedPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_CRICBUZZ_WEB_FEED_URL': JSON.stringify(env.VITE_CRICBUZZ_WEB_FEED_URL || '/api/cricbuzz/live'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify; file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
