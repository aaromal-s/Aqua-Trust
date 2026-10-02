import { Link } from 'react-router-dom';
import { Home, Activity, Droplets, Map, BarChart2, Bell, Cpu, MapPin, BrainCircuit, FileText, MessageSquare, Settings, User, ShieldAlert } from 'lucide-react';
import WaterMap from '../components/WaterMap';
import WaterQualityChart from '../components/WaterQualityChart';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-aqua-400 to-blue-600 flex items-center justify-center">
            <Droplets className="text-slate-900 w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Aqua Trust</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitoring</div>
          <SidebarItem icon={<Home size={18} />} label="Overview" path="/dashboard" active />
          <SidebarItem icon={<Activity size={18} />} label="Live Monitoring" path="/dashboard" />
          <SidebarItem icon={<Droplets size={18} />} label="Water Quality" path="/quality" />
          <SidebarItem icon={<Map size={18} />} label="Water Map" path="/dashboard" />
          
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis</div>
          <SidebarItem icon={<BarChart2 size={18} />} label="Analytics" path="/dashboard" />
          <SidebarItem icon={<Bell size={18} />} label="Alerts" badge="3" badgeColor="bg-red-500" path="/dashboard" />
          <SidebarItem icon={<BrainCircuit size={18} />} label="Aqua Intelligence" path="/intelligence" />
          
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Infrastructure</div>
          <SidebarItem icon={<Cpu size={18} />} label="Sensors" path="/sensors" />
          <SidebarItem icon={<MapPin size={18} />} label="Locations" path="/dashboard" />
          
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</div>
          <SidebarItem icon={<FileText size={18} />} label="Reports" path="/reports" />
          <SidebarItem icon={<MessageSquare size={18} />} label="Issue Reports" path="/reporting" />
          <SidebarItem icon={<ShieldAlert size={18} />} label="Admin Panel" path="/admin" />
        </div>
        
        <div className="p-4 border-t border-[var(--border)] space-y-1">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
          <SidebarItem icon={<User size={18} />} label="Profile" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <h2 className="text-lg font-semibold">Water Intelligence Overview</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Data Active
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-[var(--border)] cursor-pointer"></div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <KpiCard title="Overall Water Quality" value="87/100" status="Good" trend="+2.4%" trendUp icon={<Droplets className="text-blue-400" />} />
            <KpiCard title="Active Sensors" value="142" status="98% Online" trend="-2 offline" trendUp={false} icon={<Cpu className="text-green-400" />} />
            <KpiCard title="Critical Alerts" value="3" status="Action Required" trend="New" trendUp={false} icon={<ShieldAlert className="text-red-400" />} isAlert />
            <KpiCard title="System Health" value="Stable" status="All systems operational" icon={<Activity className="text-purple-400" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Chart Area */}
            <div className="lg:col-span-2 card">
              <WaterQualityChart />
            </div>
            
            {/* Recent Alerts Area */}
            <div className="card flex flex-col h-[400px]">
              <h3 className="font-semibold mb-4 text-lg">Recent Anomalies</h3>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                <AlertItem type="critical" location="Station AQ-014" message="Unusual turbidity spike detected (11.8 NTU)" time="14m ago" />
                <AlertItem type="warning" location="River North" message="pH level dropping gradually (Current: 6.8)" time="1h ago" />
                <AlertItem type="info" location="Station AQ-003" message="Sensor calibration recommended" time="3h ago" />
                <AlertItem type="warning" location="Estuary South" message="Low Dissolved Oxygen detected (5.2 mg/L)" time="5h ago" />
              </div>
            </div>
          </div>
          
          {/* Map Area */}
          <div className="grid grid-cols-1 gap-6 mb-6">
             <div className="card h-[500px] p-0 overflow-hidden">
                <WaterMap />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, badge, badgeColor, path = "#" }: any) => (
  <Link to={path} className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-slate-900/10 text-slate-900' : 'text-slate-500 hover:bg-slate-900/5 hover:text-slate-700'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-900 ${badgeColor}`}>{badge}</span>}
  </Link>
);

const KpiCard = ({ title, value, status, trend, trendUp, icon, isAlert }: any) => (
  <div className={`card relative overflow-hidden ${isAlert ? 'border-red-500/30 bg-red-500/5' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
      <div className="p-2 bg-slate-900/5 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="flex items-center justify-between mt-4">
      <span className={`text-sm ${isAlert ? 'text-red-400' : 'text-slate-500'}`}>{status}</span>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded bg-slate-900/5 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

const AlertItem = ({ type, location, message, time }: { type: 'critical' | 'warning' | 'info', location: string, message: string, time: string }) => {
  const colors = {
    critical: 'border-red-500/50 bg-red-500/10 text-red-400',
    warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  };
  
  return (
    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]/50 hover:bg-[var(--background)] transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-1">
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${colors[type]}`}>{type.toUpperCase()}</span>
        <span className="text-xs text-slate-400">{time}</span>
      </div>
      <div className="text-sm font-medium text-slate-600 mt-2">{location}</div>
      <div className="text-sm text-slate-500 mt-1 line-clamp-2">{message}</div>
    </div>
  );
};

export default Dashboard;
