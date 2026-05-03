const CRICBUZZ_LIVE_SCORES_URL = 'https://www.cricbuzz.com/cricket-match/live-scores';

function extractJsonObjects(text, searchString) {
  const results = [];
  let startIndex = 0;

  while (true) {
    const index = text.indexOf(searchString, startIndex);
    if (index === -1) break;

    let braceCount = 0;
    let i = index;
    let foundStart = false;

    for (; i < text.length; i++) {
      if (text[i] === '{') {
        if (!foundStart) foundStart = true;
        braceCount++;
      } else if (text[i] === '}') {
        braceCount--;
        if (foundStart && braceCount === 0) {
          try {
            const jsonStr = text.substring(index, i + 1);
            const obj = JSON.parse(jsonStr);
            results.push(obj);
          } catch {}
          break;
        }
      }
    }

    startIndex = i + 1;
  }

  return results;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(CRICBUZZ_LIVE_SCORES_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Cricbuzz returned ${response.status}`);
    }

    const html = await response.text();
    const unescaped = html
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '')
      .replace(/\\u0026/g, '&');

    const seenMatchIds = new Set();
    const matches = extractJsonObjects(unescaped, '"match":{"matchInfo"')
      .map((item) => item.match)
      .filter((match) => {
        const matchId = String(match?.matchInfo?.matchId || '');
        if (!matchId || seenMatchIds.has(matchId)) {
          return false;
        }
        seenMatchIds.add(matchId);
        return true;
      });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'max-age=30');
    return res.status(200).json({
      source: 'cricbuzz-web',
      updatedAt: new Date().toISOString(),
      matches: matches || [],
    });
  } catch (error) {
    console.error('[cricbuzz/live.js]', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      source: 'cricbuzz-web',
      error: error instanceof Error ? error.message : 'Unknown error',
      matches: [],
    });
  }
}
