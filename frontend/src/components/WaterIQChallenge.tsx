import { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GlassOption {
  id: string;
  name: string;
  look: string;
  bgGradient: string;
  liquidColor: string;
  isUnsafe: boolean;
  verdict: string;
  verdictColor: string;
  explanation: string;
  tip: string;
}

const glasses: GlassOption[] = [
  {
    id: 'glass-a',
    name: 'Glass A',
    look: 'Cloudy / Milky White',
    bgGradient: 'from-blue-50 to-slate-100',
    liquidColor: 'bg-white/70 border-white',
    isUnsafe: false,
    verdict: 'SURPRISE: 100% Pure & Safe!',
    verdictColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    explanation: 'Most people think cloudy water is toxic, but it is almost always entrained micro-air bubbles trapped by pressurized cold pipes. Fill a cup and watch it clear from the bottom up in 60 seconds.',
    tip: 'Harmless dissolved atmospheric air.'
  },
  {
    id: 'glass-b',
    name: 'Glass B',
    look: 'Crystal Clear & Sparkling',
    bgGradient: 'from-cyan-50 to-blue-50',
    liquidColor: 'bg-cyan-200/30 border-cyan-300',
    isUnsafe: true,
    verdict: 'CRITICAL TRAP: Highly Hazardous!',
    verdictColor: 'text-rose-700 bg-rose-50 border-rose-200',
    explanation: 'The deadliest water contaminants—including Lead (45 ppb), Arsenic, and PFAS "forever chemicals"—are completely colorless, odorless, and tasteless. Never trust clarity alone!',
    tip: 'Requires digital spectrophotometry & IoT telemetry.'
  },
  {
    id: 'glass-c',
    name: 'Glass C',
    look: 'Faint Amber / Yellow Tint',
    bgGradient: 'from-amber-50 to-yellow-50',
    liquidColor: 'bg-amber-300/40 border-amber-400',
    isUnsafe: false,
    verdict: 'MODERATE: Oxidized Iron (Rust)',
    verdictColor: 'text-amber-800 bg-amber-50 border-amber-200',
    explanation: 'Usually caused by mineral rust flaking inside older municipal cast-iron service conduits. Non-toxic in small amounts, but requires flushing cold tap for 90 seconds until clear.',
    tip: 'Flush line before filling pots or kettles.'
  }
];

export const WaterIQChallenge = () => {
  const [selectedGlass, setSelectedGlass] = useState<GlassOption | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (glass: GlassOption) => {
    setSelectedGlass(glass);
    if (glass.isUnsafe) {
      setScore(100); // Found the real hazard!
    } else {
      setScore(40);
    }
  };

  const handleReset = () => {
    setSelectedGlass(null);
    setScore(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <div className="card !p-8 bg-white border border-zinc-200/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Challenge Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> 15-Second Interactive Water IQ
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            Can You Spot Which Water Glass is Actually Unsafe?
          </h3>
          <p className="text-xs md:text-sm text-zinc-500 mt-2">
            Click on the glass you believe poses the biggest immediate health hazard to your family:
          </p>
        </div>

        {/* 3 Glasses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {glasses.map((glass) => {
            const isSelected = selectedGlass?.id === glass.id;
            return (
              <div
                key={glass.id}
                onClick={() => handleSelect(glass)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center group relative overflow-hidden ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/30 shadow-lg scale-102'
                    : 'border-zinc-200 hover:border-blue-300 hover:bg-zinc-50/50 bg-white'
                }`}
              >
                {/* Simulated Glass */}
                <div className="w-24 h-36 border-2 border-zinc-300 rounded-b-2xl rounded-t-sm relative p-1.5 flex flex-col justify-end mb-4 group-hover:scale-105 transition-transform bg-white/40 shadow-inner">
                  <div className={`w-full h-24 rounded-b-xl border transition-all ${glass.liquidColor}`} />
                  {/* Glass rim reflection */}
                  <div className="absolute top-1 left-2 right-2 h-1 bg-white/80 rounded-full" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                  {glass.name}
                </span>
                <h4 className="text-base font-bold text-zinc-900 mb-1">{glass.look}</h4>
                <span className="text-[11px] text-zinc-400">{glass.tip}</span>

                <button
                  type="button"
                  className={`mt-4 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-700 group-hover:bg-zinc-200'
                  }`}
                >
                  {isSelected ? 'Tested & Inspected' : 'Inspect This Glass'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Reveal Results Box */}
        {selectedGlass && (
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 animate-spring-up space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${selectedGlass.verdictColor}`}>
                  {selectedGlass.verdict}
                </span>
                {score === 100 ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> You're a Hydrology Expert! (+100 Pts)
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Appearance Can Be Deceiving!
                  </span>
                )}
              </div>

              <button
                onClick={handleReset}
                className="text-xs text-zinc-500 hover:text-zinc-900 font-semibold flex items-center gap-1 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try Another Glass
              </button>
            </div>

            <p className="text-xs md:text-sm text-zinc-700 leading-relaxed font-medium">
              {selectedGlass.explanation}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-zinc-500">
                Notice weird tap water in your home? Diagnose it in 4 clicks:
              </span>
              <Link
                to="/doctor"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Open AI Tap Doctor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default WaterIQChallenge;
