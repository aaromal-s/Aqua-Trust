/**
 * AquaTrust Municipal Field Dispatch & Work Order Service
 */

export interface MunicipalWorkOrder {
  id: string;
  incidentRef: string;
  title: string;
  category: string;
  location: string;
  assignedTeam: string;
  leadOfficer: string;
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'ROUTINE';
  status: 'DISPATCHED' | 'ON_SITE_SAMPLING' | 'REMEDIATION_ACTIVE' | 'RESOLVED_VERIFIED';
  slaHoursLimit: number;
  slaDeadline: string;
  dispatchedAt: string;
  resolvedAt?: string;
  beforeEvidenceNote: string;
  afterEvidenceNote?: string;
  postCleanupReading?: {
    pH: number;
    turbidity_ntu: number;
    dissolvedOxygen_mgL: number;
    verifiedByBadge: string;
  };
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const fallbackWorkOrders: MunicipalWorkOrder[] = [
  {
    id: 'WO-PB-081',
    incidentRef: 'AQUA-1041',
    title: 'Sukhna Lake Inflow Bio-Remediation & Silt Removal',
    category: 'Visible Algal Bloom / Scum',
    location: 'Sukhna Lake Shoreline (Near Rowing Canal, Sector 1)',
    assignedTeam: 'MC Chandigarh Public Health Taskforce 1',
    leadOfficer: 'Er. Rajeshwar Sharma',
    priority: 'HIGH',
    status: 'REMEDIATION_ACTIVE',
    slaHoursLimit: 24,
    slaDeadline: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    dispatchedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    beforeEvidenceNote: 'High green particulate algal density with DO drop to 4.2 mg/L at inlet weir.',
    afterEvidenceNote: 'Floating surface skim completed; bio-enzyme aeration dispensers anchored.',
    postCleanupReading: {
      pH: 7.3,
      turbidity_ntu: 1.4,
      dissolvedOxygen_mgL: 7.1,
      verifiedByBadge: 'CHD-MC-ENV-049'
    }
  },
  {
    id: 'WO-PB-082',
    incidentRef: 'AQUA-1039',
    title: 'Industrial Dye Neutralization & Interceptor Valve Inspection',
    category: 'Industrial Chemical Run-off',
    location: 'Budha Nullah Confluence, Ludhiana Industrial Zone',
    assignedTeam: 'PPCB Flying Squad Unit Alpha',
    leadOfficer: 'Dr. Paramjit Kahlon',
    priority: 'EMERGENCY',
    status: 'ON_SITE_SAMPLING',
    slaHoursLimit: 12,
    slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    dispatchedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    beforeEvidenceNote: 'Turbid dark violet effluent discharging directly into canal bed.',
    afterEvidenceNote: '',
  },
  {
    id: 'WO-PB-079',
    incidentRef: 'AQUA-1042',
    title: 'Distribution Main Pressure Flush & Sediment Scouring',
    category: 'Turbid Water / Muddy Discharge',
    location: 'Sector 35-B Residential Grid, Chandigarh',
    assignedTeam: 'Water Wing Rapid Line Services',
    leadOfficer: 'Sub-Divisional Officer Anil Joshi',
    priority: 'MEDIUM',
    status: 'RESOLVED_VERIFIED',
    slaHoursLimit: 18,
    slaDeadline: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    dispatchedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    beforeEvidenceNote: 'Turbidity 12.4 NTU post pipeline maintenance excavation.',
    afterEvidenceNote: 'Pipeline double-scoured and chlorinated; 3 household sample points verified clear.',
    postCleanupReading: {
      pH: 7.2,
      turbidity_ntu: 0.6,
      dissolvedOxygen_mgL: 7.8,
      verifiedByBadge: 'MC-WW-INSP-112'
    }
  }
];

export async function fetchWorkOrders(): Promise<MunicipalWorkOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/work-orders`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.orders)) return data.orders;
    }
  } catch (err) {
    console.info('[WorkOrders] API offline, loaded fallback work orders:', err);
  }
  return fallbackWorkOrders;
}

export async function dispatchWorkOrder(order: Partial<MunicipalWorkOrder>): Promise<MunicipalWorkOrder> {
  try {
    const res = await fetch(`${API_BASE}/work-orders/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.order;
    }
  } catch (err) {
    console.info('[WorkOrders] Local dispatch fallback:', err);
  }

  const now = new Date();
  return {
    id: `WO-PB-${Math.floor(100 + Math.random() * 900)}`,
    incidentRef: order.incidentRef || 'AQUA-1045',
    title: order.title || 'Water Remediation Work Order',
    category: order.category || 'Environmental Report',
    location: order.location || 'Municipal Grid',
    assignedTeam: order.assignedTeam || 'PPCB Rapid Response Unit 1',
    leadOfficer: order.leadOfficer || 'Er. Harminder Singh',
    priority: order.priority || 'HIGH',
    status: 'DISPATCHED',
    slaHoursLimit: order.slaHoursLimit || 24,
    slaDeadline: new Date(now.getTime() + (order.slaHoursLimit || 24) * 3600 * 1000).toISOString(),
    dispatchedAt: now.toISOString(),
    beforeEvidenceNote: order.beforeEvidenceNote || 'Dispatched for spot assessment.'
  };
}

export async function updateWorkOrderStatus(
  id: string,
  updates: Partial<MunicipalWorkOrder>
): Promise<MunicipalWorkOrder | null> {
  try {
    const res = await fetch(`${API_BASE}/work-orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.order;
    }
  } catch (err) {
    console.info('[WorkOrders] Local status update mode:', err);
  }

  const match = fallbackWorkOrders.find(w => w.id === id);
  if (match) {
    Object.assign(match, updates);
    return match;
  }
  return null;
}
