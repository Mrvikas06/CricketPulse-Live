// Using mock cricket match data for demo - Real IPL Match
const MOCK_MATCHES = [
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
          overs: 20,
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
    ballCommentary: [
      { ball: 15.6, text: 'Gill drives down the ground for a single! KKR need 22 in 24 balls' },
      { ball: 15.5, text: 'Wicket! Cummins caught at mid-off. KKR 143/2' },
      { ball: 15.4, text: 'Cummins smashes over long-on for 4! Great shot!' },
      { ball: 15.3, text: 'Dot ball. Pressure building on KKR' },
      { ball: 15.2, text: 'Boundary! Cummins hits over cover for 4. KKR 138/1' },
      { ball: 15.1, text: 'Single taken. KKR 134/1' },
      { ball: 15.0, text: 'Gill on strike! 26 needed from 30 balls' },
      { ball: 14.6, text: 'SIX! Nitish takes on the bowler! Superb shot over square leg' },
      { ball: 14.5, text: 'Single. KKR 127/1' },
      { ball: 14.4, text: 'Dot. Perfect line and length' },
      { ball: 14.3, text: 'FOUR! Nitish gets off strike with a boundary' },
      { ball: 14.2, text: 'Single to third man. KKR 122/1' },
      { ball: 14.1, text: 'Boundary! Nitish Rana drives through covers for 4' },
      { ball: 14.0, text: 'New bowler on! 39 runs needed from 42 balls' },
      { ball: 13.6, text: 'Wicket! Manish Pandey run out for 37. KKR 115/1' },
      { ball: 13.5, text: 'Single. KKR 115/0' },
      { ball: 13.4, text: 'FOUR! Pandey punches through mid-off' },
      { ball: 13.3, text: 'Dot ball' },
      { ball: 13.2, text: 'Single. 50 run partnership!' },
      { ball: 13.1, text: 'Two runs. KKR moving along nicely' },
      { ball: 13.0, text: 'Powerplay over! KKR 103/0 - Excellent start!' },
    ],
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
