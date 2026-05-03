/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Clock3,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import LiveScore from './components/LiveScore';
import { CricketMatch, fetchCricketMatches, formatScore, runRate } from './services/cricketApi';

interface Commentary {
  id: string;
  text: string;
  timestamp: Date;
  isNew?: boolean;
  source: 'match';
}

const feedUrl = import.meta.env.VITE_CRICBUZZ_WEB_FEED_URL || '/api/cricbuzz/live';

const getLatestInning = (match: CricketMatch | null | undefined) => match?.score?.[match.score.length - 1] || null;

const getBattingSide = (inningName?: string) => inningName?.replace(/\s+Inning\s+\d+$/i, '') || 'Batting side';

const hasMeaningfulChange = (previous: CricketMatch | null, next: CricketMatch) => {
  if (!previous) return true;
  const previousInning = getLatestInning(previous);
  const nextInning = getLatestInning(next);

  if (!previousInning && nextInning) return true;
  if (!previousInning || !nextInning) return false;

  return (
    previousInning.runs !== nextInning.runs ||
    previousInning.wickets !== nextInning.wickets ||
    previousInning.overs !== nextInning.overs ||
    previous.status !== next.status
  );
};

const buildMatchCommentary = (match: CricketMatch, previous: CricketMatch | null) => {
  const inning = getLatestInning(match);
  if (!inning) {
    return `${match.name} is live. ${match.status}`;
  }

  const previousInning = getLatestInning(previous);
  const battingSide = getBattingSide(inning.inning);
  const score = formatScore(inning);
  const rr = runRate(inning);

  if (!previous || !previousInning) {
    return `${match.name} is underway. ${battingSide} are on ${score} with a run rate of ${rr}.`;
  }

  const runDelta = inning.runs - previousInning.runs;
  const wicketDelta = inning.wickets - previousInning.wickets;
  const overDelta = inning.overs - previousInning.overs;

  if (wicketDelta > 0) {
    return `Wicket! ${match.name} tightens up as ${battingSide} move to ${score}.`;
  }

  if (runDelta >= 6) {
    return `Maximum impact from ${battingSide}; they add six runs and move to ${score} at RR ${rr}.`;
  }

  if (runDelta >= 4) {
    return `A boundary shifts momentum for ${battingSide}. The scoreboard now reads ${score}.`;
  }

  if (overDelta > 0) {
    return `Another over is done. ${battingSide} hold ${score} and keep the chase alive at RR ${rr}.`;
  }

  return `${match.status}. ${battingSide} remain at ${score} with a run rate of ${rr}.`;
};

export default function App() {
  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [liveMatches, setLiveMatches] = useState<CricketMatch[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [matchPulse, setMatchPulse] = useState('Waiting for a live match feed.');

  const commentaryEndRef = useRef<HTMLDivElement>(null);
  const latestMatchRef = useRef<CricketMatch | null>(null);
  const selectedMatchRef = useRef<string | null>(null);

  useEffect(() => {
    commentaryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commentary]);

  useEffect(() => {
    selectedMatchRef.current = selectedMatchId;
  }, [selectedMatchId]);

  const appendCommentary = useCallback((text: string, source: Commentary['source']) => {
    setCommentary((previous) =>
      [
        ...previous.map((entry) => ({ ...entry, isNew: false })),
        {
          id: crypto.randomUUID(),
          text,
          timestamp: new Date(),
          isNew: true,
          source,
        },
      ].slice(-9),
    );
  }, []);

  const activeMatch = useMemo(
    () => liveMatches.find((match) => match.id === selectedMatchId) || liveMatches[0] || null,
    [liveMatches, selectedMatchId],
  );

  const activeInning = getLatestInning(activeMatch);

  const syncLiveFeed = useCallback(async () => {
    try {
      setFeedLoading(true);
      const nextMatches = await fetchCricketMatches({ feedUrl });
      setLiveMatches(nextMatches);
      setFeedError(null);
      setSelectedMatchId((current) => (current && nextMatches.some((match) => match.id === current) ? current : nextMatches[0]?.id || null));

      const nextMatch = nextMatches.find((match) => match.id === selectedMatchRef.current) || nextMatches[0] || null;
      const previousMatch = latestMatchRef.current;
      if (nextMatch) {
        const nextPulse = buildMatchCommentary(nextMatch, previousMatch);
        setMatchPulse(nextPulse);
        if (hasMeaningfulChange(previousMatch, nextMatch)) {
          appendCommentary(nextPulse, 'match');
        }
      }
      latestMatchRef.current = nextMatch;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Live match feed unavailable';
      setFeedError(message);
      setMatchPulse('Live feed unavailable. Waiting for match updates.');
    } finally {
      setFeedLoading(false);
    }
  }, [appendCommentary]);

  useEffect(() => {
    syncLiveFeed();
    const interval = window.setInterval(syncLiveFeed, 15000);
    return () => window.clearInterval(interval);
  }, [syncLiveFeed]);

  return (
    <div className="commentary-studio">
      <header className="studio-header">
        <div>
          <p className="eyebrow">Live cricket desk</p>
          <h1>Commentary Studio</h1>
          <p className="max-w-2xl text-sm text-white/55">
            Professional ball-by-ball narration pulled directly from the live match feed.
          </p>
        </div>

        <div className="studio-status flex flex-col items-start sm:items-end">
          <div className="flex items-center gap-2">
            <span className="status-dot live" />
            <strong>Live feed</strong>
          </div>
          <small>{feedLoading ? 'Syncing live match feed' : 'Match commentary only'}</small>
        </div>
      </header>

      <main className="studio-grid">
        <section className="commentary-feed">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Ball-by-ball voice</p>
              <h3>Live Commentary</h3>
              <p className="text-sm text-white/55">
                {feedLoading ? 'Syncing live match feed…' : activeMatch?.name || 'No live match selected'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="processing-indicator">
                <Activity className={feedLoading ? 'h-4 w-4 animate-pulse' : 'h-4 w-4'} />
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-white/65">
                {feedError ? 'Feed issue' : 'Live sync'}
              </div>
            </div>
          </div>

          {liveMatches.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {liveMatches.slice(0, 4).map((match) => (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => setSelectedMatchId(match.id)}
                  className={`rounded-full border px-3 py-2 text-left text-[11px] uppercase tracking-[0.24em] transition ${
                    selectedMatchId === match.id
                      ? 'border-amber-300/60 bg-amber-300/10 text-amber-200'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {match.teams.join(' vs ')}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-amber-300/20 p-2 text-amber-200">
                <Clock3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Current match pulse</p>
                <p className="mt-1 text-sm leading-6 text-white/85">{matchPulse}</p>
              </div>
            </div>
          </div>

          <div className="commentary-list">
            <AnimatePresence initial={false}>
              {commentary.length === 0 ? (
                <div className="empty-commentary">
                  <MessageSquare className="h-8 w-8" />
                  <span>Waiting for live match updates</span>
                </div>
              ) : (
                commentary.map((entry) => (
                  <motion.article
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: entry.isNew ? 1 : 0.68, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={entry.isNew ? 'commentary-item new' : 'commentary-item'}
                  >
                    <time>{entry.timestamp.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</time>
                    <p>{entry.text}</p>
                    <span>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Match engine
                    </span>
                  </motion.article>
                ))
              )}
            </AnimatePresence>
            <div ref={commentaryEndRef} />
          </div>
        </section>

        <aside className="commentary-side">
          <div className="side-summary-card">
            <span className="side-summary-pill">
              <Sparkles className="h-3.5 w-3.5" />
              Match context
            </span>
            <h4>{activeMatch?.name || 'Live match pending'}</h4>
            <p>{activeMatch?.status || 'Waiting for live feed data'}</p>
            <div className="side-summary-meta">
              <span>{activeMatch?.venue || 'Venue loading'}</span>
              <span>{feedLoading ? 'Syncing updates' : 'Live commentary ready'}</span>
            </div>
          </div>

          <div className="side-stat-grid">
            <article>
              <span>Score</span>
              <strong>{activeInning ? formatScore(activeInning) : '—'}</strong>
            </article>
            <article>
              <span>Run Rate</span>
              <strong>{runRate(activeInning || undefined)}</strong>
            </article>
            <article>
              <span>Status</span>
              <strong>{feedError ? 'Offline' : 'Live'}</strong>
            </article>
            <article>
              <span>Teams</span>
              <strong>{activeMatch?.teams.join(' vs ') || '—'}</strong>
            </article>
          </div>

          <div className="side-notes-card">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Broadcast note</p>
            <p className="mt-2 text-sm leading-6 text-white/80">
              The right panel now focuses on live match details only, with no image gallery or media blocks.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
