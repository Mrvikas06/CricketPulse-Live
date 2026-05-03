// Base mock cricket match data
const getBaseMockMatches = () => [
  {
    matchInfo: {
      matchId: 1,
      matchDesc: 'Sunrisers Hyderabad vs Kolkata Knight Riders',
      matchFormat: 'T20',
      startDate: Date.now(),
      state: 'Live',
      stateTitle: 'Live',
      status: 'Live',
      shortStatus: 'Live',
      seriesName: 'Indian Premier League 2024',
      team1: {
        teamName: 'Sunrisers Hyderabad',
        teamSName: 'SRH',
      },
      team2: {
        teamName: 'Kolkata Knight Riders',
        teamSName: 'KKR',
      },
      venueInfo: {
        ground: 'Eden Gardens',
        city: 'Kolkata',
      },
    },
    matchScore: {
      team1Score: {
        inngs1: {
          runs: 165,
          wickets: 0,
          overs: 19,
        },
      },
      team2Score: {
        inngs1: {
          runs: 143,
          wickets: 2,
          overs: 15.5,
        },
      },
    },
  },
  {
    matchInfo: {
      matchId: 2,
      matchDesc: 'Delhi Capitals vs Royal Challengers Bangalore',
      matchFormat: 'T20',
      startDate: Date.now() + 3600000,
      state: 'Upcoming',
      stateTitle: 'Upcoming',
      status: 'Not Started',
      shortStatus: 'Upcoming',
      seriesName: 'Indian Premier League 2024',
      team1: {
        teamName: 'Delhi Capitals',
        teamSName: 'DC',
      },
      team2: {
        teamName: 'Royal Challengers Bangalore',
        teamSName: 'RCB',
      },
      venueInfo: {
        ground: 'Arun Jaitley Stadium',
        city: 'Delhi',
      },
    },
    matchScore: {
      team1Score: {
        inngs1: {
          runs: 0,
          wickets: 0,
          overs: 0,
        },
      },
      team2Score: {
        inngs1: {
          runs: 0,
          wickets: 0,
          overs: 0,
        },
      },
    },
  },
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simulate live score updates based on current time
    const now = Date.now();
    const secondsElapsed = Math.floor((now % 300000) / 1000); // Cycle every 5 minutes
    
    // Get base matches
    const matches = getBaseMockMatches();
    
    // Update KKR's live score dynamically
    if (matches[0] && matches[0].matchScore) {
      const kkrInnings = matches[0].matchScore.team2Score.inngs1;
      
      // Simulate live updates: runs increase every 10 seconds, wickets every 60 seconds
      kkrInnings.runs = 143 + Math.floor(secondsElapsed / 10);
      kkrInnings.overs = 15.5 + Math.floor((secondsElapsed / 60) * 0.2);
      kkrInnings.wickets = Math.min(2 + Math.floor(secondsElapsed / 120), 8);
      
      // Cap at maximum
      if (kkrInnings.runs > 165) kkrInnings.runs = 165;
      if (kkrInnings.overs > 20) kkrInnings.overs = 20;
    }

    // No cache - force fresh data every request
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).json({
      source: 'mock-cricket-data',
      updatedAt: new Date().toISOString(),
      matches: matches,
    });
  } catch (error) {
    console.error('[cricbuzz/live.js]', error);
    return res.status(200).json({
      source: 'mock-cricket-data',
      matches: getBaseMockMatches(),
      error: error instanceof Error ? error.message : 'Using fallback data',
    });
  }
}
