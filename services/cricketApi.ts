export interface CricketInning {
  inning: string;
  runs: number;
  wickets: number;
  overs: number;
}

export interface CricketMatch {
  id: string;
  name: string;
  seriesName: string;
  matchType: string;
  status: string;
  venue: string;
  dateTimeGMT: string;
  teams: string[];
  score: CricketInning[];
  matchStarted: boolean;
  matchEnded: boolean;
  state: string;
  source: 'cricbuzz-web';
}

export interface CricketFeedOptions {
  feedUrl?: string;
  signal?: AbortSignal;
}

interface CricbuzzTeam {
  teamName?: string;
  teamSName?: string;
}

interface CricbuzzInnings {
  inningsId?: number;
  runs?: number;
  wickets?: number;
  overs?: number;
}

interface CricbuzzMatch {
  matchInfo?: {
    matchId?: number;
    matchDesc?: string;
    matchFormat?: string;
    startDate?: string | number;
    state?: string;
    stateTitle?: string;
    status?: string;
    shortStatus?: string;
    seriesName?: string;
    matchType?: string;
    team1?: CricbuzzTeam;
    team2?: CricbuzzTeam;
    venueInfo?: {
      ground?: string;
      city?: string;
    };
  };
  matchScore?: {
    team1Score?: {
      inngs1?: CricbuzzInnings;
      inngs2?: CricbuzzInnings;
    };
    team2Score?: {
      inngs1?: CricbuzzInnings;
      inngs2?: CricbuzzInnings;
    };
  };
}

interface CricbuzzWebResponse {
  matches?: CricbuzzMatch[];
  error?: string;
}

const DEFAULT_FEED_URL = '/api/cricbuzz/live';

const getTeamName = (team?: CricbuzzTeam, fallback = 'Team') =>
  team?.teamName || team?.teamSName || fallback;

const getDate = (timestamp?: string | number) => {
  if (!timestamp) return new Date().toISOString();
  const parsed = Number(timestamp);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : new Date(timestamp).toISOString();
};

const addInning = (
  innings: CricketInning[],
  teamName: string,
  inning?: CricbuzzInnings,
  label = 'Innings',
) => {
  if (!inning) return;
  innings.push({
    inning: `${teamName} ${label}`,
    runs: inning.runs || 0,
    wickets: inning.wickets || 0,
    overs: inning.overs || 0,
  });
};

const normalizeCricbuzzMatch = (match: CricbuzzMatch): CricketMatch => {
  const info = match.matchInfo;
  const team1 = getTeamName(info?.team1, 'Team A');
  const team2 = getTeamName(info?.team2, 'Team B');
  const score: CricketInning[] = [];
  const state = info?.stateTitle || info?.state || 'Live';

  addInning(score, team1, match.matchScore?.team1Score?.inngs1, 'Inning 1');
  addInning(score, team1, match.matchScore?.team1Score?.inngs2, 'Inning 2');
  addInning(score, team2, match.matchScore?.team2Score?.inngs1, 'Inning 1');
  addInning(score, team2, match.matchScore?.team2Score?.inngs2, 'Inning 2');

  const venueParts = [info?.venueInfo?.ground, info?.venueInfo?.city].filter(Boolean);

  return {
    id: String(info?.matchId || crypto.randomUUID()),
    name: `${team1} vs ${team2}${info?.matchDesc ? `, ${info.matchDesc}` : ''}`,
    seriesName: info?.seriesName || 'Cricbuzz Live',
    matchType: (info?.matchFormat || 'Cricket').toUpperCase(),
    status: info?.status || info?.shortStatus || 'Live status unavailable',
    venue: venueParts.join(', ') || 'Venue unavailable',
    dateTimeGMT: getDate(info?.startDate),
    teams: [team1, team2],
    score,
    matchStarted: !/preview|upcoming/i.test(state),
    matchEnded: /won|complete|stumps|abandon/i.test(state),
    state,
    source: 'cricbuzz-web',
  };
};

export const formatScore = (inning?: CricketInning) => {
  if (!inning) return 'Yet to bat';
  return `${inning.runs}/${inning.wickets} (${inning.overs})`;
};

export const runRate = (inning?: CricketInning) => {
  if (!inning?.overs) return '0.00';
  const completeOvers = Math.floor(inning.overs);
  const balls = completeOvers * 6 + Math.round((inning.overs - completeOvers) * 10);
  if (!balls) return '0.00';
  return ((inning.runs / balls) * 6).toFixed(2);
};

export async function fetchCricketMatches(options: CricketFeedOptions = {}): Promise<CricketMatch[]> {
  const response = await fetch(options.feedUrl || DEFAULT_FEED_URL, {
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Cricbuzz web feed failed with ${response.status}`);
  }

  const payload = (await response.json()) as CricbuzzWebResponse;
  if (payload.error) {
    throw new Error(payload.error);
  }

  const matches = (payload.matches || []).map(normalizeCricbuzzMatch);
  if (!matches.length) {
    throw new Error('No live Cricbuzz matches found on the web feed');
  }

  return matches;
}
