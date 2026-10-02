import { Shield, Users, Settings, Server, AlertOctagon } from 'lucide-react';

const AdminPanel = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      <header className="h-16 border-b border-red-500/30 bg-red-950/20 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-red-100">
          <Shield className="w-5 h-5 text-red-500" /> Administrator Console
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card border-red-500/20 bg-red-500/5">
            <h3 className="text-red-400 text-sm font-medium mb-1">Total Users</h3>
            <div className="text-2xl font-bold text-slate-900">42</div>
          </div>
          <div className="card border-red-500/20 bg-red-500/5">
            <h3 className="text-red-400 text-sm font-medium mb-1">Open Reports</h3>
            <div className="text-2xl font-bold text-slate-900">12</div>
          </div>
          <div className="card border-red-500/20 bg-red-500/5">
            <h3 className="text-red-400 text-sm font-medium mb-1">System Load</h3>
            <div className="text-2xl font-bold text-slate-900">24%</div>
          </div>
          <div className="card border-red-500/20 bg-red-500/5">
            <h3 className="text-red-400 text-sm font-medium mb-1">API Errors (24h)</h3>
            <div className="text-2xl font-bold text-slate-900">0</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminModule 
            title="User Management" 
            desc="Manage roles, access levels, and active sessions." 
            icon={<Users className="w-6 h-6 text-blue-400" />} 
          />
          <AdminModule 
            title="Threshold Configuration" 
            desc="Set global and location-specific alert parameters." 
            icon={<Settings className="w-6 h-6 text-slate-500" />} 
          />
          <AdminModule 
            title="System Logs" 
            desc="View backend API logs and sensor gateway metrics." 
            icon={<Server className="w-6 h-6 text-green-400" />} 
          />
          <AdminModule 
            title="Citizen Issue Triage" 
            desc="Review and assign incoming public reports." 
            icon={<AlertOctagon className="w-6 h-6 text-yellow-400" />} 
          />
        </div>

      </div>
    </div>
  );
};

const AdminModule = ({ title, desc, icon }: any) => (
  <div className="card hover:border-red-500/50 hover:bg-slate-900/5 transition-all cursor-pointer group">
    <div className="p-3 bg-slate-900/5 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
    <div className="mt-4 pt-4 border-t border-[var(--border)] text-sm text-red-400 font-medium flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
      Manage <ArrowRightIcon className="w-4 h-4" />
    </div>
  </div>
);

const ArrowRightIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default AdminPanel;
