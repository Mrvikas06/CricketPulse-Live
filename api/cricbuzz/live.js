// Using mock cricket match data for demo
const MOCK_MATCHES = [
  {
    matchInfo: {
      matchId: 1,
      matchDesc: 'India vs Australia',
      matchFormat: 'T20I',
      startDate: new Date().toISOString(),
      state: 'Live',
      stateTitle: 'Live',
      status: 'Live',
      shortStatus: 'Live',
      venue: 'MCG, Melbourne',
    },
    matchScore: [
      {
        team1: {
          teamName: 'India',
          teamSName: 'IND',
          score: 145,
          wickets: 3,
          overs: 15.2,
        },
        team2: {
          teamName: 'Australia',
          teamSName: 'AUS',
          score: 0,
          wickets: 0,
          overs: 0,
        },
      },
    ],
  },
  {
    matchInfo: {
      matchId: 2,
      matchDesc: 'Pakistan vs Sri Lanka',
      matchFormat: 'ODI',
      startDate: new Date(Date.now() + 3600000).toISOString(),
      state: 'Upcoming',
      stateTitle: 'Upcoming',
      status: 'Not Started',
      shortStatus: 'Upcoming',
      venue: 'Colombo, Sri Lanka',
    },
    matchScore: [
      {
        team1: {
          teamName: 'Pakistan',
          teamSName: 'PAK',
          score: 0,
          wickets: 0,
          overs: 0,
        },
        team2: {
          teamName: 'Sri Lanka',
          teamSName: 'SL',
          score: 0,
          wickets: 0,
          overs: 0,
        },
      },
    ],
  },
  {
    matchInfo: {
      matchId: 3,
      matchDesc: 'England vs South Africa',
      matchFormat: 'Test',
      startDate: new Date(Date.now() + 7200000).toISOString(),
      state: 'Upcoming',
      stateTitle: 'Upcoming',
      status: 'Not Started',
      shortStatus: 'Upcoming',
      venue: 'Lord\'s, London',
    },
    matchScore: [
      {
        team1: {
          teamName: 'England',
          teamSName: 'ENG',
          score: 0,
          wickets: 0,
          overs: 0,
        },
        team2: {
          teamName: 'South Africa',
          teamSName: 'SA',
          score: 0,
          wickets: 0,
          overs: 0,
        },
      },
    ],
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
