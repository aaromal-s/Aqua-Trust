import { useState } from 'react';
import { Cpu, Radio, Sun, Eye, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

interface SensorPart {
  id: string;
  name: string;
  category: string;
  spec: string;
  accuracy: string;
  description: string;
  iconName: string;
}

const parts: SensorPart[] = [
  {
    id: 'ph-probe',
    name: 'Ion-Selective Glass pH Electrode',
    category: 'Electrochemical Sensing Core',
    spec: '0.00 – 14.00 pH range',
    accuracy: '±0.02 pH precision',
    description: 'Measures hydrogen-ion activity across a specialized glass bulb membrane. Instantly detects acidic industrial runoff or chemical dumping within 800 milliseconds.',
    iconName: 'activity'
  },
  {
    id: 'turbidity',
    name: '90° Nephelometric Turbidity Sensor',
    category: 'Optical Scatter Array',
    spec: '0 – 1000 NTU (Infrared 860nm)',
    accuracy: '±2% full scale',
    description: 'Shoots high-frequency infrared light through the water sample and measures perpendicular beam scatter. Catches suspended clay, silt, microplastics, and algae blooms.',
    iconName: 'eye'
  },
  {
    id: 'transceiver',
    name: 'LoRaWAN + NB-IoT Dual Transceiver',
    category: 'Long-Range Wireless Gateway',
    spec: '868/915 MHz + LTE-M',
    accuracy: '15km Line-of-Sight Range',
    description: 'Transmits encrypted telemetry packets directly to regional municipal repeaters and the AquaTrust cloud without requiring local Wi-Fi or cellular contracts.',
    iconName: 'radio'
  },
  {
    id: 'solar',
    name: 'Self-Sustaining Solar Micro-Cell',
    category: 'Energy Harvesting Unit',
    spec: '3.3V 500mAh LiFePO4 Buffer',
    accuracy: 'Zero External Power Required',
    description: 'High-efficiency monocrystalline solar layer keeps the sensor completely self-powered and maintenance-free for up to 7 years in remote rivers and reservoirs.',
    iconName: 'sun'
  }
];

export const SensorNodeExplorer = () => {
  const [activePart, setActivePart] = useState<SensorPart>(parts[0]);

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <div className="card !p-8 bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Hardware Architecture Spec
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Anatomy of an AquaTrust Telemetry Node
            </h3>
            <p className="text-xs text-zinc-400">
              Click on each hardware module to inspect how field sensors translate raw stream chemistry into digital intelligence:
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>NODE STATUS: ACTIVE</span>
          </div>
        </div>

        {/* Interactive Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
          {parts.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePart(p)}
              className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex flex-col justify-between ${
                activePart.id === p.id
                  ? 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/30'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {p.id === 'ph-probe' && <Activity className="w-4 h-4 text-blue-400" />}
                {p.id === 'turbidity' && <Eye className="w-4 h-4 text-cyan-400" />}
                {p.id === 'transceiver' && <Radio className="w-4 h-4 text-emerald-400" />}
                {p.id === 'solar' && <Sun className="w-4 h-4 text-amber-400" />}
                <span className="text-[10px] font-mono text-zinc-500">PROBE</span>
              </div>
              <span className="truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Detailed Spec Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
            <div>
              <span className="text-[10px] font-mono uppercase text-blue-400 tracking-widest block mb-0.5">
                {activePart.category}
              </span>
              <h4 className="text-base font-bold text-white">{activePart.name}</h4>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-400 block">{activePart.spec}</span>
              <span className="text-[10px] text-zinc-400">{activePart.accuracy}</span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            {activePart.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> IP68 Submersible Enclosure
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> On-Device TinyML Anomaly Filter
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SensorNodeExplorer;
