import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Droplets, Cpu, BrainCircuit, FileText, MessageSquare, ShieldAlert, X, UserCircle, LogOut } from 'lucide-react';
import CommandMenu from './CommandMenu';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;
  const { currentUser, toggleRole } = useAuth();
  const isAdmin = currentUser.role === 'admin';
  
  const [liveAlert, setLiveAlert] = useState<{id: number, message: string} | null>(null);

  useEffect(() => {
    // Only show live alerts for admin in this mockup
    if (!isAdmin) return;

    const messages = [
      "pH spike detected in Sector 7",
      "Turbidity anomaly in River North",
      "Sensor AQ-014 telemetry synced",
      "Compliance report successfully generated",
      "Predictive AI model recalibrated"
    ];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setLiveAlert({
          id: Date.now(),
          message: messages[Math.floor(Math.random() * messages.length)]
        });
        
        setTimeout(() => setLiveAlert(null), 5000);
      }
    }, 12000);
    
    return () => clearInterval(interval);
  }, [isAdmin]);

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)] relative">
      <CommandMenu />
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/80 liquid-glass hidden md:flex flex-col z-20 shadow-[1px_0_15px_rgba(0,0,0,0.01)] relative">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-zinc-900 flex items-center justify-center shadow-sm">
            <Droplets className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">AquaTrust.</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {isAdmin ? (
            <>
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Global Monitoring</div>
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
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">My System</div>
              <SidebarItem icon={<Home size={18} />} label="My Dashboard" path="/dashboard" active={path === '/dashboard'} />
              <SidebarItem icon={<Cpu size={18} />} label="My Sensors" path="/sensors" active={path === '/sensors'} />
              
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-6">Support</div>
              <SidebarItem icon={<MessageSquare size={18} />} label="Report Issue" path="/reporting" active={path === '/reporting'} />
            </>
          )}
        </div>

        <div className="p-4 border-t border-zinc-200/50 bg-zinc-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center">
              <UserCircle className="text-zinc-500 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800 leading-tight">{currentUser.name}</p>
              <p className="text-[11px] text-zinc-500 font-medium capitalize">{currentUser.role} Account</p>
            </div>
          </div>
          <button 
            onClick={toggleRole}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 py-2 rounded-lg hover:bg-zinc-100 transition-colors shadow-sm"
          >
            <LogOut size={14} /> Switch to {isAdmin ? 'User' : 'Admin'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
        <Outlet />
      </main>

      {/* Live Alert Toast System */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-700 ease-in-out transform ${liveAlert ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        {liveAlert && (
          <div className="card !p-4 flex items-center gap-4 bg-white/70 backdrop-blur-2xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-w-[320px]">
            <div className="w-10 h-10 rounded-[10px] bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Aqua Intelligence
              </p>
              <p className="text-sm font-semibold text-zinc-800">{liveAlert.message}</p>
            </div>
            <button onClick={() => setLiveAlert(null)} className="text-zinc-400 hover:text-zinc-600 p-1">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
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
