import { Router } from 'express';

const router = Router();

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

let workOrders: MunicipalWorkOrder[] = [
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

// GET all work orders
router.get('/', (req, res) => {
  res.json({
    totalCount: workOrders.length,
    activeCount: workOrders.filter(w => w.status !== 'RESOLVED_VERIFIED').length,
    resolvedCount: workOrders.filter(w => w.status === 'RESOLVED_VERIFIED').length,
    orders: workOrders
  });
});

// POST dispatch new work order
router.post('/dispatch', (req, res) => {
  const {
    incidentRef,
    title,
    category,
    location,
    assignedTeam,
    leadOfficer,
    priority = 'HIGH',
    slaHoursLimit = 24,
    beforeEvidenceNote
  } = req.body;

  const now = new Date();
  const deadline = new Date(now.getTime() + (Number(slaHoursLimit) || 24) * 3600 * 1000);

  const newOrder: MunicipalWorkOrder = {
    id: `WO-PB-${Math.floor(100 + Math.random() * 900)}`,
    incidentRef: incidentRef || `AQUA-${Math.floor(1000 + Math.random() * 9000)}`,
    title: title || 'Field Investigation & Water Sampling',
    category: category || 'Water Quality Grievance',
    location: location || 'Sector Grid Station',
    assignedTeam: assignedTeam || 'PPCB Rapid Response Unit 1',
    leadOfficer: leadOfficer || 'Officer On-Duty',
    priority,
    status: 'DISPATCHED',
    slaHoursLimit: Number(slaHoursLimit) || 24,
    slaDeadline: deadline.toISOString(),
    dispatchedAt: now.toISOString(),
    beforeEvidenceNote: beforeEvidenceNote || 'Citizen report dispatched for immediate field verification.'
  };

  workOrders.unshift(newOrder);

  res.status(201).json({
    status: 'success',
    message: 'Municipal work order created and dispatched to field team',
    order: newOrder
  });
});

// PATCH update status or resolve work order
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, afterEvidenceNote, postCleanupReading } = req.body;

  const order = workOrders.find(w => w.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Work order not found' });
  }

  if (status) order.status = status;
  if (afterEvidenceNote) order.afterEvidenceNote = afterEvidenceNote;
  if (postCleanupReading) order.postCleanupReading = postCleanupReading;
  if (status === 'RESOLVED_VERIFIED') {
    order.resolvedAt = new Date().toISOString();
  }

  res.json({
    status: 'success',
    message: `Work order ${id} updated to ${order.status}`,
    order
  });
});

export default router;
