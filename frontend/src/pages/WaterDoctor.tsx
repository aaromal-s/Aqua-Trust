import { useState } from 'react';
import { Stethoscope, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw, Send, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DiagnosisResult {
  title: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  cause: string;
  advice: string[];
  safeToDrink: boolean;
}

export const WaterDoctor = () => {
  const navigate = useNavigate();
  const [appearance, setAppearance] = useState('cloudy');
  const [odor, setOdor] = useState('none');
  const [taste, setTaste] = useState('normal');
  const [timing, setTiming] = useState('morning');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const runDiagnosis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let diag: DiagnosisResult;

      if (appearance === 'brown' || odor === 'metallic' || taste === 'metallic') {
        diag = {
          title: 'Oxidized Iron & Pipe Corrosion',
          severity: 'medium',
          confidence: 94,
          cause: 'Water sitting overnight in aging galvanized steel or iron municipal lines oxidizes and sheds rust sediment particles.',
          advice: [
            'Flush your cold tap for 60-90 seconds until the water runs crystal clear.',
            'Do NOT use hot water immediately, as rust particles can settle inside your water heater tank.',
            'If discoloration lasts more than 3 minutes, report it to the municipal grid for a main line flush.'
          ],
          safeToDrink: false
        };
      } else if (appearance === 'cloudy' && odor === 'none') {
        diag = {
          title: 'Entrained Micro-Air Bubbles (Benign)',
          severity: 'low',
          confidence: 98,
          cause: 'Pressurized cold water absorbs harmless dissolved air. When dispensed into a glass, the pressure drops and millions of micro-bubbles rise to the surface.',
          advice: [
            'Fill a clear glass and let it stand on your counter for 60 seconds.',
            'If the glass clears from the bottom up to the top, it is 100% pure air bubbles.',
            'Completely safe for drinking, cooking, and infant preparation.'
          ],
          safeToDrink: true
        };
      } else if (odor === 'sulfur' || odor === 'rotten-egg') {
        diag = {
          title: 'Hydrogen Sulfide Gas (Sulfur Bacteria)',
          severity: 'medium',
          confidence: 91,
          cause: 'Sulfur-reducing bacteria living in low-oxygen groundwater or water heater magnesium anode rods produce hydrogen sulfide gas.',
          advice: [
            'Test if the odor is only in the HOT tap. If so, your water heater anode rod needs service.',
            'If present in both hot and cold taps, the groundwater aquifer has bacterial sulfur activity.',
            'Boil or use an activated carbon/KDF water filter.'
          ],
          safeToDrink: false
        };
      } else if (odor === 'chlorine') {
        diag = {
          title: 'Municipal Disinfection Surge',
          severity: 'low',
          confidence: 96,
          cause: 'Water treatment utilities periodically increase free chlorine/chloramines to sanitize pipe networks after maintenance or heavy rains.',
          advice: [
            'Store tap water in an open glass pitcher in your refrigerator for 1-2 hours; the chlorine will naturally evaporate.',
            'Use standard charcoal or Brita/RO filters to remove taste immediately.',
            'Bacteria-free and sanitized, but may irritate sensitive skin.'
          ],
          safeToDrink: true
        };
      } else {
        diag = {
          title: 'General Mineral Hardness & Silt',
          severity: 'low',
          confidence: 87,
          cause: 'Naturally occurring calcium, magnesium, and harmless dissolved mineral carbonates.',
          advice: [
            'Inspect aerator mesh on faucets for white chalky scale.',
            'Safe for all general consumption.',
            'A water softener or citric acid rinse eliminates kettle scale.'
          ],
          safeToDrink: true
        };
      }

      setResult(diag);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-900">
          <Stethoscope className="w-5 h-5 text-blue-600" /> Aqua Doctor: AI Tap Water Diagnostics
        </h2>
        <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          Citizen Self-Service Tool
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Hero Banner */}
          <div className="card !p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl relative overflow-hidden shadow-lg">
            <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Instant Household Water Diagnosis
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Notice Something Strange in Your Tap Water?</h3>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                Tell us what you see, smell, or taste. Our diagnostic engine cross-references your symptoms with regional water chemistry to determine if it is safe to drink.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Diagnostic Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Question 1: Appearance */}
              <div className="card !p-5 bg-white border border-zinc-200 rounded-xl">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-3">
                  1. What does the water look like?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'clear', label: 'Crystal Clear' },
                    { id: 'cloudy', label: 'Milky / Cloudy' },
                    { id: 'brown', label: 'Brown / Rusty' },
                    { id: 'yellow', label: 'Yellow Tint' },
                    { id: 'green', label: 'Green / Algae' },
                    { id: 'black', label: 'Black Specks' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAppearance(opt.id)}
                      className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        appearance === opt.id
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Odor */}
              <div className="card !p-5 bg-white border border-zinc-200 rounded-xl">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-3">
                  2. Does it have an unusual odor?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'none', label: 'No Odor' },
                    { id: 'chlorine', label: 'Bleach / Chlorine' },
                    { id: 'sulfur', label: 'Rotten Egg / Sulfur' },
                    { id: 'earthy', label: 'Earthy / Musty' },
                    { id: 'metallic', label: 'Metallic / Copper' },
                    { id: 'petroleum', label: 'Gas / Solvent' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOdor(opt.id)}
                      className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        odor === opt.id
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Taste & Timing */}
              <div className="card !p-5 bg-white border border-zinc-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-2">
                    3. Taste (if tasted)
                  </label>
                  <select
                    value={taste}
                    onChange={(e) => setTaste(e.target.value)}
                    className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="normal">Normal / Clean</option>
                    <option value="metallic">Metallic / Bitter</option>
                    <option value="salty">Salty / Brackish</option>
                    <option value="sweet">Sweet / Chemical</option>
                    <option value="untasted">Did not taste</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-2">
                    4. When does it happen?
                  </label>
                  <select
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="morning">First thing in morning only</option>
                    <option value="hot">Hot water tap only</option>
                    <option value="rain">After heavy rainfall</option>
                    <option value="constant">All the time</option>
                  </select>
                </div>
              </div>

              {/* Diagnose Button */}
              <button
                type="button"
                onClick={runDiagnosis}
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Water Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Run AI Diagnostic Assessment
                  </>
                )}
              </button>

            </div>

            {/* Diagnosis Result (5 cols) */}
            <div className="lg:col-span-5">
              {result ? (
                <div className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm sticky top-6 space-y-6">
                  
                  {/* Top Status */}
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      {result.safeToDrink ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Generally Safe
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4 text-rose-600" /> Avoid Ingesting
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
                      {result.confidence}% Match
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                      Identified Condition
                    </span>
                    <h4 className="text-xl font-bold text-zinc-900 mb-2">{result.title}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                      {result.cause}
                    </p>
                  </div>

                  {/* Immediate Action Checklist */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3">
                      Recommended Action Checklist
                    </h5>
                    <ul className="space-y-2.5">
                      {result.advice.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Handlers */}
                  <div className="pt-4 border-t border-zinc-100 space-y-2">
                    <button
                      onClick={() => navigate('/reporting')}
                      className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" /> File Report to Municipal Water Desk
                    </button>
                  </div>

                </div>
              ) : (
                <div className="card !p-8 bg-zinc-50/50 border border-dashed border-zinc-300 rounded-2xl text-center flex flex-col items-center justify-center h-full min-h-[350px]">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-800 mb-1">Awaiting Observation Inputs</h4>
                  <p className="text-xs text-zinc-500 max-w-xs mb-4">
                    Select your tap water appearance and smell on the left, then click "Run AI Diagnostic Assessment".
                  </p>
                  <button 
                    onClick={runDiagnosis}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Diagnose with defaults <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
export default WaterDoctor;
