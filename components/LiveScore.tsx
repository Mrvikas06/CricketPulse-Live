import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CalendarClock,
  CircleDot,
  Gauge,
  MapPin,
  RefreshCw,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Timer,
  Trophy,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CricketMatch,
  fetchCricketMatches,
  formatScore,
  runRate,
} from '../services/cricketApi';

type MatchFilter = 'all' | 'international' | 'league' | 't20';

interface LiveScoreProps {
  compact?: boolean;
}

const feedUrl = process.env.VITE_CRICBUZZ_WEB_FEED_URL || '/api/cricbuzz/live';

const formatMatchTime = (dateString: string) =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(dateString));

const getTeamScore = (match: CricketMatch, teamName: string) =>
  match.score.find((inning) => inning.inning.toLowerCase().startsWith(teamName.toLowerCase()));

function ScoreLine({ match, team }: { match: CricketMatch; team: string }) {
  const inning = getTeamScore(match, team);

  return (
    <div className="score-row">
      <div className="min-w-0">
        <div className="team-name">{team}</div>
        <div className="team-meta">{inning?.inning || 'Awaiting innings data'}</div>
      </div>
      <div className="score-value">{formatScore(inning)}</div>
    </div>
  );
}

function EmptyLiveState({ error, loading }: { error: string | null; loading: boolean }) {
  return (
    <div className="empty-live-state">
      {error ? <ShieldAlert className="h-8 w-8" /> : <Radio className="h-8 w-8" />}
      <strong>{loading ? 'Connecting to Cricbuzz live feed' : 'No live score loaded'}</strong>
      <span>{error || 'Waiting for Cricbuzz to return active live matches.'}</span>
    </div>
  );
}

export default function LiveScore({ compact = false }: LiveScoreProps) {
  const [matches, setMatches] = useState<CricketMatch[]>([]);
  const [activeFilter, setActiveFilter] = useState<MatchFilter>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const loadScores = async (silent = false) => {
    const controller = new AbortController();
    if (!silent) setLoading(true);
    setError(null);

    try {
      const nextMatches = await fetchCricketMatches({
        feedUrl,
        signal: controller.signal,
      });
      setMatches(nextMatches);
      setSelectedMatchId((current) =>
        current && nextMatches.some((match) => match.id === current) ? current : nextMatches[0]?.id || null,
      );
      setLastUpdated(new Date());
    } catch (err) {
      setMatches([]);
      setSelectedMatchId(null);
      setError(err instanceof Error ? err.message : 'Live scores unavailable');
      setLastUpdated(new Date());
    } finally {
      if (!silent) setLoading(false);
    }

    return () => controller.abort();
  };

  useEffect(() => {
    loadScores(true);
    const interval = window.setInterval(() => loadScores(true), 30000);
    return () => window.clearInterval(interval);
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const series = match.seriesName.toLowerCase();
      if (activeFilter === 'international') return series.includes('tour') || series.includes('cup');
      if (activeFilter === 'league') return series.includes('league') || series.includes('ipl') || series.includes('bbl');
      if (activeFilter === 't20') return match.matchType.includes('T20');
      return true;
    });
  }, [activeFilter, matches]);

  const visibleMatches = filteredMatches.length || activeFilter === 'all' ? filteredMatches : matches;
  const featured =
    visibleMatches.find((match) => match.id === selectedMatchId) ||
    visibleMatches[0] ||
    matches[0] ||
    null;
  const latestInning = featured?.score[featured.score.length - 1];

  return (
    <section className={compact ? 'scoreboard compact-scoreboard' : 'scoreboard'}>
      <div className="scoreboard-header">
        <div>
          <p className="eyebrow">Cricbuzz web score</p>
          <h2>Live Matches</h2>
        </div>
        <div className="score-actions">
          <span className="feed-pill">
            <CircleDot className={loading ? 'h-3.5 w-3.5 animate-pulse' : 'h-3.5 w-3.5'} />
            Web Feed
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={() => loadScores(false)}
            aria-label="Refresh scores"
            title="Refresh scores"
          >
            <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          </button>
        </div>
      </div>

      {!compact && (
        <div className="score-filter" aria-label="Match filters">
          {[
            ['all', 'All'],
            ['international', 'International'],
            ['league', 'League'],
            ['t20', 'T20'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={activeFilter === value ? 'active' : ''}
              onClick={() => setActiveFilter(value as MatchFilter)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {!featured ? (
        <EmptyLiveState error={error} loading={loading} />
      ) : (
        <motion.article
          key={featured.id}
          className="featured-match"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="match-topline">
            <span>{featured.matchType}</span>
            <span>{featured.state}</span>
          </div>
          <h3>{featured.name}</h3>

          <div className="innings-stack">
            {featured.teams.map((team) => (
              <ScoreLine key={team} match={featured} team={team} />
            ))}
          </div>

          <div className="status-strip live-status-strip">
            <Activity className="h-4 w-4" />
            <span>{featured.status}</span>
          </div>

          <div className="match-metrics">
            <div>
              <Gauge className="h-4 w-4" />
              <span>RR {runRate(latestInning)}</span>
            </div>
            <div>
              <MapPin className="h-4 w-4" />
              <span>{featured.venue}</span>
            </div>
            <div>
              <CalendarClock className="h-4 w-4" />
              <span>{formatMatchTime(featured.dateTimeGMT)}</span>
            </div>
          </div>
        </motion.article>
      )}

      {!compact && visibleMatches.length > 0 && (
        <div className="match-grid">
          {visibleMatches.slice(0, 6).map((match) => {
            const firstScore = match.score[0];
            const secondScore = match.score[1];
            const isSelected = featured?.id === match.id;

            return (
              <button
                type="button"
                className={isSelected ? 'match-card active-match-card' : 'match-card'}
                key={match.id}
                onClick={() => setSelectedMatchId(match.id)}
              >
                <div className="match-card-head">
                  <span>{match.seriesName}</span>
                  {match.matchEnded ? <Trophy className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                </div>
                <h4>{match.name}</h4>
                <div className="mini-score">
                  <span>{match.teams[0]}</span>
                  <strong>{formatScore(firstScore)}</strong>
                </div>
                <div className="mini-score">
                  <span>{match.teams[1]}</span>
                  <strong>{formatScore(secondScore)}</strong>
                </div>
                <p>{match.status}</p>
              </button>
            );
          })}
        </div>
      )}

      <div className="score-footer">
        <span>{matches.length} Cricbuzz matches</span>
        <span>
          <Timer className="h-3.5 w-3.5" />
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : 'Updating now'}
        </span>
        {error && <span className="score-error">{error}</span>}
      </div>
    </section>
  );
}
