import { Router } from 'express';

const router = Router();

export interface WatershedStation {
  id: string;
  name: string;
  distanceKm: number;
  type: 'INDUSTRIAL_DRAIN' | 'RIVER_CONFLUENCE' | 'WETLAND_SANCTUARY' | 'CANAL_REGULATOR' | 'DRINKING_WATER_INTAKE';
  coordinates: [number, number]; // [lat, lng]
  baselineToxicity: number; // mg/L or NTU
  travelTimeHours: number; // calculated based on flow speed
  predictedToxicity: number;
  arrivalETA: string;
  intakeShutdownRecommended: boolean;
  intakeStatus: 'ACTIVE' | 'DIVERTIED' | 'SHUTDOWN_LOCKED';
}

interface PropagationPayload {
  spillSourceId: string;
  spillType: 'HEAVY_METALS_EFFLUENT' | 'MONSOON_AGRICULTURAL_RUNOFF' | 'TEXTILE_DYE_SURGE' | 'MUNICIPAL_SEWAGE_SPILL';
  initialConcentrationPpm: number;
  riverFlowVelocityMps: number; // 0.8 - 2.5 m/s
  interventionGateDiversion: boolean;
  interventionAeratorsActive: boolean;
  interventionIntakeLock: boolean;
  projectionHours: number; // 0 - 48 hours
}

const RIVER_STATIONS_BASE = [
  {
    id: 'NODE-01',
    name: 'Budha Nullah Industrial Outfall (Ludhiana)',
    distanceKm: 0,
    type: 'INDUSTRIAL_DRAIN' as const,
    coordinates: [30.9010, 75.8573] as [number, number],
    baselineToxicity: 45
  },
  {
    id: 'NODE-02',
    name: 'Sutlej River Confluence (Phillaur-Bilga)',
    distanceKm: 28,
    type: 'RIVER_CONFLUENCE' as const,
    coordinates: [31.0211, 75.7892] as [number, number],
    baselineToxicity: 22
  },
  {
    id: 'NODE-03',
    name: 'Harike Pattan Wetland Sanctuary (Tarn Taran)',
    distanceKm: 84,
    type: 'WETLAND_SANCTUARY' as const,
    coordinates: [31.1523, 74.9621] as [number, number],
    baselineToxicity: 14
  },
  {
    id: 'NODE-04',
    name: 'Sirhind Feeder Regulator (Muktsar / Malwa)',
    distanceKm: 112,
    type: 'CANAL_REGULATOR' as const,
    coordinates: [30.6800, 74.6500] as [number, number],
    baselineToxicity: 11
  },
  {
    id: 'NODE-05',
    name: 'Bathinda Urban Water Supply Treatment Intake',
    distanceKm: 156,
    type: 'DRINKING_WATER_INTAKE' as const,
    coordinates: [30.2110, 74.9455] as [number, number],
    baselineToxicity: 8
  }
];

// POST /api/simulator/propagate
router.post('/propagate', (req, res) => {
  const {
    spillSourceId = 'NODE-01',
    spillType = 'HEAVY_METALS_EFFLUENT',
    initialConcentrationPpm = 320,
    riverFlowVelocityMps = 1.3,
    interventionGateDiversion = false,
    interventionAeratorsActive = false,
    interventionIntakeLock = false,
    projectionHours = 12
  }: PropagationPayload = req.body;

  const flowSpeedKmh = riverFlowVelocityMps * 3.6; // ~4.68 km/h
  const now = new Date();

  let plumePeakKm = flowSpeedKmh * projectionHours;

  const simulatedNodes = RIVER_STATIONS_BASE.map(station => {
    const travelTimeHours = station.distanceKm / flowSpeedKmh;
    const etaDate = new Date(now.getTime() + travelTimeHours * 3600 * 1000);

    // Natural decay & dispersion attenuation factor
    let dispersionFactor = Math.exp(-0.018 * station.distanceKm);

    // If plume hasn't reached station yet
    const hasPlumeArrived = projectionHours >= travelTimeHours;
    
    // Impact of interventions
    let interventionDamping = 1.0;
    if (interventionGateDiversion && station.distanceKm >= 84) {
      interventionDamping *= 0.35; // 65% reduction due to canal diversion
    }
    if (interventionAeratorsActive) {
      interventionDamping *= 0.65; // 35% reduction from bio-oxidation
    }

    let calculatedToxicity = station.baselineToxicity;
    if (hasPlumeArrived) {
      // Gaussian plume tail model
      const deltaHours = projectionHours - travelTimeHours;
      const gaussianCurve = Math.exp(-Math.pow(deltaHours / 6, 2));
      const addedContaminant = initialConcentrationPpm * dispersionFactor * interventionDamping * gaussianCurve;
      calculatedToxicity = Math.round(station.baselineToxicity + addedContaminant);
    }

    const intakeShutdownRecommended = calculatedToxicity > 50;
    const intakeStatus = interventionIntakeLock && station.type === 'DRINKING_WATER_INTAKE' 
      ? 'SHUTDOWN_LOCKED' 
      : interventionGateDiversion && station.type === 'CANAL_REGULATOR'
      ? 'DIVERTIED'
      : 'ACTIVE';

    return {
      ...station,
      travelTimeHours: Number(travelTimeHours.toFixed(1)),
      predictedToxicity: calculatedToxicity,
      arrivalETA: etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intakeShutdownRecommended,
      intakeStatus
    };
  });

  res.json({
    timestamp: now.toISOString(),
    projectionHours,
    spillType,
    riverFlowVelocityMps,
    flowSpeedKmh: Number(flowSpeedKmh.toFixed(2)),
    plumeFrontPositionKm: Math.round(plumePeakKm),
    activeInterventions: {
      gateDiversion: interventionGateDiversion,
      aerators: interventionAeratorsActive,
      intakeLock: interventionIntakeLock
    },
    stations: simulatedNodes,
    safetyAdvisory: simulatedNodes.some(s => s.intakeShutdownRecommended)
      ? 'CRITICAL ADVISORY: Downstream contaminant plume breaches safe limits for drinking intake plants. Municipal pumps should remain isolated.'
      : 'ADVISORY: Contamination levels managed within regulatory thresholds.'
  });
});

export default router;
