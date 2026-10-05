import { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, AlertCircle, Droplets, Waves, Bell, Check, Info } from 'lucide-react';
import EmergencyAlertModal from './EmergencyAlertModal';

interface WaterZoneData {
  pincode: string;
  name: string;
  drinkability: 'safe' | 'boil' | 'hazardous';
  recreation: 'safe' | 'caution' | 'prohibited';
  score: number;
  lastUpdated: string;
  advisoryText: string;
  metrics: {
    pH: number;
    turbidity: number;
    chlorine: number;
    tds: number;
    microbialRisk: string;
  };
}

const mockZones: Record<string, WaterZoneData> = {
  'chandigarh-17': {
    pincode: '160017',
    name: 'Sector 17 & Central Grid, Chandigarh',
    drinkability: 'safe',
    recreation: 'safe',
    score: 95,
    lastUpdated: '10 mins ago',
    advisoryText: 'Kajauli canal supply meets 100% of BIS 10500:2012 Indian Drinking Water Standards. Optimal mineral purity and balanced chlorination.',
    metrics: { pH: 7.3, turbidity: 0.9, chlorine: 0.7, tds: 142, microbialRisk: 'Zero (BIS Compliant)' }
  },
  'sukhna': {
    pincode: '160001',
    name: 'Sukhna Lake Enclave (Sector 1 - 4, Chandigarh)',
    drinkability: 'safe',
    recreation: 'safe',
    score: 92,
    lastUpdated: '18 mins ago',
    advisoryText: 'High dissolved oxygen in Shivalik catchment runoff. Boating, kayaking, and recreational waters completely safe and clear.',
    metrics: { pH: 7.4, turbidity: 1.8, chlorine: 0.5, tds: 165, microbialRisk: 'Zero (Negative)' }
  },
  'mohali': {
    pincode: '160062',
    name: 'SAS Nagar Mohali (Phase 3B2 - Phase 7)',
    drinkability: 'safe',
    recreation: 'safe',
    score: 89,
    lastUpdated: '22 mins ago',
    advisoryText: 'Bhakra canal supply blended with deep tube-well network. Piped municipal tap water is clean and safe for domestic consumption.',
    metrics: { pH: 7.2, turbidity: 1.4, chlorine: 0.6, tds: 210, microbialRisk: 'Zero (Safe)' }
  },
  'ludhiana': {
    pincode: '141003',
    name: 'Ludhiana Industrial District (Budha Nullah Basin)',
    drinkability: 'hazardous',
    recreation: 'prohibited',
    score: 38,
    lastUpdated: '3 mins ago',
    advisoryText: 'PPCB CRITICAL CONTAMINATION ALERT: High industrial and textile dyeing effluent detected. Groundwater in shallow borewells is severely compromised. Do NOT drink without advanced RO purification.',
    metrics: { pH: 5.2, turbidity: 24.5, chlorine: 0.0, tds: 840, microbialRisk: 'Critical Coliform' }
  },
  'bathinda': {
    pincode: '151001',
    name: 'Bathinda Malwa Agricultural Aquifer Basin',
    drinkability: 'boil',
    recreation: 'caution',
    score: 64,
    lastUpdated: '8 mins ago',
    advisoryText: 'Elevated natural TDS and agricultural runoff detected in shallow aquifers. Reverse Osmosis (RO) filtration or boiling recommended prior to drinking.',
    metrics: { pH: 7.8, turbidity: 3.8, chlorine: 0.2, tds: 520, microbialRisk: 'Moderate Mineral Risk' }
  },
  'amritsar': {
    pincode: '143001',
    name: 'Amritsar Walled City & Heritage Corridor',
    drinkability: 'safe',
    recreation: 'safe',
    score: 90,
    lastUpdated: '15 mins ago',
    advisoryText: 'Municipal piped water supply network active with stable chlorine residue. Continuous microbiological surveillance active.',
    metrics: { pH: 7.3, turbidity: 1.2, chlorine: 0.6, tds: 180, microbialRisk: 'Zero (Safe)' }
  }
};

export const LocalitySafetyChecker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<WaterZoneData>(mockZones['chandigarh-17']);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const handleSearch = (key: string) => {
    const normalized = key.toLowerCase().trim();
    if (normalized.includes('sukhna') || normalized.includes('160001') || normalized.includes('sector 1')) {
      setSelectedZone(mockZones['sukhna']);
    } else if (normalized.includes('mohali') || normalized.includes('160062') || normalized.includes('sas')) {
      setSelectedZone(mockZones['mohali']);
    } else if (normalized.includes('ludhiana') || normalized.includes('141003') || normalized.includes('budha')) {
      setSelectedZone(mockZones['ludhiana']);
    } else if (normalized.includes('bathinda') || normalized.includes('151001') || normalized.includes('malwa')) {
      setSelectedZone(mockZones['bathinda']);
    } else if (normalized.includes('amritsar') || normalized.includes('143001')) {
      setSelectedZone(mockZones['amritsar']);
    } else {
      setSelectedZone(mockZones['chandigarh-17']);
    }
  };

  const getDrinkabilityBadge = (status: WaterZoneData['drinkability']) => {
    switch (status) {
      case 'safe':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Safe to Drink Directly
          </div>
        );
      case 'boil':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Boil Advisory Active
          </div>
        );
      case 'hazardous':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-rose-600" /> Do Not Consume
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* Search Header Bar */}
      <div className="card !p-6 bg-white/80 backdrop-blur-xl border border-zinc-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.04)] rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
              <Droplets className="w-3.5 h-3.5" /> Punjab & Chandigarh Public Water Index
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Is My Tap Water Safe Right Now?</h2>
            <p className="text-sm text-zinc-500">Live drinking water quality and canal supply telemetry across Punjab & Chandigarh Tricity</p>
          </div>
          
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Bell className="w-3.5 h-3.5" /> Get SMS / WhatsApp Alerts
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type your PIN code or locality (e.g. 160017, Sukhna Lake, Mohali, Ludhiana, Bathinda)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full pl-12 pr-28 py-3.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button 
            onClick={() => handleSearch(searchTerm)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Check
          </button>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-400">Popular Hubs:</span>
          {[
            { label: 'Sector 17 (Chandigarh)', val: 'chandigarh-17' },
            { label: 'Sukhna Lake', val: 'sukhna' },
            { label: 'SAS Nagar Mohali', val: 'mohali' },
            { label: 'Ludhiana (Budha Nullah)', val: 'ludhiana' },
            { label: 'Bathinda (Malwa)', val: 'bathinda' },
            { label: 'Amritsar', val: 'amritsar' },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => {
                setSearchTerm(item.label);
                handleSearch(item.val);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Safety Verdict Card */}
      <div className="mt-4 card !p-6 bg-white border border-zinc-200 shadow-sm rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
              <span>Telemetry Node Active</span> • <span>Updated {selectedZone.lastUpdated}</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900">{selectedZone.name}</h3>
          </div>
          <div className="flex items-center gap-3">
            {getDrinkabilityBadge(selectedZone.drinkability)}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold uppercase tracking-wider">
              <Waves className="w-3.5 h-3.5 text-blue-500" /> Waters: {selectedZone.recreation}
            </div>
          </div>
        </div>

        {/* Plain English Recommendation */}
        <div className="my-5 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-0.5">PPCB & DWSS Public Health Advisory</h4>
            <p className="text-sm text-zinc-600 leading-relaxed">{selectedZone.advisoryText}</p>
          </div>
        </div>

        {/* Metric Standards Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">pH Level</span>
            <div className="text-lg font-bold text-zinc-900">{selectedZone.metrics.pH}</div>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1">
              <Check className="w-3 h-3" /> BIS 10500 (6.5-8.5)
            </span>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Turbidity</span>
            <div className="text-lg font-bold text-zinc-900">{selectedZone.metrics.turbidity} <span className="text-xs font-normal text-zinc-500">NTU</span></div>
            <span className={`text-[10px] flex items-center gap-1 mt-1 ${selectedZone.metrics.turbidity < 4 ? 'text-emerald-600' : 'text-amber-600 font-semibold'}`}>
              BIS Limit &lt; 5.0 NTU
            </span>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Free Chlorine</span>
            <div className="text-lg font-bold text-zinc-900">{selectedZone.metrics.chlorine} <span className="text-xs font-normal text-zinc-500">mg/L</span></div>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1">
              Safe: 0.2 - 2.0
            </span>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">TDS (Purity)</span>
            <div className="text-lg font-bold text-zinc-900">{selectedZone.metrics.tds} <span className="text-xs font-normal text-zinc-500">ppm</span></div>
            <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1">
              BIS Standard &lt; 500
            </span>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Microbial Assay</span>
            <div className="text-xs font-bold text-zinc-900 truncate mt-1">{selectedZone.metrics.microbialRisk}</div>
            <span className="text-[10px] text-zinc-500 mt-1 block">PPCB Verified</span>
          </div>
        </div>
      </div>

      <EmergencyAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        defaultZone={selectedZone.name}
      />
    </div>
  );
};
export default LocalitySafetyChecker;
