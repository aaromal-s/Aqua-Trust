import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Droplets, Cpu, BrainCircuit, FileText, MessageSquare, ShieldAlert } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)] relative">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/80 liquid-glass hidden md:flex flex-col z-20 shadow-[1px_0_15px_rgba(0,0,0,0.01)]">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-zinc-900 flex items-center justify-center shadow-sm">
            <Droplets className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">AquaTrust.</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Monitoring</div>
          <SidebarItem icon={<Home size={18} />} label="Overview" path="/dashboard" active={path === '/dashboard'} />
          <SidebarItem icon={<Droplets size={18} />} label="Water Quality" path="/quality" active={path === '/quality'} />
          
          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-6">Analysis</div>
          <SidebarItem icon={<BrainCircuit size={18} />} label="Aqua Intelligence" path="/intelligence" active={path === '/intelligence'} />
          
          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-6">Infrastructure</div>
          <SidebarItem icon={<Cpu size={18} />} label="Sensors" path="/sensors" active={path === '/sensors'} />
          
          <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-6">Management</div>
          <SidebarItem icon={<FileText size={18} />} label="Reports" path="/reports" active={path === '/reports'} />
          <SidebarItem icon={<MessageSquare size={18} />} label="Issue Reports" path="/reporting" active={path === '/reporting'} />
          <SidebarItem icon={<ShieldAlert size={18} />} label="Admin Panel" path="/admin" active={path === '/admin'} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
        <Outlet />
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, badge, badgeColor, path = "#" }: any) => (
  <Link to={path} className={`flex items-center justify-between px-3 py-2.5 rounded-[8px] transition-all ${active ? 'bg-zinc-100/80 text-zinc-900 font-semibold shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[13px]">{label}</span>
    </div>
    {badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${badgeColor}`}>{badge}</span>}
  </Link>
);

export default Layout;
