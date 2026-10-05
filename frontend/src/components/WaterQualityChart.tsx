import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Droplets, Activity, Thermometer, ShieldCheck } from 'lucide-react';

type ParameterKey = 'turbidity' | 'pH' | 'temp';

interface ParameterConfig {
  key: ParameterKey;
  label: string;
  unit: string;
  color: string;
  stroke: string;
  gradientId: string;
  glowClass1: string;
  glowClass2: string;
  waveStroke1: string;
  waveStroke2: string;
  badge: string;
  badgeBg: string;
  icon: typeof Droplets;
  domain: [number, number];
}

const parameterConfigs: Record<ParameterKey, ParameterConfig> = {
  turbidity: {
    key: 'turbidity',
    label: 'Turbidity',
    unit: 'NTU',
    color: '#06b6d4',
    stroke: '#06b6d4',
    gradientId: 'colorTurbidity',
    glowClass1: 'bg-cyan-500/15',
    glowClass2: 'bg-blue-500/10',
    waveStroke1: 'stroke-cyan-500/25',
    waveStroke2: 'stroke-blue-400/20',
    badge: 'WHO Compliant (< 4.0 NTU)',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: Droplets,
    domain: [0, 8]
  },
  pH: {
    key: 'pH',
    label: 'pH Level',
    unit: 'pH',
    color: '#8b5cf6',
    stroke: '#8b5cf6',
    gradientId: 'colorPH',
    glowClass1: 'bg-purple-500/15',
    glowClass2: 'bg-indigo-500/10',
    waveStroke1: 'stroke-purple-500/25',
    waveStroke2: 'stroke-indigo-400/20',
    badge: 'Optimal Neutral (6.5 – 8.5)',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Activity,
    domain: [6.0, 8.5]
  },
  temp: {
    key: 'temp',
    label: 'Temperature',
    unit: '°C',
    color: '#f59e0b',
    stroke: '#f59e0b',
    gradientId: 'colorTemp',
    glowClass1: 'bg-amber-500/15',
    glowClass2: 'bg-orange-500/10',
    waveStroke1: 'stroke-amber-500/25',
    waveStroke2: 'stroke-orange-400/20',
    badge: 'Seasonal Baseline (20° – 26°)',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Thermometer,
    domain: [18, 30]
  }
};

const data = [
  { time: '00:00', pH: 7.2, turbidity: 4.2, temp: 24.1 },
  { time: '04:00', pH: 7.1, turbidity: 4.5, temp: 23.8 },
  { time: '08:00', pH: 7.3, turbidity: 4.1, temp: 24.5 },
  { time: '12:00', pH: 7.4, turbidity: 4.8, temp: 25.2 },
  { time: '16:00', pH: 7.3, turbidity: 5.2, temp: 25.8 },
  { time: '20:00', pH: 7.2, turbidity: 4.9, temp: 24.9 },
  { time: '24:00', pH: 7.1, turbidity: 4.4, temp: 24.2 },
];

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 p-3 rounded-xl shadow-xl space-y-1 min-w-[140px]">
        <p className="text-zinc-400 text-[11px] font-mono font-semibold uppercase">{label}</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-700 text-xs font-semibold">{entry.name}:</span>
          </div>
          <span className="text-zinc-900 text-sm font-bold font-mono">
            {entry.value} {unit}
          </span>
        </div>
        <p className="text-[10px] text-emerald-600 font-semibold pt-1 border-t border-zinc-100 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Safe Baseline
        </p>
      </div>
    );
  }
  return null;
};

export const WaterQualityChart = () => {
  const [selectedParam, setSelectedParam] = useState<ParameterKey>('turbidity');
  const currentConfig = parameterConfigs[selectedParam];
  const IconComponent = currentConfig.icon;

  const latestValue = data[data.length - 1][selectedParam];

  return (
    <div className="w-full h-full min-h-[440px] flex flex-col relative overflow-hidden rounded-2xl p-1 select-none">
      
      {/* ======================================================== */}
      {/* 🌊 BACKGROUND ANIMATION LAYERS                            */}
      {/* ======================================================== */}
      
      {/* 1. Breathing Hydro Aura Glow (Color reactive) */}
      <div 
        className={`absolute -top-12 left-1/4 w-80 h-80 rounded-full blur-[90px] pointer-events-none transition-all duration-1000 ${currentConfig.glowClass1} animate-hydro-pulse`} 
      />
      <div 
        className={`absolute bottom-4 right-1/4 w-72 h-72 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 ${currentConfig.glowClass2}`} 
      />

      {/* 2. Animated Flowing Hydro Sine Wave 1 (Slow Harmonic) */}
      <div className="absolute inset-x-0 bottom-6 h-[180px] pointer-events-none overflow-hidden opacity-40 z-0">
        <div className="animate-hydro-wave-1 flex h-full items-center">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`h-full w-full fill-none ${currentConfig.waveStroke1} transition-colors duration-700`} strokeWidth="1.5" strokeLinecap="round">
            <path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,60 1200,60" />
            <path d="M0,60 C150,110 300,10 450,60 C600,110 750,10 900,60 C1050,110 1200,60 1200,60" transform="translate(1200,0)" />
          </svg>
        </div>
      </div>

      {/* 3. Animated Flowing Hydro Sine Wave 2 (Faster Counter-Harmonic) */}
      <div className="absolute inset-x-0 bottom-2 h-[140px] pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="animate-hydro-wave-2 flex h-full items-center">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`h-full w-full fill-none ${currentConfig.waveStroke2} transition-colors duration-700`} strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round">
            <path d="M0,50 C180,95 360,5 540,50 C720,95 900,5 1080,50 C1140,65 1200,50 1200,50" />
            <path d="M0,50 C180,95 360,5 540,50 C720,95 900,5 1080,50 C1140,65 1200,50 1200,50" transform="translate(1200,0)" />
          </svg>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 📊 INTERACTIVE HEADER & SWITCHER CONTROLS                */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 z-10 relative">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-sm"
            style={{ 
              backgroundColor: `${currentConfig.color}15`, 
              borderColor: `${currentConfig.color}40`,
              color: currentConfig.color 
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-zinc-900 tracking-tight">24h Telemetry Stream</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all duration-500 ${currentConfig.badgeBg}`}>
                {currentConfig.badge}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Current Live Value: <strong className="text-zinc-900 font-mono text-sm">{latestValue} {currentConfig.unit}</strong>
            </p>
          </div>
        </div>

        {/* Parameter Switcher Pill Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-100/80 backdrop-blur-md p-1 rounded-xl border border-zinc-200/80 self-start sm:self-auto">
          {(Object.keys(parameterConfigs) as ParameterKey[]).map((key) => {
            const config = parameterConfigs[key];
            const isActive = selectedParam === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedParam(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/60 font-bold scale-102'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50'
                }`}
              >
                <div 
                  className={`w-1.5 h-1.5 rounded-full transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`} 
                  style={{ backgroundColor: config.color }} 
                />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* ======================================================== */}
      {/* 📈 DYNAMIC RECHARTS AREA CANVAS                          */}
      {/* ======================================================== */}
      <div className="flex-1 w-full min-h-[300px] z-10 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTurbidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                <stop offset="50%" stopColor="#0891b2" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="colorPH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                <stop offset="50%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                <stop offset="50%" stopColor="#ea580c" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.7} vertical={false} />
            <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis 
              domain={currentConfig.domain} 
              stroke="#71717a" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip content={<CustomTooltip unit={currentConfig.unit} />} />
            
            <Area 
              type="monotone" 
              dataKey={currentConfig.key} 
              name={currentConfig.label} 
              stroke={currentConfig.stroke} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#${currentConfig.gradientId})`}
              animationDuration={800}
              dot={{ r: 4, stroke: currentConfig.stroke, strokeWidth: 2, fill: '#ffffff' }}
              activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2, fill: currentConfig.stroke }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default WaterQualityChart;
