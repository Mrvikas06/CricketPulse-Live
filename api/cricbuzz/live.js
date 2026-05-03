const CRICBUZZ_API_URL = 'https://www.cricbuzz.com/api/cricket/match/live';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(CRICBUZZ_API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.cricbuzz.com/',
      },
    });

    if (!response.ok) {
      console.error(`Cricbuzz API returned ${response.status}`);
      return res.status(200).json({
        source: 'cricbuzz-api',
        matches: [],
        error: `Cricbuzz returned ${response.status}`,
      });
    }

    const data = await response.json();
    const matches = (data.matches || []).filter(m => m && m.matchInfo).slice(0, 10);

    res.setHeader('Cache-Control', 'max-age=30');
    return res.status(200).json({
      source: 'cricbuzz-api',
      updatedAt: new Date().toISOString(),
      matches: matches || [],
    });
  } catch (error) {
    console.error('[cricbuzz/live.js]', error);
    return res.status(500).json({
      source: 'cricbuzz-api',
      error: error instanceof Error ? error.message : 'Unknown error',
      matches: [],
    });
  }
}
