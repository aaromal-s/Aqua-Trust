import { BrainCircuit, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

const insights = [
  {
    id: 1,
    type: 'anomaly',
    title: 'Turbidity Spike Detected',
    description: 'Turbidity has increased 34% compared with the recent baseline at Station AQ-014. The monitoring station has been flagged for further observation.',
    location: 'Lake East',
    confidence: 94,
    time: '2h ago',
    icon: <AlertTriangle className="text-yellow-400" />
  },
  {
    id: 2,
    type: 'prediction',
    title: 'Algal Bloom Risk Warning',
    description: 'Based on rising temperatures (28°C) and elevated nutrient levels (Nitrate: 4.2mg/L), there is an 82% probability of an algal bloom developing in the next 72 hours in the Estuary South region.',
    location: 'Estuary South',
    confidence: 82,
    time: '5h ago',
    icon: <TrendingUp className="text-orange-400" />
  },
  {
    id: 3,
    type: 'insight',
    title: 'Water Quality Stabilization',
    description: 'Following recent rainfall, the pH levels in River North have stabilized back to the normal baseline (7.2). Dissolved Oxygen is steadily increasing.',
    location: 'River North',
    confidence: 98,
    time: '12h ago',
    icon: <Lightbulb className="text-blue-400" />
  }
];

const AquaIntelligence = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      <header className="h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" /> Aqua Intelligence
        </h2>
        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          AI ENGINE ACTIVE
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Intro */}
        <div className="card mb-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Intelligent Interpretation Engine</h3>
              <p className="text-gray-400 max-w-3xl">
                Aqua Intelligence continuously analyzes raw sensor data to identify anomalies, predict future environmental risks (like algal blooms), and translate complex chemical parameters into actionable insights.
              </p>
            </div>
          </div>
        </div>

        {/* AI Insights Feed */}
        <h3 className="font-semibold mb-4 text-lg">Recent AI Insights</h3>
        <div className="grid gap-4">
          {insights.map((insight) => (
            <div key={insight.id} className="card p-5 hover:bg-white/5 transition-colors border-l-4 border-l-purple-500 cursor-pointer group">
              <div className="flex gap-4">
                <div className="mt-1">{insight.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-semibold text-lg">{insight.title}</h4>
                    <span className="text-xs text-gray-500">{insight.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="px-2.5 py-1 bg-white/5 rounded text-gray-300">
                      Location: <span className="text-white">{insight.location}</span>
                    </span>
                    <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded">
                      Confidence: {insight.confidence}%
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Source Data <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AquaIntelligence;
