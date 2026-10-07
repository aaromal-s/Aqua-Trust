import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Droplets, Cpu, BrainCircuit, FileText, MessageSquare, ShieldAlert, X, UserCircle, LogOut, Stethoscope, Menu, PhoneCall, Calculator, Radio, Bell, ShieldCheck, Waves, Camera, Wifi, WifiOff } from 'lucide-react';
import CommandMenu from './CommandMenu';
import EmergencyDirectoryModal from './EmergencyDirectoryModal';
import IoTSimulatorModal from './IoTSimulatorModal';
import NotificationCenterModal from './NotificationCenterModal';
import { offlineQueue, type QueuedTelemetryItem } from '../services/offlineQueueService';
import { useAuth } from '../context/useAuth';

export const Layout = () => {
  const location = useLocation();
  const path = location.pathname;
  const { currentUser, toggleRole } = useAuth();
  const isAdmin = currentUser.role === 'admin';
  
  const [liveAlert, setLiveAlert] = useState<{id: number, message: string} | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [queuedItems, setQueuedItems] = useState<QueuedTelemetryItem[]>([]);

  useEffect(() => {
    const unsub = offlineQueue.subscribe((queue, online) => {
      setQueuedItems(queue);
      setIsOnline(online);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const messages = [
      "pH deviation detected in Sector 17 grid",
      "Turbidity & silt surge in Sukhna Lake Catchment",
      "Sensor AQ-CHD-01 (Sukhna Node) telemetry synced",
      "PPCB Compliance audit log successfully generated",
      "Kajauli Bhakra feeder AI predictive model recalibrated"
    ];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setLiveAlert({
          id: Date.now(),
          message: messages[Math.floor(Math.random() * messages.length)]
        });
        
        setTimeout(() => setLiveAlert(null), 5000);
      }
    }, 14000);
    
    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleSimulationTriggered = (payload: any) => {
    setLiveAlert({
      id: Date.now(),
      message: `Simulated Packet Ingested: ${payload.device_id} flagged as ${payload.status_flag.toUpperCase()}`
    });
    setTimeout(() => setLiveAlert(null), 6000);
  };

  const handleManualSync = async () => {
    const { syncedCount } = await offlineQueue.syncQueue();
    if (syncedCount > 0) {
      setLiveAlert({
        id: Date.now(),
        message: `Offline Sync Complete: ${syncedCount} queued field packets transmitted`
      });
      setTimeout(() => setLiveAlert(null), 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--background)] text-[var(--foreground)] relative">
      <CommandMenu />
      
      {/* Modals */}
      <EmergencyDirectoryModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
      <IoTSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        onSimulationTriggered={handleSimulationTriggered}
      />
      <NotificationCenterModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* 1. Mobile Top Header Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
            <Droplets className="text-white w-4 h-4" />
          </div>
          <span className="text-base font-bold text-zinc-900">AquaTrust.</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 relative"
            title="Locality Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1 right-1" />
          </button>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" /> SOS
          </button>
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100"
          >
            {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Desktop Sidebar */}
      <aside className="w-64 border-r border-zinc-200/80 bg-white/70 backdrop-blur-xl hidden md:flex flex-col z-20 shadow-[1px_0_15px_rgba(0,0,0,0.01)] relative">
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-zinc-900 flex items-center justify-center shadow-sm">
              <Droplets className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">AquaTrust.</span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors relative"
              title="Locality Alerts & Push Center"
            >
              <Bell className="w-4 h-4 text-zinc-700" />
              <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1 right-1" />
            </button>
            <button
              onClick={() => setIsSimulatorModalOpen(true)}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
              title="IoT Hardware Telemetry Simulator"
            >
              <Radio className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Network & Offline Status Banner */}
        <div className="px-4 mb-2">
          {isOnline && queuedItems.length === 0 ? (
            <div className="py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3 text-emerald-600" /> ⚡ Grid Live & Synced
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          ) : (
            <div className="py-1.5 px-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-amber-600" /> {queuedItems.length} queued packets
              </span>
              <button
                onClick={handleManualSync}
                className="px-1.5 py-0.5 bg-amber-200 hover:bg-amber-300 rounded text-[9px] font-bold uppercase transition-colors"
              >
                Sync
              </button>
            </div>
          )}
        </div>

        {/* Emergency SOS Quick Button */}
        <div className="px-4 mb-2">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" /> 24/7 Crisis Hotline
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          {isAdmin ? (
            <>
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Global Monitoring</div>
              <SidebarItem icon={<Home size={18} />} label="Overview" path="/dashboard" active={path === '/dashboard'} />
              <SidebarItem icon={<Droplets size={18} />} label="Water Quality" path="/quality" active={path === '/quality'} />
              
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-4">Simulation & AI</div>
              <SidebarItem icon={<Waves size={18} />} label="Watershed Simulator" path="/simulator" active={path === '/simulator'} badge="New" badgeColor="bg-indigo-600" />
              <SidebarItem icon={<Camera size={18} />} label="Test Strip Scanner" path="/scanner" active={path === '/scanner'} badge="AI" badgeColor="bg-teal-600" />
              <SidebarItem icon={<BrainCircuit size={18} />} label="Aqua Intelligence" path="/intelligence" active={path === '/intelligence'} />
              <SidebarItem icon={<Stethoscope size={18} />} label="Aqua Doctor (AI)" path="/doctor" active={path === '/doctor'} />
              <SidebarItem icon={<Calculator size={18} />} label="Water Footprint & Leaks" path="/calculator" active={path === '/calculator'} />
              
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-4">Infrastructure & Trust</div>
              <SidebarItem icon={<ShieldCheck size={18} />} label="Water Passport Ledger" path="/passport" active={path === '/passport'} badge="SHA-256" badgeColor="bg-blue-600" />
              <SidebarItem icon={<Cpu size={18} />} label="Sensors" path="/sensors" active={path === '/sensors'} />
              
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-4">Governance & Public</div>
              <SidebarItem icon={<FileText size={18} />} label="Open Data & Reports" path="/reports" active={path === '/reports'} />
              <SidebarItem icon={<MessageSquare size={18} />} label="Citizen Incident Desk" path="/reporting" active={path === '/reporting'} />
              <SidebarItem icon={<ShieldAlert size={18} />} label="Admin Panel" path="/admin" active={path === '/admin'} />
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">My System</div>
              <SidebarItem icon={<Home size={18} />} label="My Dashboard" path="/dashboard" active={path === '/dashboard'} />
              <SidebarItem icon={<Cpu size={18} />} label="My Sensors" path="/sensors" active={path === '/sensors'} />
              
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-4">Citizen Tools & Trust</div>
              <SidebarItem icon={<ShieldCheck size={18} />} label="Water Passport & QR" path="/passport" active={path === '/passport'} badge="Verify" badgeColor="bg-blue-600" />
              <SidebarItem icon={<Camera size={18} />} label="Scan Test Strip" path="/scanner" active={path === '/scanner'} badge="AI" badgeColor="bg-teal-600" />
              <SidebarItem icon={<Waves size={18} />} label="Watershed Simulator" path="/simulator" active={path === '/simulator'} />
              <SidebarItem icon={<Stethoscope size={18} />} label="Aqua Doctor (AI)" path="/doctor" active={path === '/doctor'} />
              <SidebarItem icon={<Calculator size={18} />} label="Water Footprint & Leaks" path="/calculator" active={path === '/calculator'} />
              <SidebarItem icon={<MessageSquare size={18} />} label="Report Water Issue" path="/reporting" active={path === '/reporting'} />
              <SidebarItem icon={<FileText size={18} />} label="Open Data Portal" path="/reports" active={path === '/reports'} />
            </>
          )}
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-zinc-200/80 bg-zinc-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center">
              <UserCircle className="text-zinc-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-800 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-zinc-500 font-medium capitalize">{currentUser.role} Account</p>
            </div>
          </div>
          <button 
            onClick={toggleRole}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors shadow-sm"
          >
            <LogOut size={13} /> Switch to {isAdmin ? 'Citizen View' : 'Admin'}
          </button>
        </div>
      </aside>

      {/* 3. Mobile Slide-Out Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-72 bg-white h-full shadow-2xl z-10 flex flex-col p-4 animate-slide-right">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <span className="text-base font-bold text-zinc-900">AquaTrust Menu</span>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              <SidebarItem icon={<Home size={18} />} label="Overview" path="/dashboard" active={path === '/dashboard'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<Droplets size={18} />} label="Water Quality" path="/quality" active={path === '/quality'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<ShieldCheck size={18} />} label="Water Passport Ledger" path="/passport" active={path === '/passport'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<Camera size={18} />} label="Test Strip Scanner" path="/scanner" active={path === '/scanner'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<Waves size={18} />} label="Watershed Simulator" path="/simulator" active={path === '/simulator'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<Stethoscope size={18} />} label="Aqua Doctor (AI)" path="/doctor" active={path === '/doctor'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<Calculator size={18} />} label="Water Calculator" path="/calculator" active={path === '/calculator'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<MessageSquare size={18} />} label="Report Issue & Feed" path="/reporting" active={path === '/reporting'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<FileText size={18} />} label="Open Data & Reports" path="/reports" active={path === '/reports'} onClick={() => setIsMobileDrawerOpen(false)} />
              <SidebarItem icon={<Cpu size={18} />} label="Sensors" path="/sensors" active={path === '/sensors'} onClick={() => setIsMobileDrawerOpen(false)} />
              {isAdmin && <SidebarItem icon={<ShieldAlert size={18} />} label="Admin Panel" path="/admin" active={path === '/admin'} onClick={() => setIsMobileDrawerOpen(false)} />}
              
              <div className="pt-4 border-t border-zinc-100">
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setIsSimulatorModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center gap-2 mb-2"
                >
                  <Radio className="w-4 h-4 text-emerald-600" /> IoT Hardware Simulator
                </button>
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setIsEmergencyModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-rose-600" /> 24/7 Emergency Hotlines
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <button 
                onClick={() => {
                  toggleRole();
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold"
              >
                Switch to {isAdmin ? 'Citizen View' : 'Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#fafafa] pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* 5. Mobile Native Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-zinc-200/90 z-40 flex items-center justify-around py-2 shadow-lg">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center text-[10px] font-semibold ${path === '/dashboard' ? 'text-blue-600 font-bold' : 'text-zinc-500'}`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>
        <Link 
          to="/quality" 
          className={`flex flex-col items-center text-[10px] font-semibold ${path === '/quality' ? 'text-blue-600 font-bold' : 'text-zinc-500'}`}
        >
          <Droplets className="w-5 h-5 mb-0.5" />
          <span>Quality</span>
        </Link>
        <Link 
          to="/doctor" 
          className={`flex flex-col items-center text-[10px] font-semibold ${path === '/doctor' ? 'text-blue-600 font-bold' : 'text-zinc-500'}`}
        >
          <Stethoscope className="w-5 h-5 mb-0.5" />
          <span>Doctor</span>
        </Link>
        <Link 
          to="/reporting" 
          className={`flex flex-col items-center text-[10px] font-semibold ${path === '/reporting' ? 'text-blue-600 font-bold' : 'text-zinc-500'}`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Report</span>
        </Link>
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center text-[10px] font-semibold text-zinc-500"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Live Alert Toast System */}
      <div className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 transition-all duration-700 ease-in-out transform ${liveAlert ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        {liveAlert && (
          <div className="card !p-4 flex items-center gap-3.5 bg-white/90 backdrop-blur-2xl border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] min-w-[300px] max-w-sm rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Aqua Intelligence Alert
              </p>
              <p className="text-xs font-semibold text-zinc-800 leading-snug">{liveAlert.message}</p>
            </div>
            <button onClick={() => setLiveAlert(null)} className="text-zinc-400 hover:text-zinc-600 p-1">
              <X size={15} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

const SidebarItem = ({ icon, label, active, badge, badgeColor, path = "#", onClick }: any) => (
  <Link 
    to={path} 
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${active ? 'bg-zinc-100 text-zinc-900 font-bold shadow-sm' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    {badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${badgeColor}`}>{badge}</span>}
  </Link>
);

export default Layout;
