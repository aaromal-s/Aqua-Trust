/**
 * AquaTrust Watershed Contamination Propagation Simulator Service
 * Models toxic plume downstream propagation, arrival ETA, and emergency gate interventions
 */

export interface WatershedStationState {
  id: string;
  name: string;
  distanceKm: number;
  type: 'INDUSTRIAL_DRAIN' | 'RIVER_CONFLUENCE' | 'WETLAND_SANCTUARY' | 'CANAL_REGULATOR' | 'DRINKING_WATER_INTAKE';
  coordinates: [number, number];
  baselineToxicity: number;
  travelTimeHours: number;
  predictedToxicity: number;
  arrivalETA: string;
  intakeShutdownRecommended: boolean;
  intakeStatus: 'ACTIVE' | 'DIVERTIED' | 'SHUTDOWN_LOCKED';
}

export interface SimulationResult {
  timestamp: string;
  projectionHours: number;
  spillType: string;
  riverFlowVelocityMps: number;
  flowSpeedKmh: number;
  plumeFrontPositionKm: number;
  activeInterventions: {
    gateDiversion: boolean;
    aerators: boolean;
    intakeLock: boolean;
  };
  stations: WatershedStationState[];
  safetyAdvisory: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function runSimulation(params: {
  spillSourceId?: string;
  spillType?: string;
  initialConcentrationPpm?: number;
  riverFlowVelocityMps?: number;
  interventionGateDiversion?: boolean;
  interventionAeratorsActive?: boolean;
  interventionIntakeLock?: boolean;
  projectionHours?: number;
}): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/simulator/propagate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.info('[Simulator] Backend offline, calculating hydrological model in-browser:', err);
  }

  // Pure mathematical in-browser fallback
  const {
    initialConcentrationPpm = 320,
    riverFlowVelocityMps = 1.3,
    interventionGateDiversion = false,
    interventionAeratorsActive = false,
    interventionIntakeLock = false,
    projectionHours = 12
  } = params;

  const flowSpeedKmh = riverFlowVelocityMps * 3.6;
  const now = new Date();
  const plumePeakKm = flowSpeedKmh * projectionHours;

  const baseNodes = [
    { id: 'NODE-01', name: 'Budha Nullah Industrial Outfall (Ludhiana)', distanceKm: 0, type: 'INDUSTRIAL_DRAIN' as const, coordinates: [30.9010, 75.8573] as [number, number], baselineToxicity: 45 },
    { id: 'NODE-02', name: 'Sutlej River Confluence (Phillaur-Bilga)', distanceKm: 28, type: 'RIVER_CONFLUENCE' as const, coordinates: [31.0211, 75.7892] as [number, number], baselineToxicity: 22 },
    { id: 'NODE-03', name: 'Harike Pattan Wetland Sanctuary (Tarn Taran)', distanceKm: 84, type: 'WETLAND_SANCTUARY' as const, coordinates: [31.1523, 74.9621] as [number, number], baselineToxicity: 14 },
    { id: 'NODE-04', name: 'Sirhind Feeder Regulator (Muktsar / Malwa)', distanceKm: 112, type: 'CANAL_REGULATOR' as const, coordinates: [30.6800, 74.6500] as [number, number], baselineToxicity: 11 },
    { id: 'NODE-05', name: 'Bathinda Urban Water Supply Treatment Intake', distanceKm: 156, type: 'DRINKING_WATER_INTAKE' as const, coordinates: [30.2110, 74.9455] as [number, number], baselineToxicity: 8 },
  ];

  const stations: WatershedStationState[] = baseNodes.map(st => {
    const travelTimeHours = Number((st.distanceKm / flowSpeedKmh).toFixed(1));
    const etaDate = new Date(now.getTime() + travelTimeHours * 3600 * 1000);
    const dispersion = Math.exp(-0.018 * st.distanceKm);
    
    let damping = 1.0;
    if (interventionGateDiversion && st.distanceKm >= 84) damping *= 0.35;
    if (interventionAeratorsActive) damping *= 0.65;

    let toxicity = st.baselineToxicity;
    if (projectionHours >= travelTimeHours) {
      const delta = projectionHours - travelTimeHours;
      const gaussian = Math.exp(-Math.pow(delta / 6, 2));
      toxicity = Math.round(st.baselineToxicity + initialConcentrationPpm * dispersion * damping * gaussian);
    }

    const shutdown = toxicity > 50;
    const intakeStatus = interventionIntakeLock && st.type === 'DRINKING_WATER_INTAKE'
      ? 'SHUTDOWN_LOCKED'
      : interventionGateDiversion && st.type === 'CANAL_REGULATOR'
      ? 'DIVERTIED'
      : 'ACTIVE';

    return {
      ...st,
      travelTimeHours,
      predictedToxicity: toxicity,
      arrivalETA: etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intakeShutdownRecommended: shutdown,
      intakeStatus
    };
  });

  return {
    timestamp: now.toISOString(),
    projectionHours,
    spillType: params.spillType || 'HEAVY_METALS_EFFLUENT',
    riverFlowVelocityMps,
    flowSpeedKmh: Number(flowSpeedKmh.toFixed(2)),
    plumeFrontPositionKm: Math.round(plumePeakKm),
    activeInterventions: {
      gateDiversion: !!interventionGateDiversion,
      aerators: !!interventionAeratorsActive,
      intakeLock: !!interventionIntakeLock,
    },
    stations,
    safetyAdvisory: stations.some(s => s.intakeShutdownRecommended)
      ? 'CRITICAL ADVISORY: Downstream contaminant plume breaches safe limits for drinking intake plants. Municipal pumps should remain isolated.'
      : 'ADVISORY: Contamination levels managed within regulatory thresholds.'
  };
}
