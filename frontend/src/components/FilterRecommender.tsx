import { useState } from 'react';
import { Filter, CheckCircle2, Info, Sparkles } from 'lucide-react';

interface FilterOption {
  name: string;
  category: string;
  bestFor: string;
  costRange: string;
  replacementCycle: string;
  removes: string[];
  limitations: string;
  recommended: boolean;
}

export const FilterRecommender = () => {
  const [source, setSource] = useState<'city' | 'well' | 'rain'>('city');
  const [primaryConcern, setPrimaryConcern] = useState<'chlorine' | 'tds' | 'lead' | 'hardness' | 'bacteria'>('chlorine');
  const [budget, setBudget] = useState<'pitcher' | 'undersink' | 'wholehouse'>('undersink');

  const getRecommendation = (): FilterOption => {
    if (primaryConcern === 'tds' || primaryConcern === 'lead') {
      return {
        name: 'Multi-Stage Reverse Osmosis (RO) with Copper & Alkaline Remineralization',
        category: 'Under-Sink High Purity System',
        bestFor: 'High dissolved solids (TDS > 250 ppm common across Punjab & Malwa groundwater), heavy metals, agricultural nitrates, and fluorides.',
        costRange: '₹12,000 – ₹18,000 (Standard Tricity installation)',
        replacementCycle: 'Pre-filters: 6 months | RO Membrane: 24 months',
        removes: ['99.4% Heavy Metals (Lead, Arsenic, Uranium trace)', '98% Total Dissolved Solids (TDS)', '99.9% Microplastics', 'Chlorine & Chloramines'],
        limitations: 'Produces wastewater ratio (reusable for mopping and gardening); remineralizer cartridge recommended for natural sweet taste.',
        recommended: true
      };
    } else if (primaryConcern === 'hardness') {
      return {
        name: 'Dual-Tank Ion-Exchange Water Softener + Carbon Pre-Filter',
        category: 'Point-of-Entry Whole House Appliance',
        bestFor: 'Chalky white mineral scale in geysers, ruined bathroom fittings, and dry skin/hair from excess calcium and magnesium salts.',
        costRange: '₹28,000 – ₹45,000',
        replacementCycle: 'Add salt pellets monthly | Resin bed: 8–10 years',
        removes: ['100% Calcium Carbonate (Scale)', 'Magnesium Hardness', 'Iron (up to 2 ppm)'],
        limitations: 'Softens water for all household taps, but does not remove chemical contaminants or heavy metals on its own.',
        recommended: true
      };
    } else if (primaryConcern === 'bacteria' || source === 'well') {
      return {
        name: 'Ultrafiltration (UF) + 254nm Ultraviolet (UV) Germicidal Core',
        category: 'Bio-Sterilization System',
        bestFor: 'Private borewells, rural community tanks, and rooftop storage overheads vulnerable to monsoon microbial contamination.',
        costRange: '₹8,500 – ₹14,000',
        replacementCycle: 'Sediment pre-filter: 3–6 months | UV Quartz Lamp: Annual replacement',
        removes: ['99.99% Bacteria & Viruses (E. coli, Coliform)', 'Giardia & Cryptosporidium Cysts', 'Turbidity Silt'],
        limitations: 'Requires steady electrical power to maintain active UV ultraviolet chamber.',
        recommended: true
      };
    } else {
      return {
        name: 'Catalytic Coconut Carbon Block Micro-Filter (0.5 Micron)',
        category: 'Kitchen Faucet or Under-Sink Cartridge',
        bestFor: 'Municipal Kajauli/Chandigarh canal treated tap water with chlorine odor, pipe rust particles, and microplastics.',
        costRange: budget === 'pitcher' ? '₹2,500 – ₹3,800' : '₹5,000 – ₹8,500',
        replacementCycle: 'Every 6 months or 3,000 Litres',
        removes: ['99.1% Free Chlorine & Chloramines', 'Bad Chemical Taste & Odors', 'Sediment & Rust Particles', 'Preserves Healthy Essential Minerals'],
        limitations: 'Does not alter TDS (Total Dissolved Solids) or soften very hard mineral water.',
        recommended: true
      };
    }
  };

  const rec = getRecommendation();

  return (
    <div className="card !p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Personalized Household Water Filter Guide</h3>
            <p className="text-xs text-zinc-500">Find the optimal filtration technology for your family's tap water chemistry</p>
          </div>
        </div>

        <span className="self-start md:self-auto text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> NSF/ANSI Standards Matching
        </span>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Source */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">1. Water Source</label>
          <select 
            value={source} 
            onChange={(e) => setSource(e.target.value as any)}
            className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500"
          >
            <option value="city">City / Municipal Treated Supply</option>
            <option value="well">Private Well / Ground Borehole</option>
            <option value="rain">Rainwater Cistern / Storage Tank</option>
          </select>
        </div>

        {/* Primary Concern */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">2. Primary Water Issue</label>
          <select 
            value={primaryConcern} 
            onChange={(e) => setPrimaryConcern(e.target.value as any)}
            className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500"
          >
            <option value="chlorine">Bleach / Chlorine Taste & Smell</option>
            <option value="tds">High TDS / Heavy Minerals / Salinity</option>
            <option value="lead">Lead Pipes / Old Plumbing Toxins</option>
            <option value="hardness">White Mineral Scale / Hard Water</option>
            <option value="bacteria">Microbial Risk / Unchlorinated</option>
          </select>
        </div>

        {/* Installation Setup */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">3. Preferred Setup</label>
          <select 
            value={budget} 
            onChange={(e) => setBudget(e.target.value as any)}
            className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500"
          >
            <option value="undersink">Under-Sink Dedicated Drinking Tap</option>
            <option value="pitcher">Countertop / Faucet Pitcher</option>
            <option value="wholehouse">Whole House Point-of-Entry</option>
          </select>
        </div>

      </div>

      {/* Recommended Output Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-200 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
              Recommended Technology
            </span>
            <h4 className="text-base font-bold text-zinc-900">{rec.name}</h4>
            <span className="text-xs text-zinc-500">{rec.category}</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-zinc-900 block">{rec.costRange}</span>
            <span className="text-[10px] text-zinc-500">{rec.replacementCycle}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-blue-100">
          <strong>Why this is right for you:</strong> {rec.bestFor}
        </p>

        {/* Removed Contaminants checklist */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 block mb-2">
            Target Contaminants Eliminated
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {rec.removes.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Caveats */}
        <div className="pt-3 border-t border-blue-100 flex items-start gap-2 text-xs text-zinc-500">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span><strong>Good to know:</strong> {rec.limitations}</span>
        </div>

      </div>

    </div>
  );
};
export default FilterRecommender;
