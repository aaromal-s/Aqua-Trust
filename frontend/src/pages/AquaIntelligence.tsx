import { useState } from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, X, CheckCircle2, Activity, Sparkles } from 'lucide-react';

interface AIInsight {
  id: number;
  type: 'anomaly' | 'prediction' | 'insight';
  title: string;
  description: string;
  location: string;
  confidence: number;
  time: string;
  sensorId: string;
  telemetry: {
    pH: number;
    turbidity: number;
    dissolvedOxygen: number;
    temp: number;
  };
}

const insights: AIInsight[] = [
  {
    id: 1,
    type: 'anomaly',
    title: 'Catchment Silt Surge Detected',
    description: 'Turbidity has increased 34% compared with the 7-day rolling baseline at Station AQ-CHD-01. Sukhna Lake Northern Catchment has been flagged for sediment settling review.',
    location: 'Sukhna Lake (Sector 1, Chandigarh)',
    confidence: 94,
    time: '2h ago',
    sensorId: 'AQ-CHD-01',
    telemetry: { pH: 6.8, turbidity: 5.4, dissolvedOxygen: 6.2, temp: 22.4 }
  },
  {
    id: 2,
    type: 'prediction',
    title: 'Industrial Effluent Risk Warning',
    description: 'Based on rising conductivity and chemical oxygen demand in Budha Nullah (Ludhiana), there is an 88% probability of severe oxygen depletion reaching the Sutlej river confluence within the next 48 hours.',
    location: 'Budha Nullah (Ludhiana / Sutlej Confluence)',
    confidence: 88,
    time: '5h ago',
    sensorId: 'AQ-LUD-01',
    telemetry: { pH: 5.1, turbidity: 24.2, dissolvedOxygen: 2.1, temp: 26.5 }
  },
  {
    id: 3,
    type: 'insight',
    title: 'Kajauli Supply Line Stabilization',
    description: 'Following regulated discharge from Bhakra Main Line, water chemistry at Kajauli Waterworks Phase 3 & 4 has stabilized back to optimal drinking baseline (pH 7.3, TDS 184 ppm).',
    location: 'Kajauli Waterworks (Sector 39 Grid)',
    confidence: 98,
    time: '12h ago',
    sensorId: 'AQ-CHD-02',
    telemetry: { pH: 7.3, turbidity: 0.9, dissolvedOxygen: 7.8, temp: 21.2 }
  }
];

export const AquaIntelligence = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'anomaly' | 'prediction' | 'insight'>('all');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const filteredInsights = selectedFilter === 'all'
    ? insights
    : insights.filter(i => i.type === selectedFilter);

  const handleDispatch = (insight: AIInsight) => {
    setDispatchStatus(`Remediation advisory dispatched for ${insight.sensorId} (${insight.location}). Field task force notified.`);
    setTimeout(() => setDispatchStatus(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel border-b border-zinc-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">Aqua Intelligence Engine</h2>
            <p className="text-[11px] text-zinc-500 font-medium">Predictive Hydrology & Neural Anomaly Detection</p>
          </div>
        </div>

        <div className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          NEURAL INGEST LIVE
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Intro Hero */}
        <div className="card !p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-2xl relative overflow-hidden shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <BrainCircuit className="w-7 h-7 text-indigo-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-1">
                <Sparkles className="w-3 h-3" /> Machine Learning Water Quality Diagnostics
              </div>
              <h3 className="text-xl font-bold mb-1">Algorithmic Hydrology Synthesis</h3>
              <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed">
                Aqua Intelligence continuously runs Bayesian probability models over raw telemetry packets to forecast toxic chemical blooms, identify sudden pipeline pressure drops, and translate complex biochemical data into plain English.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              All Signals ({insights.length})
            </button>
            <button
              onClick={() => setSelectedFilter('anomaly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'anomaly' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Catchment Anomalies
            </button>
            <button
              onClick={() => setSelectedFilter('prediction')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'prediction' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Risk Predictions
            </button>
            <button
              onClick={() => setSelectedFilter('insight')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'insight' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Stabilizations
            </button>
          </div>
        </div>

        {/* AI Insights Feed */}
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <div 
              key={insight.id} 
              onClick={() => setSelectedInsight(insight)}
              className="card !p-5 bg-white border border-zinc-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                  {insight.type === 'anomaly' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                   insight.type === 'prediction' ? <TrendingUp className="w-5 h-5 text-rose-600" /> :
                   <Lightbulb className="w-5 h-5 text-blue-600" />}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                      {insight.title}
                    </h4>
                    <span className="text-xs text-zinc-400">{insight.time}</span>
                  </div>

                  <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                    {insight.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-lg text-zinc-700 font-medium">
                      Sensor: <strong className="font-mono text-zinc-900">{insight.sensorId}</strong> ({insight.location})
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200">
                      Confidence: {insight.confidence}%
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInsight(insight);
                      }}
                      className="ml-auto text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Inspect Source Telemetry <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal: Telemetry Breakdown & Source Data */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-zinc-900">Telemetry Assay Diagnostics</h3>
              </div>
              <button onClick={() => setSelectedInsight(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {dispatchStatus && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{dispatchStatus}</span>
              </div>
            )}

            <div>
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Node {selectedInsight.sensorId}
              </span>
              <h4 className="text-sm font-bold text-zinc-900 mt-1">{selectedInsight.location}</h4>
              <p className="text-xs text-zinc-500 mt-1">{selectedInsight.description}</p>
            </div>

            {/* Matrix of Sensor Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">pH Level</span>
                <span className="text-lg font-bold font-mono text-zinc-900">{selectedInsight.telemetry.pH}</span>
                <span className="text-[10px] text-zinc-500 block">Baseline: 7.2</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Turbidity</span>
                <span className="text-lg font-bold font-mono text-zinc-900">{selectedInsight.telemetry.turbidity} NTU</span>
                <span className="text-[10px] text-zinc-500 block">Max: 4.0</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Dissolved O2</span>
                <span className="text-lg font-bold font-mono text-zinc-900">{selectedInsight.telemetry.dissolvedOxygen} mg/L</span>
                <span className="text-[10px] text-zinc-500 block">Min: 5.0</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Water Temp</span>
                <span className="text-lg font-bold font-mono text-zinc-900">{selectedInsight.telemetry.temp}°C</span>
                <span className="text-[10px] text-zinc-500 block">Ambient: 24°</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDispatch(selectedInsight)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Activity className="w-3.5 h-3.5" /> Dispatch Field Notice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AquaIntelligence;
