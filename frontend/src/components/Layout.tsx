import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Droplets, Cpu, BrainCircuit, FileText, MessageSquare, ShieldAlert } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-aqua-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Droplets className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Aqua Trust</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitoring</div>
          <SidebarItem icon={<Home size={18} />} label="Overview" path="/dashboard" active={path === '/dashboard'} />
          <SidebarItem icon={<Droplets size={18} />} label="Water Quality" path="/quality" active={path === '/quality'} />
          
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis</div>
          <SidebarItem icon={<BrainCircuit size={18} />} label="Aqua Intelligence" path="/intelligence" active={path === '/intelligence'} />
          
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Infrastructure</div>
          <SidebarItem icon={<Cpu size={18} />} label="Sensors" path="/sensors" active={path === '/sensors'} />
          
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</div>
          <SidebarItem icon={<FileText size={18} />} label="Reports" path="/reports" active={path === '/reports'} />
          <SidebarItem icon={<MessageSquare size={18} />} label="Issue Reports" path="/reporting" active={path === '/reporting'} />
          <SidebarItem icon={<ShieldAlert size={18} />} label="Admin Panel" path="/admin" active={path === '/admin'} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, badge, badgeColor, path = "#" }: any) => (
  <Link to={path} className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-slate-900/10 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-900/5 hover:text-slate-700'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    {badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${badgeColor}`}>{badge}</span>}
  </Link>
);

export default Layout;
