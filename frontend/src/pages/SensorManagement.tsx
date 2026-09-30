import { Cpu, Search, Filter, Signal, Battery, ShieldAlert, CheckCircle2 } from 'lucide-react';

const sensors = [
  { id: 'AQ-001', location: 'River North', type: 'Multiparameter Sonde', status: 'ONLINE', battery: 92, signal: 'STRONG', lastSync: '2m ago' },
  { id: 'AQ-014', location: 'Lake East', type: 'Multiparameter Sonde', status: 'WARNING', battery: 45, signal: 'WEAK', lastSync: '14m ago' },
  { id: 'AQ-022', location: 'Estuary South', type: 'Heavy Metals Probe', status: 'OFFLINE', battery: 0, signal: 'NONE', lastSync: '12h ago' },
  { id: 'AQ-035', location: 'Reservoir West', type: 'Biological Sensor', status: 'ONLINE', battery: 88, signal: 'STRONG', lastSync: '1m ago' },
];

const SensorManagement = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Cpu className="w-5 h-5 text-gray-400" /> Sensor Management
        </h2>
        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
          + Add Sensor
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Sensors" value="142" />
          <StatCard title="Online" value="138" color="text-green-400" />
          <StatCard title="Warning" value="3" color="text-yellow-400" />
          <StatCard title="Offline" value="1" color="text-red-400" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search sensor ID or location..." 
              className="w-full pl-10 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/5">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-400">Sensor ID</th>
                <th className="px-6 py-4 font-medium text-gray-400">Location</th>
                <th className="px-6 py-4 font-medium text-gray-400">Type</th>
                <th className="px-6 py-4 font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 font-medium text-gray-400">Health</th>
                <th className="px-6 py-4 font-medium text-gray-400">Last Sync</th>
                <th className="px-6 py-4 font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {sensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-medium text-white">{sensor.id}</td>
                  <td className="px-6 py-4 text-gray-300">{sensor.location}</td>
                  <td className="px-6 py-4 text-gray-400">{sensor.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      sensor.status === 'ONLINE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      sensor.status === 'WARNING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sensor.status === 'ONLINE' && <CheckCircle2 className="w-3 h-3" />}
                      {sensor.status === 'WARNING' && <ShieldAlert className="w-3 h-3" />}
                      {sensor.status === 'OFFLINE' && <ShieldAlert className="w-3 h-3" />}
                      {sensor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-400" title={`Battery: ${sensor.battery}%`}>
                        <Battery className={`w-4 h-4 ${sensor.battery < 20 ? 'text-red-400' : sensor.battery < 50 ? 'text-yellow-400' : 'text-green-400'}`} />
                      </div>
                      <div className="flex items-center gap-1 text-gray-400" title={`Signal: ${sensor.signal}`}>
                        <Signal className={`w-4 h-4 ${sensor.signal === 'WEAK' ? 'text-yellow-400' : sensor.signal === 'NONE' ? 'text-red-400' : 'text-blue-400'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{sensor.lastSync}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-400 font-medium hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, color = 'text-white' }: any) => (
  <div className="card p-4 flex flex-col justify-center">
    <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </div>
);

export default SensorManagement;
