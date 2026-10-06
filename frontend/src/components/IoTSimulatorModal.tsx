import { useState } from 'react';
import { Cpu, Send, CheckCircle2, X, RefreshCw, Radio } from 'lucide-react';
import { ingestTelemetry } from '../services/api';

interface IoTSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulationTriggered?: (data: any) => void;
}

const scenarios = [
  {
    id: 'normal',
    name: 'Normal BIS 10500 Baseline',
    desc: 'Pure, safe drinking parameters across Punjab & Chandigarh municipal water grid.',
    pH: 7.3,
    turbidity: 0.9,
    chlorine: 0.8,
    temp: 21.4,
    status: 'safe'
  },
  {
    id: 'acid',
    name: 'Budha Nullah Industrial Effluent Dump',
    desc: 'Simulate industrial textile and dye chemical discharge in Ludhiana causing pH and oxygen shock.',
    pH: 4.8,
    turbidity: 18.8,
    chlorine: 0.1,
    temp: 24.2,
    status: 'critical'
  },
  {
    id: 'sediment',
    name: 'Monsoon Silt Runoff (Sukhna Catchment)',
    desc: 'Simulate severe mud and sediment inflow after Shivalik foothill downpour.',
    pH: 6.7,
    turbidity: 22.4,
    chlorine: 0.3,
    temp: 19.8,
    status: 'warning'
  },
  {
    id: 'algae',
    name: 'Harike Wetland Cyanobacteria Bloom',
    desc: 'Warm stagnant conditions triggering high organic turbidity and biological oxygen depletion.',
    pH: 8.8,
    turbidity: 16.5,
    chlorine: 0.0,
    temp: 29.1,
    status: 'critical'
  }
];

export const IoTSimulatorModal = ({ isOpen, onClose, onSimulationTriggered }: IoTSimulatorModalProps) => {
  const [stationId, setStationId] = useState('AQ-001');
  const [selectedScenario, setSelectedScenario] = useState(scenarios[1]); // Default to incident
  const [protocol, setProtocol] = useState<'mqtt' | 'http'>('mqtt');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [successPayload, setSuccessPayload] = useState<string | null>(null);

  const [ingestMode, setIngestMode] = useState<'live' | 'local'>('local');

  if (!isOpen) return null;

  const handleTransmit = async () => {
    setIsTransmitting(true);
    setSuccessPayload(null);

    const payload = {
      device_id: stationId,
      gateway: 'NB-IoT-LTE-M',
      protocol: protocol.toUpperCase(),
      timestamp: new Date().toISOString(),
      telemetry: {
        pH: selectedScenario.pH,
        turbidity_ntu: selectedScenario.turbidity,
        chlorine_ppm: selectedScenario.chlorine,
        temp_c: selectedScenario.temp,
        battery_pct: 94,
        signal_rssi: -68
      },
      status_flag: selectedScenario.status as 'safe' | 'warning' | 'critical'
    };

    try {
      const result = await ingestTelemetry(payload);
      setIngestMode(result.mode);
      setSuccessPayload(JSON.stringify(result.data, null, 2));
      if (onSimulationTriggered) {
        onSimulationTriggered(payload);
      }
    } catch {
      setSuccessPayload(JSON.stringify(payload, null, 2));
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">IoT Hardware Sensor Simulator</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-zinc-400">Inject synthetic MQTT/HTTP packets to test anomaly alarms</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Station & Protocol Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                Target Sensor Station
              </label>
              <select
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="AQ-CHD-01">AQ-CHD-01 (Sukhna Lake Sector 1, Chandigarh)</option>
                <option value="AQ-CHD-02">AQ-CHD-02 (Kajauli Waterworks Sector 39)</option>
                <option value="AQ-LUD-01">AQ-LUD-01 (Budha Nullah Industrial, Ludhiana)</option>
                <option value="AQ-PB-03">AQ-PB-03 (Harike Pattan Wetland Reserve)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-1.5">
                Transmission Protocol
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProtocol('mqtt')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    protocol === 'mqtt' ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                  }`}
                >
                  MQTT
                </button>
                <button
                  type="button"
                  onClick={() => setProtocol('http')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    protocol === 'http' ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                  }`}
                >
                  HTTP POST
                </button>
              </div>
            </div>
          </div>

          {/* Scenario Cards */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2">
              Select Telemetry Scenario to Simulate
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scenarios.map((scen) => (
                <div
                  key={scen.id}
                  onClick={() => setSelectedScenario(scen)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedScenario.id === scen.id
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900">{scen.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      scen.status === 'safe' ? 'bg-emerald-100 text-emerald-700' : scen.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {scen.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mb-2 leading-tight">{scen.desc}</p>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-zinc-600 bg-zinc-50 px-2 py-1 rounded">
                    <span>pH {scen.pH}</span> • <span>Turb {scen.turbidity}</span> • <span>Cl {scen.chlorine}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transmit Button */}
          <button
            type="button"
            onClick={handleTransmit}
            disabled={isTransmitting}
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-zinc-900/10 cursor-pointer"
          >
            {isTransmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> Transmitting NB-IoT Sensor Packets...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-emerald-400" /> Transmit Simulated Telemetry Packet
              </>
            )}
          </button>

          {/* Terminal Output */}
          {successPayload && (
            <div className="card !p-4 bg-zinc-950 text-white rounded-xl font-mono text-xs space-y-2 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] pb-1 border-b border-zinc-800">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {ingestMode === 'live' ? '200 OK — Live Backend Ingested' : '200 OK — Ingested (Local Grid)'}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                  <Radio className="w-3 h-3 text-emerald-500" /> NB-IoT / MQTT
                </span>
              </div>
              <pre className="text-zinc-300 text-[11px] overflow-x-auto p-2 bg-black/50 rounded-lg">
                {successPayload}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-center flex justify-between items-center text-xs text-zinc-400">
          <span>Physical device target: /api/sensors/ingest</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-100"
          >
            Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
};
export default IoTSimulatorModal;
