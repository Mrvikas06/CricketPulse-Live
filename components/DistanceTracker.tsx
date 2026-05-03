import { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Navigation, Route, Target } from 'lucide-react';
import { motion } from 'motion/react';

const WANKHEDE_STADIUM = {
  lat: 18.9389,
  lng: 72.8258,
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const radius = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c;
};

export default function DistanceTracker() {
  const [distance, setDistance] = useState(6.8);
  const [locationState, setLocationState] = useState<'demo' | 'live' | 'blocked'>('demo');
  const [gate, setGate] = useState('Gate 3');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationState('blocked');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextDistance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          WANKHEDE_STADIUM.lat,
          WANKHEDE_STADIUM.lng,
        );
        setDistance(Number(nextDistance.toFixed(1)));
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationState('live');
        setGate(nextDistance < 1.5 ? 'Pavilion Gate' : 'Gate 3');
      },
      () => setLocationState('blocked'),
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 8000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleOpenRoute = () => {
    const destination = `${WANKHEDE_STADIUM.lat},${WANKHEDE_STADIUM.lng}`;
    const origin = coords ? `${coords.lat},${coords.lng}` : '';
    const mapsUrl = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Wankhede Stadium')}`;

    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="utility-panel navigator-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Stadium route</p>
          <h3>Ground Navigator</h3>
        </div>
        <span className={locationState === 'live' ? 'feed-pill' : 'feed-pill demo'}>
          <Navigation className="h-3.5 w-3.5" />
          {locationState === 'live' ? 'Live GPS' : 'Demo GPS'}
        </span>
      </div>

      <div className="route-card">
        <MapPin className="h-5 w-5" />
        <div>
          <strong>{distance.toFixed(1)} km</strong>
          <span>to Wankhede Stadium</span>
        </div>
      </div>

      <div className="route-steps">
        {[
          ['Arrive', gate],
          ['Security', 'Express lane'],
          ['Seat', 'Block B, Row 15'],
        ].map(([label, value], index) => (
          <motion.div
            className="route-step"
            key={label}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: index === 0 ? 1 : 0.82 }}
          >
            <Target className="h-4 w-4" />
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
            {index < 2 && <ArrowRight className="h-4 w-4 muted-icon" />}
          </motion.div>
        ))}
      </div>

      <button type="button" className="secondary-button" onClick={handleOpenRoute}>
        <Route className="h-4 w-4" />
        Open Live Route
      </button>
    </section>
  );
}
