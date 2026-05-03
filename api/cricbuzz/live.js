// Using mock cricket match data for demo
const MOCK_MATCHES = [
  {
    matchInfo: {
      matchId: 1,
      match_type: 'T20I',
      series: 'T20 World Cup 2024',
      status: 'LIVE',
    },
    matchScore: {
      team1: { teamName: 'India', score: 145, wickets: 3, overs: 15.2 },
      team2: { teamName: 'Australia', score: 0, wickets: 0, overs: 0 },
    },
  },
  {
    matchInfo: {
      matchId: 2,
      match_type: 'ODI',
      series: 'Asia Cup 2024',
      status: 'UPCOMING',
    },
    matchScore: {
      team1: { teamName: 'Pakistan', score: 0, wickets: 0, overs: 0 },
      team2: { teamName: 'Sri Lanka', score: 0, wickets: 0, overs: 0 },
    },
  },
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return mock data for now (Cricbuzz API is restricted)
    const matches = MOCK_MATCHES;

    res.setHeader('Cache-Control', 'max-age=60');
    return res.status(200).json({
      source: 'mock-cricket-data',
      updatedAt: new Date().toISOString(),
      matches: matches,
    });
  } catch (error) {
    console.error('[cricbuzz/live.js]', error);
    return res.status(200).json({
      source: 'mock-cricket-data',
      matches: MOCK_MATCHES,
      error: error instanceof Error ? error.message : 'Using fallback data',
    });
  }
}
