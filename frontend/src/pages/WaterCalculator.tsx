import { useState } from 'react';
import { Calculator, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export const WaterCalculator = () => {
  const [people, setPeople] = useState(3);
  const [showerMinutes, setShowerMinutes] = useState(10);
  const [lawnWateringDays, setLawnWateringDays] = useState(2);
  const [fixtureAge, setFixtureAge] = useState<'modern' | 'older'>('older');
  const [laundryLoads, setLaundryLoads] = useState(4);

  // Calculations
  const gpf = fixtureAge === 'modern' ? 1.28 : 3.5;
  const showerGpm = fixtureAge === 'modern' ? 1.8 : 2.5;

  const dailyShowerGallons = people * showerMinutes * showerGpm;
  const dailyToiletGallons = people * 4 * gpf;
  const dailyLawnGallons = (lawnWateringDays * 120) / 7;
  const dailyLaundryGallons = (laundryLoads * (fixtureAge === 'modern' ? 14 : 35)) / 7;
  const dailyKitchenTapGallons = people * 8;

  const totalDailyGallons = Math.round(dailyShowerGallons + dailyToiletGallons + dailyLawnGallons + dailyLaundryGallons + dailyKitchenTapGallons);
  const totalMonthlyGallons = totalDailyGallons * 30;
  const totalMonthlyLiters = Math.round(totalMonthlyGallons * 3.78541);
  const estimatedMonthlyBill = Math.round((totalMonthlyGallons / 1000) * 11.5); // ~$11.50 per 1k gal avg
  const potentialSavings = fixtureAge === 'older' ? Math.round(estimatedMonthlyBill * 0.32) : Math.round(estimatedMonthlyBill * 0.12);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel border-b border-zinc-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-zinc-900">Household Water Footprint & Leak Calculator</h2>
        </div>
        <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          Citizen Conservation Tool
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-5xl space-y-8">
          
          {/* Top Hero Banner */}
          <div className="card !p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-blue-100 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3" /> Save Water & Utility Costs
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">Understand Your Family's Water Impact</h3>
              <p className="text-xs md:text-sm text-blue-100 max-w-lg leading-relaxed">
                Adjust the sliders below to calculate your household's monthly usage, compare against the regional benchmark, and detect hidden leaks.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
              <div className="text-right">
                <span className="text-xs text-blue-200 uppercase font-bold block">Estimated Monthly Use</span>
                <span className="text-2xl font-bold text-white">{totalMonthlyGallons.toLocaleString()} gal</span>
                <span className="text-[11px] text-blue-200 block">({totalMonthlyLiters.toLocaleString()} L)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Calculator Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Sliders Card */}
              <div className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-6">
                
                {/* 1. People in Home */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Household Residents
                    </label>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {people} People
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={people}
                    onChange={(e) => setPeople(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                    <span>1 Person</span>
                    <span>4 People</span>
                    <span>8+ People</span>
                  </div>
                </div>

                {/* 2. Shower Duration */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Average Shower Duration
                    </label>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {showerMinutes} Minutes / person
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="25"
                    value={showerMinutes}
                    onChange={(e) => setShowerMinutes(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                    <span>4 mins (Quick)</span>
                    <span>12 mins (Avg)</span>
                    <span>25 mins (Long)</span>
                  </div>
                </div>

                {/* 3. Fixtures Age */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
                    Plumbing & Toilet Fixture Age
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFixtureAge('modern')}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        fixtureAge === 'modern'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      Modern (Post-2010 Low-Flow)
                      <span className="block text-[10px] text-zinc-400 font-normal mt-0.5">1.28 gal/flush, aerated showers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFixtureAge('older')}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        fixtureAge === 'older'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      Standard / Older Fixtures
                      <span className="block text-[10px] text-zinc-400 font-normal mt-0.5">3.5 gal/flush older commodes</span>
                    </button>
                  </div>
                </div>

                {/* 4. Lawn & Garden */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Lawn / Outdoor Irrigation
                    </label>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {lawnWateringDays} Days / week
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="7"
                    value={lawnWateringDays}
                    onChange={(e) => setLawnWateringDays(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                    <span>No Lawn / None</span>
                    <span>2-3 Days</span>
                    <span>Daily Sprinklers</span>
                  </div>
                </div>

                {/* 5. Laundry Loads */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Washing Machine Loads
                    </label>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {laundryLoads} Loads / week
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={laundryLoads}
                    onChange={(e) => setLaundryLoads(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

              </div>

            </div>

            {/* Results & Leak Detection (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Financial & Benchmark Impact Card */}
              <div className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-5">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Monthly Consumption Breakdown
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Est. Monthly Bill</span>
                    <span className="text-2xl font-bold text-zinc-900">${estimatedMonthlyBill}</span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5">Municipal water & sewer</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">Potential Savings</span>
                    <span className="text-2xl font-bold text-emerald-700">${potentialSavings}/mo</span>
                    <span className="text-[10px] text-emerald-800 block mt-0.5">With low-flow aerators</span>
                  </div>
                </div>

                {/* Benchmark Rating */}
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-800">Regional City Average Comparison:</span>
                    <span className="text-xs font-bold text-emerald-600">
                      {totalDailyGallons < people * 65 ? '18% Below Average (Efficient)' : '12% Above Average'}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${totalDailyGallons < people * 65 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, Math.round((totalDailyGallons / (people * 85)) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2">
                    Target baseline for a family of {people} is approx. {people * 55 * 30} gallons/month.
                  </p>
                </div>
              </div>

              {/* Silent Toilet Flapper Leak Test Card */}
              <div className="card !p-6 bg-amber-50/50 border border-amber-200 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>The 15-Minute Silent Leak Test</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  A silently leaking toilet flapper can waste up to <strong>200 gallons per day</strong> without making a sound.
                </p>

                <div className="space-y-2 pt-1 text-xs text-amber-900">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Drop 4-5 drops of dark food coloring into the toilet tank.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Wait 15 minutes without flushing.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>If color seeps into the bowl, replace the $5 rubber flapper immediately.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
export default WaterCalculator;
