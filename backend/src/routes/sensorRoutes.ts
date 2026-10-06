import { Router } from 'express';
import mongoose from 'mongoose';
import Reading from '../models/Reading';

const router = Router();

// In-memory fallback dataset synchronized with frontend Punjab & Chandigarh hydrology grid
let sensorsData = [
  { id: 'AQ-CHD-01', location: 'Sukhna Lake (Sector 1, Chandigarh)', type: 'Multiparameter Sonde', status: 'ONLINE', battery: 92, signal: 'STRONG', lastSync: '2m ago' },
  { id: 'AQ-CHD-02', location: 'Kajauli Waterworks (Sector 39 Grid)', type: 'Turbidity & Fluoride Sonde', status: 'ONLINE', battery: 88, signal: 'STRONG', lastSync: '1m ago' },
  { id: 'AQ-LUD-01', location: 'Budha Nullah (Ludhiana Industrial)', type: 'Toxic Effluents & Heavy Metals', status: 'WARNING', battery: 45, signal: 'WEAK', lastSync: '14m ago' },
  { id: 'AQ-PB-03', location: 'Harike Pattan Wetland (Tarn Taran)', type: 'Bio-Sonde & Nitrates Probe', status: 'ONLINE', battery: 79, signal: 'STRONG', lastSync: '5m ago' },
  { id: 'AQ-BTI-01', location: 'Bathinda Malwa Deep Aquifer', type: 'Uranium & TDS Spectrometer', status: 'OFFLINE', battery: 12, signal: 'NONE', lastSync: '12h ago' }
];

let recentIngests: Array<{
  device_id: string;
  telemetry: any;
  protocol: string;
  status_flag: string;
  received_at: string;
}> = [];

// GET all sensors
router.get('/', (req, res) => {
  res.json(sensorsData);
});

// POST add sensor
router.post('/', (req, res) => {
  const { id, location, type, battery, signal } = req.body;
  const newSensor = {
    id: id || `AQ-${Date.now().toString().slice(-4)}`,
    location: location || 'Unspecified Watershed',
    type: type || 'Multiparameter Sonde',
    status: 'ONLINE' as const,
    battery: battery ?? 100,
    signal: signal || 'STRONG',
    lastSync: 'Just now'
  };
  sensorsData = [newSensor, ...sensorsData];
  res.status(201).json({ status: 'success', sensor: newSensor });
});

// GET public telemetry summary for researchers & transparency portals
router.get('/public', (req, res) => {
  res.json({
    network: 'AquaTrust Punjab & Chandigarh Hydrology Grid',
    standards: 'BIS 10500:2012 & WHO Guidelines',
    timestamp: new Date().toISOString(),
    stations: [
      { id: 'AQ-CHD-01', location: 'Sukhna Lake (Sector 1, Chandigarh)', status: 'ONLINE', pH: 7.4, turbidity_ntu: 1.2, tds_ppm: 168 },
      { id: 'AQ-CHD-02', location: 'Kajauli Waterworks (Sector 39 Grid)', status: 'ONLINE', pH: 7.2, turbidity_ntu: 0.9, tds_ppm: 142 },
      { id: 'AQ-LUD-01', location: 'Budha Nullah (Ludhiana Industrial)', status: 'CRITICAL', pH: 5.2, turbidity_ntu: 18.8, tds_ppm: 840 },
      { id: 'AQ-PB-03', location: 'Harike Pattan Wetland (Tarn Taran)', status: 'ONLINE', pH: 7.6, turbidity_ntu: 3.4, tds_ppm: 210 },
      { id: 'AQ-BTI-01', location: 'Bathinda Malwa Deep Aquifer', status: 'OFFLINE', pH: 7.8, turbidity_ntu: 3.8, tds_ppm: 520 }
    ],
    recentIngestsCount: recentIngests.length
  });
});

// GET readings for a specific sensor
router.get('/:id/readings', (req, res) => {
  const { id } = req.params;
  const matchingIngests = recentIngests.filter(ing => ing.device_id === id);

  res.json({
    sensorId: id,
    readings: matchingIngests.length > 0 ? matchingIngests.map(i => ({
      timestamp: i.received_at,
      ...i.telemetry
    })) : [
      { timestamp: new Date(), pH: 7.3, turbidity: 1.4, temp: 24.1, tds: 168 }
    ]
  });
});

// POST ingest hardware telemetry (NB-IoT, MQTT, HTTP)
router.post('/ingest', async (req, res) => {
  const { device_id, telemetry, protocol, status_flag } = req.body;
  const timestamp = new Date().toISOString();

  const record = {
    device_id: device_id || 'AQ-CHD-01',
    telemetry: telemetry || { pH: 7.3, turbidity_ntu: 1.2, temp_c: 24.0 },
    protocol: (protocol || 'HTTP').toUpperCase(),
    status_flag: status_flag || 'normal',
    received_at: timestamp
  };

  recentIngests.unshift(record);
  if (recentIngests.length > 50) recentIngests.pop();

  // Update sensor status in sensor list if matched
  const matchedSensor = sensorsData.find(s => s.id === record.device_id);
  if (matchedSensor) {
    matchedSensor.lastSync = 'Just now';
    if (status_flag === 'critical') matchedSensor.status = 'WARNING';
  }

  // Attempt to persist to MongoDB if connection is ready
  try {
    if (mongoose.connection.readyState === 1) {
      await Reading.create({
        sensorId: record.device_id,
        timestamp: new Date(),
        parameters: {
          pH: telemetry?.pH,
          turbidity: telemetry?.turbidity_ntu,
          temperature: telemetry?.temp_c,
          dissolvedOxygen: telemetry?.chlorine_ppm,
        },
        anomalyDetected: status_flag === 'critical'
      });
    }
  } catch (err) {
    console.warn('[IoT Ingest] Mongo persist skipped (in-memory buffer active):', err);
  }

  console.log(`[IoT Ingest] Received packet from ${record.device_id} via ${record.protocol}: pH=${record.telemetry.pH}, Turbidity=${record.telemetry.turbidity_ntu}`);

  res.status(200).json({
    status: 'success',
    message: 'Telemetry packet successfully ingested into AquaTrust grid',
    received_at: timestamp,
    device_id: record.device_id,
    status_flag: record.status_flag
  });
});

export default router;
