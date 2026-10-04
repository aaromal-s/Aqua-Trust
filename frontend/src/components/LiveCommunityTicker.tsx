import { useState, useEffect } from 'react';
import { Droplets, Recycle, Activity } from 'lucide-react';

const livePings = [
  { text: 'Resident in Sector 4 verified tap purity (Score: 98/100)', time: '4s ago', type: 'safe' },
  { text: 'Metro Plaza Public Water ATM dispensed 42 reusable refills', time: '14s ago', type: 'refill' },
  { text: 'Lake East Recreational Sensor: pH 7.4 baseline verified', time: '28s ago', type: 'sensor' },
  { text: 'North River Field Inspector resolved sediment alert #AQUA-1042', time: '1m ago', type: 'dispatch' },
  { text: 'High School Eco-Club pledged to monitor Pine Creek Wetland', time: '2m ago', type: 'adopt' }
];

export const LiveCommunityTicker = () => {
  const [bottlesSaved, setBottlesSaved] = useState(1420892);
  const [gallonsMonitored, setGallonsMonitored] = useState(48291400);
  const [currentPingIndex, setCurrentPingIndex] = useState(0);

  useEffect(() => {
    // Ticking bottles saved
    const bottleInterval = setInterval(() => {
      setBottlesSaved((prev) => prev + 1);
    }, 2800);

    // Ticking gallons monitored
    const gallonInterval = setInterval(() => {
      setGallonsMonitored((prev) => prev + Math.floor(8 + Math.random() * 14));
    }, 1200);

    // Rotating live ping
    const pingInterval = setInterval(() => {
      setCurrentPingIndex((prev) => (prev + 1) % livePings.length);
    }, 4500);

    return () => {
      clearInterval(bottleInterval);
      clearInterval(gallonInterval);
      clearInterval(pingInterval);
    };
  }, []);

  const ping = livePings[currentPingIndex];

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      <div className="card !p-5 bg-white/90 backdrop-blur-xl border border-zinc-200/90 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Metric 1: Bottles Saved */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Single-Use Plastic Bottles Saved
            </span>
            <div className="text-xl font-bold text-zinc-900 font-mono tracking-tight">
              {bottlesSaved.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-zinc-200" />

        {/* Metric 2: Gallons Monitored */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Continuous Clean Gallons Verified
            </span>
            <div className="text-xl font-bold text-zinc-900 font-mono tracking-tight">
              {gallonsMonitored.toLocaleString()} gal
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-zinc-200" />

        {/* Metric 3: Rotating Live Telemetry Pulse */}
        <div className="flex items-center gap-3 bg-zinc-50 py-2 px-3.5 rounded-xl border border-zinc-200/80 min-w-[280px]">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-400 font-semibold mb-0.5">
              <span className="flex items-center gap-1 uppercase tracking-wider text-blue-600 font-bold">
                <Activity className="w-3 h-3" /> Live Community Pulse
              </span>
              <span>{ping.time}</span>
            </div>
            <p className="text-xs text-zinc-700 font-medium truncate">
              {ping.text}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveCommunityTicker;
