import { Droplets, Activity, Droplet, Wind } from 'lucide-react';
import WaterQualityChart from '../components/WaterQualityChart';

const WaterQuality = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-400" /> Water Quality Analysis
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Top Section - Aqua Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card lg:col-span-1 flex flex-col items-center justify-center py-10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-6">Composite Aqua Score</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset="36" className="text-blue-500 transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">87</span>
                <span className="text-sm font-medium text-gray-400">/100</span>
              </div>
            </div>
            
            <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold tracking-wide">
              GOOD
            </div>
          </div>
          
          <div className="card lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScoreComponent title="Physical Quality" score="92/100" status="Excellent" params="Temp, Turbidity, TSS" icon={<Activity className="text-purple-400" />} />
            <ScoreComponent title="Chemical Quality" score="84/100" status="Good" params="pH, DO, TDS, Conductivity" icon={<Droplet className="text-aqua-400" />} />
            <ScoreComponent title="Biological Quality" score="85/100" status="Good" params="Algal Growth, Cyanobacteria" icon={<Wind className="text-green-400" />} />
          </div>
        </div>

        {/* Detailed Charts */}
        <div className="card mb-6">
          <h3 className="font-semibold mb-4 text-lg">Parameter Trends</h3>
          <div className="h-[400px]">
             <WaterQualityChart />
          </div>
        </div>
        
      </div>
    </div>
  );
};

const ScoreComponent = ({ title, score, status, params, icon }: any) => (
  <div className="flex flex-col p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded bg-white/5">{icon}</div>
      <h4 className="font-semibold text-gray-200">{title}</h4>
    </div>
    <div className="text-3xl font-bold text-white mb-2">{score}</div>
    <div className="text-sm text-green-400 font-medium mb-4">{status}</div>
    <div className="mt-auto pt-4 border-t border-[var(--border)]">
      <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Key Parameters</div>
      <div className="text-xs text-gray-400">{params}</div>
    </div>
  </div>
);

export default WaterQuality;
