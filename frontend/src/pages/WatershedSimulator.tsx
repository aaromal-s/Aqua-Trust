import { useState, useEffect } from 'react';
import { 
  Waves, 
  ShieldAlert, 
  Clock, 
  Sliders, 
  Play, 
  Pause, 
  RotateCcw, 
  Compass 
} from 'lucide-react';
import { runSimulation, type SimulationResult } from '../services/simulatorService';

export const WatershedSimulatorPage = () => {
  const [projectionHours, setProjectionHours] = useState(14);
  const [isPlaying, setIsPlaying] = useState(false);
  const [spillType, setSpillType] = useState<'HEAVY_METALS_EFFLUENT' | 'MONSOON_AGRICULTURAL_RUNOFF' | 'TEXTILE_DYE_SURGE'>('HEAVY_METALS_EFFLUENT');
  const [initialConcentration, setInitialConcentration] = useState(340);
  const [flowVelocity, setFlowVelocity] = useState(1.3); // m/s
  
  // Countermeasure Toggles
  const [gateDiversion, setGateDiversion] = useState(false);
  const [aeratorsActive, setAeratorsActive] = useState(false);
  const [intakeLock, setIntakeLock] = useState(false);

  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const recalculate = async () => {
    const result = await runSimulation({
      spillType,
      initialConcentrationPpm: initialConcentration,
      riverFlowVelocityMps: flowVelocity,
      interventionGateDiversion: gateDiversion,
      interventionAeratorsActive: aeratorsActive,
      interventionIntakeLock: intakeLock,
      projectionHours
    });
    setSimResult(result);
  };

  useEffect(() => {
    recalculate();
  }, [projectionHours, spillType, initialConcentration, flowVelocity, gateDiversion, aeratorsActive, intakeLock]);

  // Animation player loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProjectionHours(prev => {
        if (prev >= 48) {
          setIsPlaying(false);
          return 48;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePreset = (type: 'HEAVY_METALS_EFFLUENT' | 'MONSOON_AGRICULTURAL_RUNOFF' | 'TEXTILE_DYE_SURGE') => {
    setSpillType(type);
    if (type === 'HEAVY_METALS_EFFLUENT') {
      setInitialConcentration(380);
      setFlowVelocity(1.4);
    } else if (type === 'MONSOON_AGRICULTURAL_RUNOFF') {
      setInitialConcentration(220);
      setFlowVelocity(2.1);
    } else {
      setInitialConcentration(450);
      setFlowVelocity(1.1);
    }
    setProjectionHours(6);
  };

  const stations = simResult?.stations || [];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--background)]">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Watershed Contamination Simulator</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Sutlej-Malwa Hydrology Model
              </span>
            </div>
            <p className="text-xs text-zinc-500">Hydrodynamic plume trajectory tracking from Budha Nullah down to Harike Wetland & Malwa Canals</p>
          </div>
        </div>

        {/* Animation Playback Controls */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isPlaying ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-zinc-800 shadow-sm hover:bg-zinc-50'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Projection' : 'Play Timeline'}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setProjectionHours(0);
            }}
            className="p-2 rounded-xl text-zinc-600 hover:bg-white transition-colors"
            title="Reset to T+0h"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="px-3 py-1 rounded-xl bg-white border border-zinc-200 text-xs font-mono font-bold text-zinc-800">
            T + {projectionHours}h Projection
          </div>
        </div>
      </header>

      {/* Advisory Banner */}
      {simResult && (
        <div className={`mx-6 mt-4 p-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
          simResult.stations.some(s => s.intakeShutdownRecommended)
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{simResult.safetyAdvisory}</span>
          </div>
          <span className="text-[11px] font-mono uppercase bg-white/70 px-2 py-0.5 rounded-lg border border-black/5">
            Plume Front: {simResult.plumeFrontPositionKm} km downstream
          </span>
        </div>
      )}

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* Interactive Controls & Scenario Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline & Flow Slider */}
          <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Dispersion Timeline Scrubber (0 to 48 Hours)
              </label>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                T + {projectionHours} Hours ({Math.round(projectionHours * flowVelocity * 3.6)} km traveled)
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="48"
              step="1"
              value={projectionHours}
              onChange={(e) => {
                setIsPlaying(false);
                setProjectionHours(parseInt(e.target.value));
              }}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-zinc-200 rounded-lg"
            />

            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
              <span>0h (Discharge Point)</span>
              <span>12h (Sutlej River)</span>
              <span>24h (Harike Wetland)</span>
              <span>36h (Sirhind Feeder)</span>
              <span>48h (Malwa Aquifers)</span>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500">Scenario Presets:</span>
              <button
                onClick={() => handlePreset('HEAVY_METALS_EFFLUENT')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  spillType === 'HEAVY_METALS_EFFLUENT' ? 'bg-zinc-900 text-white shadow-sm' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Industrial Heavy Metals (380 ppm)
              </button>
              <button
                onClick={() => handlePreset('MONSOON_AGRICULTURAL_RUNOFF')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  spillType === 'MONSOON_AGRICULTURAL_RUNOFF' ? 'bg-zinc-900 text-white shadow-sm' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Monsoon Runoff Surge (220 ppm)
              </button>
              <button
                onClick={() => handlePreset('TEXTILE_DYE_SURGE')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  spillType === 'TEXTILE_DYE_SURGE' ? 'bg-zinc-900 text-white shadow-sm' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Textile Dyeing Acid Sludge (450 ppm)
              </button>
            </div>
          </div>

          {/* Emergency Countermeasures Console */}
          <div className="card !p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" /> Active Intervention Controls
            </h3>
            <p className="text-[11px] text-zinc-500">Engage hydraulic barriers and treatment cascades to suppress downstream plume toxicity:</p>

            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:bg-blue-50/50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-zinc-800 block">Canal Sluice Diversion</span>
                  <span className="text-[10px] text-zinc-500">Diverts 65% volume away from canals</span>
                </div>
                <input
                  type="checkbox"
                  checked={gateDiversion}
                  onChange={(e) => setGateDiversion(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:bg-blue-50/50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-zinc-800 block">Bio-Oxidation Aerators</span>
                  <span className="text-[10px] text-zinc-500">Activates wetland surface aeration (-35% COD)</span>
                </div>
                <input
                  type="checkbox"
                  checked={aeratorsActive}
                  onChange={(e) => setAeratorsActive(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer hover:bg-blue-50/50 transition-colors">
                <div>
                  <span className="text-xs font-bold text-zinc-800 block">Municipal Intake Lock</span>
                  <span className="text-[10px] text-zinc-500">Isolates domestic drinking pumps</span>
                </div>
                <input
                  type="checkbox"
                  checked={intakeLock}
                  onChange={(e) => setIntakeLock(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Watershed Schematic & Particle Vector View */}
        <div className="card !p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold tracking-tight">Downstream Hydrology Flow Vector: Sutlej River to Malwa Canal Basin</h3>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-white/10 px-2.5 py-1 rounded-lg">
              River Velocity: {flowVelocity} m/s (~{(flowVelocity * 3.6).toFixed(1)} km/h)
            </span>
          </div>

          {/* Interactive Flow Diagram with Stations */}
          <div className="relative py-12 px-4">
            {/* River Flow Line */}
            <div className="absolute top-1/2 left-6 right-6 h-3 bg-indigo-900/60 rounded-full -translate-y-1/2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (projectionHours / 36) * 100)}%` }}
              />
            </div>

            {/* Station Nodes */}
            <div className="relative flex justify-between items-center z-10">
              {stations.map((st, idx) => {
                const isReached = projectionHours >= st.travelTimeHours;
                const isHigh = st.predictedToxicity > 50;

                return (
                  <div key={st.id} className="flex flex-col items-center group max-w-[140px] text-center">
                    {/* Node Dot */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
                      !isReached 
                        ? 'bg-slate-800 border-slate-600 text-slate-400' 
                        : isHigh 
                        ? 'bg-rose-600 border-white text-white animate-bounce' 
                        : 'bg-emerald-600 border-white text-white'
                    }`}>
                      <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                    </div>

                    {/* Station Name & Metrics */}
                    <div className="mt-3 space-y-0.5">
                      <span className="text-[11px] font-bold text-white block leading-tight">{st.name.split(' (')[0]}</span>
                      <span className="text-[10px] font-mono text-indigo-300 block">{st.distanceKm} km • ETA: {st.arrivalETA}</span>
                      
                      <div className="pt-1">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          !isReached 
                            ? 'bg-white/10 text-slate-400' 
                            : isHigh 
                            ? 'bg-rose-500/80 text-white' 
                            : 'bg-emerald-500/80 text-white'
                        }`}>
                          {st.predictedToxicity} mg/L
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Station Detailed Status Grid */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Monitoring Nodes Telemetry & Protection Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stations.map(st => {
              const reached = projectionHours >= st.travelTimeHours;
              const critical = st.predictedToxicity > 50;

              return (
                <div key={st.id} className={`card !p-4 bg-white border rounded-2xl shadow-sm transition-all ${
                  critical ? 'border-rose-300 ring-1 ring-rose-200' : 'border-zinc-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-zinc-400">{st.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      !reached ? 'bg-zinc-100 text-zinc-600' :
                      critical ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {!reached ? 'WAITING' : critical ? 'HAZARD PLUME' : 'NORMAL'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-900 leading-tight mb-1">{st.name}</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mb-3">Dist: {st.distanceKm} km • Flow: {st.travelTimeHours}h</p>

                  <div className="space-y-1.5 text-xs pt-2 border-t border-zinc-100">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Plume ETA:</span>
                      <span className="font-mono font-bold text-zinc-800">{st.arrivalETA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Toxicity Load:</span>
                      <span className={`font-mono font-bold ${critical ? 'text-rose-600' : 'text-zinc-800'}`}>
                        {st.predictedToxicity} mg/L
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-zinc-500">Intake Gate:</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        st.intakeStatus === 'SHUTDOWN_LOCKED' ? 'bg-rose-100 text-rose-800' :
                        st.intakeStatus === 'DIVERTIED' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {st.intakeStatus}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WatershedSimulatorPage;
