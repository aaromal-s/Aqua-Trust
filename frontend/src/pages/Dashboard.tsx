import React, { useState, useEffect } from 'react';
import { Activity, Droplets, Cpu, ShieldAlert } from 'lucide-react';
import WaterMap from '../components/WaterMap';
import WaterQualityChart from '../components/WaterQualityChart';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    qualityScore: 87.4,
    activeSensors: 142
  });

  useEffect(() => {
    // Simulate real-time ticking telemetry data
    const interval = setInterval(() => {
      setMetrics(prev => ({
        qualityScore: Math.min(100, Math.max(0, prev.qualityScore + (Math.random() * 0.4 - 0.2))),
        activeSensors: prev.activeSensors + (Math.random() > 0.95 ? 1 : 0) - (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel">
        <h2 className="text-lg font-semibold">Water Intelligence Overview</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold bg-emerald-50/50 px-3 py-1 rounded-[8px] border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Telemetry Active
          </div>
          <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-sm cursor-pointer"></div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KpiCard title="Overall Water Quality" value={`${metrics.qualityScore.toFixed(2)}/100`} status="Optimal" trend="+2.4%" trendUp icon={<Droplets className="text-blue-500" />} />
          <KpiCard title="Active Sensors" value={metrics.activeSensors.toString()} status="98% Online" trend="Stable" trendUp={true} icon={<Cpu className="text-emerald-500" />} />
          <KpiCard title="Critical Alerts" value="3" status="Action Required" trend="New" trendUp={false} icon={<ShieldAlert className="text-red-500" />} isAlert />
          <KpiCard title="System Health" value="Stable" status="All systems operational" icon={<Activity className="text-indigo-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart Area */}
          <div className="lg:col-span-2 card">
            <WaterQualityChart />
          </div>
          
          {/* Recent Alerts Area */}
          <div className="card flex flex-col h-[400px]">
            <h3 className="font-semibold mb-4 text-lg">Recent Anomalies</h3>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              <AlertItem type="critical" location="Station AQ-014" message="Unusual turbidity spike detected (11.8 NTU)" time="14m ago" />
              <AlertItem type="warning" location="River North" message="pH level dropping gradually (Current: 6.8)" time="1h ago" />
              <AlertItem type="info" location="Station AQ-003" message="Sensor calibration recommended" time="3h ago" />
              <AlertItem type="warning" location="Estuary South" message="Low Dissolved Oxygen detected (5.2 mg/L)" time="5h ago" />
            </div>
          </div>
        </div>
        
        {/* Map Area */}
        <div className="grid grid-cols-1 gap-6 mb-6">
           <div className="card h-[500px] p-0 overflow-hidden">
              <WaterMap />
           </div>
        </div>

      </div>
    </>
  );
};

const KpiCard = ({ title, value, status, trend, trendUp, icon, isAlert }: any) => (
  <div className={`card card-hover relative overflow-hidden ${isAlert ? 'border-red-500/30 bg-red-500/5' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
      <div className="p-2 bg-slate-100 rounded-lg shadow-sm">
        {icon}
      </div>
    </div>
    <div className="flex items-center justify-between mt-4">
      <span className={`text-sm ${isAlert ? 'text-red-500 font-medium' : 'text-slate-500'}`}>{status}</span>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

const AlertItem = ({ type, location, message, time }: { type: 'critical' | 'warning' | 'info', location: string, message: string, time: string }) => {
  const colors = {
    critical: 'border-red-500/50 bg-red-500/10 text-red-400',
    warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  };
  
  return (
    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 hover:bg-[var(--background)] transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-1">
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${colors[type]}`}>{type.toUpperCase()}</span>
        <span className="text-xs text-slate-400">{time}</span>
      </div>
      <div className="text-sm font-medium text-slate-600 mt-2">{location}</div>
      <div className="text-sm text-slate-500 mt-1 line-clamp-2">{message}</div>
    </div>
  );
};

export default Dashboard;
