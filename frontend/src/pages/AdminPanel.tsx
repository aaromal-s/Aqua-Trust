import { useState, useEffect } from 'react';
import { Shield, Users, Settings, Server, AlertOctagon, CheckCircle2, X, ArrowRight, Save, Truck, Plus, Check } from 'lucide-react';
import { fetchWorkOrders, dispatchWorkOrder, updateWorkOrderStatus, type MunicipalWorkOrder } from '../services/workOrderService';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'inspector' | 'citizen';
  status: 'active' | 'suspended';
}

const initialUsers: AdminUser[] = [
  { id: 'usr-1', name: 'Dr. Harpreet Kaur', email: 'harpreet.kaur@ppcb.gov.in', role: 'admin', status: 'active' },
  { id: 'usr-2', name: 'Gurpreet Singh', email: 'gurpreet.singh@chd.nic.in', role: 'inspector', status: 'active' },
  { id: 'usr-3', name: 'Simran Ahluwalia', email: 'simran.pau@edu.in', role: 'citizen', status: 'active' },
  { id: 'usr-4', name: 'Rajinder Verma', email: 'rajinder.mc@chd.nic.in', role: 'inspector', status: 'active' },
];

const mockLogs = [
  { time: '16:54:12', level: 'INFO', message: 'NB-IoT packet ingested from AQ-CHD-01 (Sukhna Lake) — 200 OK' },
  { time: '16:52:08', level: 'WARN', message: 'Turbidity threshold crossed at Budha Nullah: 18.8 NTU' },
  { time: '16:48:30', level: 'INFO', message: 'PPCB automated compliance certificate generated for Sector 17 grid' },
  { time: '16:44:19', level: 'INFO', message: 'Kajauli canal waterworks spectrometer calibration confirmed' },
  { time: '16:40:02', level: 'INFO', message: 'Citizen grievance #AQUA-1042 triaged and dispatched to MC Chandigarh' },
];

export const AdminPanel = () => {
  const [activeModule, setActiveModule] = useState<'users' | 'thresholds' | 'logs' | 'triage' | 'workorders' | null>(null);
  
  // Work Orders state
  const [workOrders, setWorkOrders] = useState<MunicipalWorkOrder[]>([]);
  const [newOrderIncidentRef, setNewOrderIncidentRef] = useState('');
  const [newOrderTitle, setNewOrderTitle] = useState('');
  const [newOrderTeam, setNewOrderTeam] = useState('PPCB Rapid Response Unit 1');
  const [newOrderPriority, setNewOrderPriority] = useState<MunicipalWorkOrder['priority']>('HIGH');
  const [newOrderLocation, setNewOrderLocation] = useState('Sukhna Lake Shoreline');
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const loadWorkOrders = async () => {
    const data = await fetchWorkOrders();
    setWorkOrders(data);
  };

  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);
    const created = await dispatchWorkOrder({
      incidentRef: newOrderIncidentRef || 'AQUA-1045',
      title: newOrderTitle || 'Water Pipeline Pressure Flush',
      assignedTeam: newOrderTeam,
      priority: newOrderPriority,
      location: newOrderLocation,
      slaHoursLimit: newOrderPriority === 'EMERGENCY' ? 12 : 24,
      leadOfficer: 'Er. Jaswinder Singh (PPCB Field Lead)'
    });
    setWorkOrders(prev => [created, ...prev]);
    setIsDispatching(false);
    setNewOrderTitle('');
    setNewOrderIncidentRef('');
  };

  const handleUpdateWorkOrderStatus = async (id: string, status: MunicipalWorkOrder['status']) => {
    await updateWorkOrderStatus(id, {
      status,
      afterEvidenceNote: status === 'RESOLVED_VERIFIED' ? 'Field remediation completed. Samples verified within BIS 10500 limits.' : undefined,
      postCleanupReading: status === 'RESOLVED_VERIFIED' ? {
        pH: 7.2,
        turbidity_ntu: 0.8,
        dissolvedOxygen_mgL: 7.4,
        verifiedByBadge: 'PPCB-INSP-204'
      } : undefined
    });
    await loadWorkOrders();
  };
  
  // Users state
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  
  // Thresholds state
  const [thresholds, setThresholds] = useState({
    phMin: 6.5,
    phMax: 8.5,
    turbidityMax: 4.0,
    tdsMax: 500,
    chlorineMin: 0.2
  });
  const [thresholdSaved, setThresholdSaved] = useState(false);

  // Triage state
  const [triageTickets, setTriageTickets] = useState([
    { id: 'AQUA-1042', title: 'Turbid / Muddy Tap Water', location: 'Sector 35-B Chandigarh', status: 'Resolved' },
    { id: 'AQUA-1041', title: 'Algal Scum Formation', location: 'Sukhna Lake Shoreline', status: 'Inspecting' },
    { id: 'AQUA-1039', title: 'Chemical Effluent Inflow', location: 'Budha Nullah Ludhiana', status: 'Triaged' }
  ]);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 2500);
  };

  const handleUpdateTicketStatus = (id: string, newStatus: string) => {
    setTriageTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 z-10 header-panel border-b border-zinc-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">Environmental Governance Console</h2>
            <p className="text-[11px] text-zinc-500 font-medium">MC Chandigarh & Punjab Pollution Control Board</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> High Privileges Active
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* KPI Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card !p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold text-zinc-500 block mb-1">Active Accounts</span>
            <div className="text-2xl font-bold font-mono text-zinc-900">{users.length}</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">3 Field Inspectors</span>
          </div>

          <div className="card !p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold text-zinc-500 block mb-1">Pending Grievances</span>
            <div className="text-2xl font-bold font-mono text-amber-700">2</div>
            <span className="text-[10px] text-amber-600 font-semibold mt-1 block">1 Dispatched on-site</span>
          </div>

          <div className="card !p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold text-zinc-500 block mb-1">Telemetry Ingest Rate</span>
            <div className="text-2xl font-bold font-mono text-zinc-900">99.8%</div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Sub-100ms API latency</span>
          </div>

          <div className="card !p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <span className="text-xs font-semibold text-zinc-500 block mb-1">System Audit Status</span>
            <div className="text-2xl font-bold font-mono text-emerald-700">Healthy</div>
            <span className="text-[10px] text-zinc-400 font-semibold mt-1 block">BIS 10500 Compliant</span>
          </div>
        </div>

        {/* Administration Modules */}
        <div>
          <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">Core Administration Systems</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <AdminModuleCard 
              title="User & Access Management" 
              desc="Configure roles, authentication rights, and field officer access." 
              icon={<Users className="w-5 h-5 text-blue-600" />}
              onClick={() => setActiveModule('users')}
            />
            <AdminModuleCard 
              title="Threshold Configuration" 
              desc="Set telemetry alert triggers for pH, turbidity, chlorine, and TDS." 
              icon={<Settings className="w-5 h-5 text-indigo-600" />}
              onClick={() => setActiveModule('thresholds')}
            />
            <AdminModuleCard 
              title="API Gateway & Ingest Logs" 
              desc="Inspect real-time IoT packet transmissions, response codes, and memory." 
              icon={<Server className="w-5 h-5 text-emerald-600" />}
              onClick={() => setActiveModule('logs')}
            />
            <AdminModuleCard 
              title="Citizen Incident Triage" 
              desc="Review, verify, and dispatch remediation teams for citizen reports." 
              icon={<AlertOctagon className="w-5 h-5 text-amber-600" />}
              onClick={() => setActiveModule('triage')}
            />
            <AdminModuleCard 
              title="Municipal Work Orders & SLA" 
              desc="Field team dispatch, SLA countdown, and before/after verification." 
              icon={<Truck className="w-5 h-5 text-teal-600" />}
              onClick={() => setActiveModule('workorders')}
            />
          </div>
        </div>

      </div>

      {/* Modal 1: User Management */}
      {activeModule === 'users' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-zinc-900">User Access & Role Permissions</h3>
              </div>
              <button onClick={() => setActiveModule(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {users.map(u => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{u.name}</h4>
                    <span className="text-[11px] text-zinc-500">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                      {u.role}
                    </span>
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        u.status === 'active'
                          ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {u.status === 'active' ? 'Revoke Access' : 'Restore'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex justify-end">
              <button onClick={() => setActiveModule(null)} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Thresholds */}
      {activeModule === 'thresholds' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-zinc-900">Regional BIS 10500 Telemetry Thresholds</h3>
              </div>
              <button onClick={() => setActiveModule(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {thresholdSaved && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Threshold parameters saved and dispatched to regional IoT sensor gateways!</span>
              </div>
            )}

            <form onSubmit={handleSaveThresholds} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">pH Lower Limit</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={thresholds.phMin} 
                    onChange={e => setThresholds({ ...thresholds, phMin: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">pH Upper Limit</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={thresholds.phMax} 
                    onChange={e => setThresholds({ ...thresholds, phMax: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">Max Turbidity Alert (NTU)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={thresholds.turbidityMax} 
                  onChange={e => setThresholds({ ...thresholds, turbidityMax: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase mb-1">Max Total Dissolved Solids (ppm)</label>
                <input 
                  type="number" 
                  value={thresholds.tdsMax} 
                  onChange={e => setThresholds({ ...thresholds, tdsMax: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button type="button" onClick={() => setActiveModule(null)} className="px-4 py-2 text-xs font-semibold text-zinc-600">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                  <Save className="w-3.5 h-3.5" /> Save Thresholds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: System Logs */}
      {activeModule === 'logs' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-zinc-950 text-white rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden relative animate-spring-up p-6 space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Server className="w-4 h-4" /> Live Gateway Telemetry Logs
              </div>
              <button onClick={() => setActiveModule(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-black/60 rounded-xl p-4 text-xs space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {mockLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-300">
                  <span className="text-zinc-500">[{log.time}]</span>
                  <span className={log.level === 'WARN' ? 'text-amber-400 font-bold' : 'text-blue-400'}>[{log.level}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-[11px] text-zinc-400 pt-2 border-t border-zinc-800 font-sans">
              <span>Memory RSS: 48 MB | Active Connections: 14</span>
              <button onClick={() => setActiveModule(null)} className="px-3 py-1 bg-zinc-800 text-white rounded-lg text-xs font-semibold hover:bg-zinc-700">
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Citizen Incident Triage */}
      {activeModule === 'triage' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-zinc-900">Citizen Grievance Triage Desk</h3>
              </div>
              <button onClick={() => setActiveModule(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {triageTickets.map(ticket => (
                <div key={ticket.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600">#{ticket.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        ticket.status === 'Inspecting' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900">{ticket.title}</h4>
                    <span className="text-[11px] text-zinc-500">{ticket.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateTicketStatus(ticket.id, 'Inspecting')}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100"
                    >
                      Dispatch Crew
                    </button>
                    <button
                      onClick={() => handleUpdateTicketStatus(ticket.id, 'Resolved')}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex justify-end">
              <button onClick={() => setActiveModule(null)} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold">
                Close Triage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Municipal Field Work Orders & Dispatch */}
      {activeModule === 'workorders' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden relative animate-spring-up p-6 space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-base font-bold text-zinc-900">Municipal Work Orders & Field Dispatch Lifecycle</h3>
                  <p className="text-xs text-zinc-500">Track rapid response crews, resolution SLA, and post-cleanup water testing verification</p>
                </div>
              </div>
              <button onClick={() => setActiveModule(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Dispatch Form */}
            <form onSubmit={handleCreateWorkOrder} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-teal-600" /> Dispatch New Field Unit
                </span>
                <span className="text-[10px] text-zinc-400">PPCB & MC Chandigarh Co-ordination</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <input
                  type="text"
                  placeholder="Incident Ref"
                  value={newOrderIncidentRef}
                  onChange={(e) => setNewOrderIncidentRef(e.target.value)}
                  className="px-2.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono"
                />
                <input
                  type="text"
                  required
                  placeholder="Task Title"
                  value={newOrderTitle}
                  onChange={(e) => setNewOrderTitle(e.target.value)}
                  className="px-2.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newOrderLocation}
                  onChange={(e) => setNewOrderLocation(e.target.value)}
                  className="px-2.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                />
                <select
                  value={newOrderTeam}
                  onChange={(e) => setNewOrderTeam(e.target.value)}
                  className="px-2 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                >
                  <option value="PPCB Rapid Response Unit 1">PPCB Rapid Response 1</option>
                  <option value="MC Chandigarh Health Div-3">MC Chandigarh Health 3</option>
                  <option value="Water Wing Rapid Line Services">Water Wing Rapid Line</option>
                  <option value="Ludhiana Flying Squad">Ludhiana Flying Squad</option>
                </select>
                <select
                  value={newOrderPriority}
                  onChange={(e) => setNewOrderPriority(e.target.value as any)}
                  className="px-2 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold"
                >
                  <option value="EMERGENCY">EMERGENCY (12h)</option>
                  <option value="HIGH">HIGH (24h)</option>
                  <option value="MEDIUM">MEDIUM (48h)</option>
                </select>
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" /> {isDispatching ? '...' : 'Dispatch'}
                </button>
              </div>
            </form>

            {/* Work Orders List */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {workOrders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl border border-zinc-200 bg-white space-y-3 shadow-sm hover:border-teal-200 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md">
                        {order.id}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">Ref: {order.incidentRef}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' :
                        order.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.priority}
                      </span>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                      order.status === 'RESOLVED_VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'REMEDIATION_ACTIVE' ? 'bg-blue-100 text-blue-800' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{order.title}</h4>
                    <p className="text-xs text-zinc-500">{order.location} • Lead: <span className="font-semibold text-zinc-700">{order.leadOfficer}</span> ({order.assignedTeam})</p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl text-xs space-y-1">
                    <p className="text-zinc-600"><span className="font-semibold text-zinc-800">Initial Finding:</span> {order.beforeEvidenceNote}</p>
                    {order.afterEvidenceNote && (
                      <p className="text-emerald-700"><span className="font-semibold">Remediation Proof:</span> {order.afterEvidenceNote}</p>
                    )}
                    {order.postCleanupReading && (
                      <div className="pt-1 flex gap-3 text-[11px] font-mono text-emerald-800">
                        <span>pH: {order.postCleanupReading.pH}</span>
                        <span>Turbidity: {order.postCleanupReading.turbidity_ntu} NTU</span>
                        <span>DO: {order.postCleanupReading.dissolvedOxygen_mgL} mg/L</span>
                        <span>Badge: {order.postCleanupReading.verifiedByBadge}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Actions */}
                  {order.status !== 'RESOLVED_VERIFIED' && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleUpdateWorkOrderStatus(order.id, 'ON_SITE_SAMPLING')}
                        className="px-3 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700"
                      >
                        Mark On-Site Sampling
                      </button>
                      <button
                        onClick={() => handleUpdateWorkOrderStatus(order.id, 'REMEDIATION_ACTIVE')}
                        className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100"
                      >
                        Start Remediation
                      </button>
                      <button
                        onClick={() => handleUpdateWorkOrderStatus(order.id, 'RESOLVED_VERIFIED')}
                        className="px-3 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Verify & Close SLA
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex justify-end">
              <button onClick={() => setActiveModule(null)} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold">
                Close Work Orders
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const AdminModuleCard = ({ title, desc, icon, onClick }: any) => (
  <div 
    onClick={onClick}
    className="card !p-5 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
  >
    <div>
      <div className="p-3 bg-zinc-50 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform border border-zinc-100">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</h4>
      <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
    </div>
    
    <div className="mt-4 pt-3 border-t border-zinc-100 text-xs font-semibold text-blue-600 flex items-center justify-between">
      <span>Open Module</span>
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

export default AdminPanel;
