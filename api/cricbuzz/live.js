// Using mock cricket match data for demo
const MOCK_MATCHES = [
  {
    matchInfo: {
      matchId: 1,
      matchDesc: 'Kolkata Knight Riders vs Mumbai Indians',
      matchFormat: 'T20',
      startDate: new Date().toISOString(),
      state: 'Live',
      stateTitle: 'Live',
      status: 'Live',
      shortStatus: 'Live',
      venue: 'Eden Gardens, Kolkata',
    },
    matchScore: [
      {
        team1: {
          teamName: 'Kolkata Knight Riders',
          teamSName: 'KKR',
          score: 165,
          wickets: 7,
          overs: 20,
        },
        team2: {
          teamName: 'Mumbai Indians',
          teamSName: 'MI',
          score: 142,
          wickets: 8,
          overs: 19.3,
        },
      },
    ],
  },
  {
    matchInfo: {
      matchId: 2,
      matchDesc: 'Delhi Capitals vs Royal Challengers Bangalore',
      matchFormat: 'T20',
      startDate: new Date(Date.now() + 3600000).toISOString(),
      state: 'Upcoming',
      stateTitle: 'Upcoming',
      status: 'Not Started',
      shortStatus: 'Upcoming',
      venue: 'Arun Jaitley Stadium, Delhi',
    },
    matchScore: [
      {
        team1: {
          teamName: 'Delhi Capitals',
          teamSName: 'DC',
          score: 0,
          wickets: 0,
          overs: 0,
        },
        team2: {
          teamName: 'Royal Challengers Bangalore',
          teamSName: 'RCB',
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
      matchDesc: 'Rajasthan Royals vs Chennai Super Kings',
      matchFormat: 'T20',
      startDate: new Date(Date.now() + 7200000).toISOString(),
      state: 'Upcoming',
      stateTitle: 'Upcoming',
      status: 'Not Started',
      shortStatus: 'Upcoming',
      venue: 'Arun Jaitley Stadium, Delhi',
    },
    matchScore: [
      {
        team1: {
          teamName: 'Rajasthan Royals',
          teamSName: 'RR',
          score: 0,
          wickets: 0,
          overs: 0,
        },
        team2: {
          teamName: 'Chennai Super Kings',
          teamSName: 'CSK',
          score: 0,
          wickets: 0,
          overs: 0,
        },
      },
    ],
  },
  {
    matchInfo: {
      matchId: 4,
      matchDesc: 'Punjab Kings vs Sunrisers Hyderabad',
      matchFormat: 'T20',
      startDate: new Date(Date.now() + 10800000).toISOString(),
      state: 'Upcoming',
      stateTitle: 'Upcoming',
      status: 'Not Started',
      shortStatus: 'Upcoming',
      venue: 'Punjab Cricket Association Stadium, Mohali',
    },
    matchScore: [
      {
        team1: {
          teamName: 'Punjab Kings',
          teamSName: 'PBKS',
          score: 0,
          wickets: 0,
          overs: 0,
        },
        team2: {
          teamName: 'Sunrisers Hyderabad',
          teamSName: 'SRH',
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
