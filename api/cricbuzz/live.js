// Using mock cricket match data for demo
const MOCK_MATCHES = [
  {
    matchInfo: {
      matchId: 1,
      matchDesc: 'Kolkata Knight Riders vs Mumbai Indians',
      matchFormat: 'T20',
      startDate: Date.now(),
      state: 'Live',
      stateTitle: 'Live',
      status: 'Live',
      shortStatus: 'Live',
      seriesName: 'Indian Premier League 2024',
      team1: {
        teamName: 'Kolkata Knight Riders',
        teamSName: 'KKR',
      },
      team2: {
        teamName: 'Mumbai Indians',
        teamSName: 'MI',
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
          wickets: 7,
          overs: 20,
        },
      },
      team2Score: {
        inngs1: {
          runs: 142,
          wickets: 8,
          overs: 19.3,
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
  {
    matchInfo: {
      matchId: 3,
      matchDesc: 'Rajasthan Royals vs Chennai Super Kings',
      matchFormat: 'T20',
      startDate: Date.now() + 7200000,
      state: 'Upcoming',
      stateTitle: 'Upcoming',
      status: 'Not Started',
      shortStatus: 'Upcoming',
      seriesName: 'Indian Premier League 2024',
      team1: {
        teamName: 'Rajasthan Royals',
        teamSName: 'RR',
      },
      team2: {
        teamName: 'Chennai Super Kings',
        teamSName: 'CSK',
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
  {
    matchInfo: {
      matchId: 4,
      matchDesc: 'Punjab Kings vs Sunrisers Hyderabad',
      matchFormat: 'T20',
      startDate: Date.now() + 10800000,
      state: 'Upcoming',
      stateTitle: 'Upcoming',
      status: 'Not Started',
      shortStatus: 'Upcoming',
      seriesName: 'Indian Premier League 2024',
      team1: {
        teamName: 'Punjab Kings',
        teamSName: 'PBKS',
      },
      team2: {
        teamName: 'Sunrisers Hyderabad',
        teamSName: 'SRH',
      },
      venueInfo: {
        ground: 'PCA Stadium',
        city: 'Mohali',
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
