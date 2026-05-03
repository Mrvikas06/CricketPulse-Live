import { type CSSProperties, useState } from 'react';
import {
  Activity,
  BarChart3,
  MapPin,
  Moon,
  Radio,
  Shield,
  Sparkles,
  Sun,
  Trophy,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import App from './App.tsx';
import DistanceTracker from './components/DistanceTracker';
import FoodCounter from './components/FoodCounter';
import LiveScore from './components/LiveScore';
import StadiumExperience from './components/StadiumExperience';

type AppTab = 'scores' | 'commentary' | 'ground';

const tabs: Array<{ id: AppTab; label: string; icon: typeof Activity }> = [
  { id: 'scores', label: 'Scores', icon: Activity },
  { id: 'commentary', label: 'Studio', icon: Radio },
  { id: 'ground', label: 'Ground', icon: MapPin },
];

const matchInsights = [
  { label: 'Feed', value: 'Live', detail: 'Cricbuzz web source' },
  { label: 'Refresh', value: '30s', detail: 'Automatic score polling' },
  { label: 'Mode', value: 'AI', detail: 'Camera commentary ready' },
];

const lensCards = [
  {
    label: 'Batting intent',
    value: 'Boundary options through cover and midwicket',
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=700&q=80',
  },
  {
    label: 'Bowling plan',
    value: 'Hard length with deep square protection',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=700&q=80',
  },
  {
    label: 'Field pressure',
    value: 'Ring field cutting off rotation',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=700&q=80',
  },
];

const fanVisuals = [
  {
    label: 'Entry Load',
    value: '72%',
    detail: 'Gate 3 moving fastest',
    image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=700&q=80',
  },
  {
    label: 'Pitch Note',
    value: 'Dry top',
    detail: 'Light evening dew expected',
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=700&q=80',
  },
  {
    label: 'Weather',
    value: '31 C',
    detail: 'Clear skies over the ground',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
  },
  {
    label: 'Medical Desk',
    value: 'Stand B',
    detail: 'Level 2 near family enclosure',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=700&q=80',
  },
];

export default function LandingApp() {
  const [activeTab, setActiveTab] = useState<AppTab>('scores');
  const [isDayMode, setIsDayMode] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 62, y: 38 });
  const [selectedLens, setSelectedLens] = useState(lensCards[0]);

  return (
    <div className={isDayMode ? 'cricket-app day-mode' : 'cricket-app'}>
      <header className="app-topbar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="eyebrow">Cricket broadcast suite</p>
            <h1>CricketPulse Live</h1>
          </div>
        </div>

        <nav className="tabbar" aria-label="Primary views">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={activeTab === id ? 'active' : ''}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setIsDayMode((current) => !current)}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {isDayMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </header>

      <main className="app-shell">
        <section
          className="match-visual"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setSpotlight({
              x: Math.round(((event.clientX - rect.left) / rect.width) * 100),
              y: Math.round(((event.clientY - rect.top) / rect.height) * 100),
            });
          }}
          style={{
            '--spot-x': `${spotlight.x}%`,
            '--spot-y': `${spotlight.y}%`,
            backgroundImage:
              "linear-gradient(90deg, rgba(7, 17, 13, 0.92), rgba(7, 17, 13, 0.35)), url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80')",
          } as CSSProperties}
        >
          <div className="match-visual-content">
            <div className="live-kicker">
              <span className="status-dot live" />
              Cricbuzz web feed
            </div>
            <h2>Point, watch, and follow every live cricket score as it moves.</h2>
            <div className="quick-stats">
              {matchInsights.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <small>{item.detail}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {activeTab === 'scores' && (
            <motion.section
              key="scores"
              className="dashboard-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <LiveScore />
              <aside className="insight-rail">
                <section className="analysis-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">Tactical read</p>
                      <h3>Match Lens</h3>
                    </div>
                    <BarChart3 className="h-5 w-5 panel-icon" />
                  </div>
                  <div className="analysis-list">
                    <div
                      className="lens-preview"
                      style={{
                        backgroundImage: `linear-gradient(0deg, rgba(12, 14, 24, .72), rgba(12, 14, 24, .16)), url(${selectedLens.image})`,
                      }}
                    >
                      <span>{selectedLens.label}</span>
                      <strong>{selectedLens.value}</strong>
                    </div>
                    {lensCards.map((item) => (
                      <button
                        type="button"
                        className={selectedLens.label === item.label ? 'analysis-choice active' : 'analysis-choice'}
                        key={item.label}
                        onClick={() => setSelectedLens(item)}
                      >
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="analysis-panel accent-panel">
                  <Shield className="h-6 w-6" />
                  <div>
                    <p className="eyebrow">Score source</p>
                    <h3>Cricbuzz web feed</h3>
                    <span>Reads the Cricbuzz live scores page locally, with no demo-score fallback.</span>
                  </div>
                </section>
              </aside>
            </motion.section>
          )}

          {activeTab === 'commentary' && (
            <motion.section
              key="commentary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <App />
            </motion.section>
          )}

          {activeTab === 'ground' && (
            <motion.section
              key="ground"
              className="ground-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <FoodCounter />
              <DistanceTracker />
              <StadiumExperience />
              <section className="utility-panel wide-panel">
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Fan operations</p>
                    <h3>Matchday Control</h3>
                  </div>
                  <Sparkles className="h-5 w-5 panel-icon" />
                </div>
                <div className="ops-grid visual-ops-grid">
                  {fanVisuals.map(({ label, value, detail, image }) => (
                    <article
                      key={label}
                      style={{
                        backgroundImage: `linear-gradient(0deg, rgba(12, 14, 24, .84), rgba(12, 14, 24, .28)), url(${image})`,
                      }}
                    >
                      <span>{label}</span>
                      <strong>{value}</strong>
                      <small>{detail}</small>
                    </article>
                  ))}
                </div>
              </section>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
