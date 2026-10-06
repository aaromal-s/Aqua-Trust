import { useState, useEffect } from 'react';
import { Cpu, Search, Signal, Battery, ShieldAlert, CheckCircle2, Plus, X, RefreshCw, Activity } from 'lucide-react';
import { getSensors, createSensor, defaultSensors } from '../services/api';
import type { SensorRecord } from '../services/api';

const SensorManagement = () => {
  const [sensors, setSensors] = useState<SensorRecord[]>(defaultSensors);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'WARNING' | 'OFFLINE'>('ALL');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<SensorRecord | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibrationNotice, setRecalibrationNotice] = useState<string | null>(null);

  // New Sensor form state
  const [newId, setNewId] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState('Multiparameter Sonde');
  const [newBattery, setNewBattery] = useState(98);

  useEffect(() => {
    let mounted = true;
    getSensors().then(data => {
      if (mounted && data.length > 0) {
        setSensors(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleAddSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    const sensorToCreate: Partial<SensorRecord> = {
      id: newId || `AQ-CHD-${Math.floor(10 + Math.random() * 89)}`,
      location: newLocation || 'Mohali Industrial Catchment',
      type: newType,
      battery: newBattery,
      signal: 'STRONG',
      status: 'ONLINE',
      lastSync: 'Just now'
    };

    const saved = await createSensor(sensorToCreate);
    setSensors(prev => [saved, ...prev]);
    setIsAddModalOpen(false);
    setNewId('');
    setNewLocation('');
  };

  const handleTriggerCalibration = () => {
    setIsRecalibrating(true);
    setRecalibrationNotice(null);
    setTimeout(() => {
      setIsRecalibrating(false);
      setRecalibrationNotice(`Zero-drift laser calibration command verified for ${selectedSensor?.id}. Spectrophotometer accuracy restabilized.`);
    }, 1200);
  };

  // Filtered sensors
  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = 
      sensor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || sensor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onlineCount = sensors.filter(s => s.status === 'ONLINE').length;
  const warningCount = sensors.filter(s => s.status === 'WARNING').length;
  const offlineCount = sensors.filter(s => s.status === 'OFFLINE').length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel border-b border-zinc-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">Sensor Telemetry Fleet</h2>
            <p className="text-[11px] text-zinc-500 font-medium">Punjab & Chandigarh Hydrology Nodes</p>
          </div>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Deploy New Sensor
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Registered Nodes" value={sensors.length.toString()} color="text-zinc-900" />
          <StatCard title="Online & Calibrated" value={onlineCount.toString()} color="text-emerald-700" badge="Optimal" />
          <StatCard title="Requires Field Audit" value={warningCount.toString()} color="text-amber-700" badge="Advisory" />
          <StatCard title="Offline / Disconnected" value={offlineCount.toString()} color="text-rose-700" badge="Attention" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by ID, location, or probe type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 self-start sm:self-auto">
            {(['ALL', 'ONLINE', 'WARNING', 'OFFLINE'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === status 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {status === 'ALL' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Sensor Table */}
        <div className="card !p-0 overflow-hidden bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-5 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Node ID</th>
                  <th className="px-5 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Watershed Location</th>
                  <th className="px-5 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Probe Array Type</th>
                  <th className="px-5 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Power & RF</th>
                  <th className="px-5 py-3.5 font-bold text-zinc-500 uppercase tracking-wider">Last Sync</th>
                  <th className="px-5 py-3.5 font-bold text-zinc-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredSensors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-400">
                      No matching sensors found for "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredSensors.map((sensor) => (
                    <tr 
                      key={sensor.id} 
                      onClick={() => setSelectedSensor(sensor)}
                      className="hover:bg-zinc-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-blue-600 group-hover:underline">
                        {sensor.id}
                      </td>
                      <td className="px-5 py-4 font-semibold text-zinc-900">
                        {sensor.location}
                      </td>
                      <td className="px-5 py-4 text-zinc-600 font-medium">
                        {sensor.type}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          sensor.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          sensor.status === 'WARNING' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {sensor.status === 'ONLINE' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {sensor.status === 'WARNING' && <ShieldAlert className="w-3 h-3 text-amber-600" />}
                          {sensor.status === 'OFFLINE' && <ShieldAlert className="w-3 h-3 text-rose-600" />}
                          {sensor.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1" title={`Battery: ${sensor.battery}%`}>
                            <Battery className={`w-3.5 h-3.5 ${
                              sensor.battery < 20 ? 'text-rose-600' : sensor.battery < 50 ? 'text-amber-600' : 'text-emerald-600'
                            }`} />
                            <span className="font-mono text-[11px] text-zinc-600">{sensor.battery}%</span>
                          </div>
                          <div className="flex items-center gap-1" title={`LoRaWAN Signal: ${sensor.signal}`}>
                            <Signal className={`w-3.5 h-3.5 ${
                              sensor.signal === 'NONE' ? 'text-rose-600' : sensor.signal === 'WEAK' ? 'text-amber-600' : 'text-blue-600'
                            }`} />
                            <span className="text-[10px] text-zinc-500 font-medium">{sensor.signal}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-500 font-medium">
                        {sensor.lastSync}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSensor(sensor);
                          }}
                          className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal 1: Deploy New Sensor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Provision New Telemetry Node</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSensor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">Sensor Node ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. AQ-CHD-05" 
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">Catchment / Location</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Sector 42 Lake & Botanical Reserve" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">Probe Sensor Array</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Multiparameter Sonde">Multiparameter Sonde (pH, Turbidity, Temp)</option>
                  <option value="Spectrophotometer Probe">Spectrophotometer Nitrate & Fluoride Probe</option>
                  <option value="Heavy Metals & Toxins Array">Industrial Chemical & Heavy Metals Array</option>
                  <option value="Bacteriological Biosensor">Bacteriological UV-Fluorescence Biosensor</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Initial Battery Charge</label>
                  <span className="text-xs font-mono font-bold text-zinc-900">{newBattery}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={newBattery}
                  onChange={(e) => setNewBattery(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Sensor Inspection & Calibration */}
      {selectedSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    #{selectedSensor.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedSensor.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' :
                    selectedSensor.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedSensor.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 mt-1">{selectedSensor.location}</h3>
              </div>
              <button onClick={() => setSelectedSensor(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {recalibrationNotice && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{recalibrationNotice}</span>
              </div>
            )}

            {/* Diagnostic Metrics Matrix */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Battery Power</span>
                <span className="text-lg font-bold text-zinc-900 font-mono">{selectedSensor.battery}%</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Solar Buffered</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">LoRa Signal</span>
                <span className="text-lg font-bold text-zinc-900 font-mono">{selectedSensor.signal}</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">-68 dBm RSSI</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Firmware</span>
                <span className="text-lg font-bold text-zinc-900 font-mono">v2.4.1</span>
                <span className="text-[10px] text-blue-600 block mt-0.5">OTA Synced</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-200/80">
              <div className="flex justify-between"><span>Probe Classification:</span> <strong className="text-zinc-800">{selectedSensor.type}</strong></div>
              <div className="flex justify-between"><span>Transmission Interval:</span> <strong className="text-zinc-800">Every 120 seconds</strong></div>
              <div className="flex justify-between"><span>Telemetry Gateway:</span> <strong className="text-zinc-800">Chandigarh Municipal Tower #4</strong></div>
              <div className="flex justify-between"><span>Last Handshake:</span> <strong className="text-zinc-800">{selectedSensor.lastSync}</strong></div>
            </div>

            {/* Hardware Commands */}
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleTriggerCalibration}
                disabled={isRecalibrating}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                {isRecalibrating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Recalibrating Optics...
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" /> Trigger Remote Calibration
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedSensor(null)}
                className="py-2.5 px-4 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ title, value, color, badge }: { title: string; value: string; color: string; badge?: string }) => (
  <div className="card !p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-zinc-500 text-xs font-semibold">{title}</h3>
      {badge && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">{badge}</span>}
    </div>
    <div className={`text-2xl font-bold font-mono tracking-tight ${color}`}>{value}</div>
  </div>
);

export default SensorManagement;
