import { useState } from 'react';
import { CloudSun, Radio, ThermometerSun, Users } from 'lucide-react';
import { motion } from 'motion/react';

const zones = [
  { name: 'Pavilion', capacity: 94, noise: 78 },
  { name: 'Long On', capacity: 88, noise: 84 },
  { name: 'Square Leg', capacity: 63, noise: 66 },
  { name: 'Sight Screen', capacity: 72, noise: 58 },
];

export default function StadiumExperience() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);

  return (
    <section className="utility-panel stadium-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Matchday ops</p>
          <h3>Stadium Pulse</h3>
        </div>
        <Radio className="h-5 w-5 panel-icon" />
      </div>

      <div className="crowd-meter">
        <div>
          <Users className="h-5 w-5" />
          <span>Crowd energy</span>
        </div>
        <strong>{selectedZone.noise}%</strong>
      </div>
      <div className="meter-track">
        <motion.div
          key={selectedZone.name}
          initial={{ width: 0 }}
          animate={{ width: `${selectedZone.noise}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      <div className="zone-grid">
        {zones.map((zone) => (
          <button
            key={zone.name}
            type="button"
            onClick={() => setSelectedZone(zone)}
            className={selectedZone.name === zone.name ? 'active' : ''}
          >
            <span>{zone.name}</span>
            <strong>{zone.capacity}%</strong>
          </button>
        ))}
      </div>

      <div className="weather-grid">
        <div>
          <CloudSun className="h-5 w-5" />
          <span>Clear</span>
          <strong>31 C</strong>
        </div>
        <div>
          <ThermometerSun className="h-5 w-5" />
          <span>Dew factor</span>
          <strong>High</strong>
        </div>
      </div>
    </section>
  );
}
