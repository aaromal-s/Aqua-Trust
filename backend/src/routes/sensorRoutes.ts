import { Router } from 'express';

const router = Router();

// Mock endpoints for sensors
router.get('/', (req, res) => {
  res.json([
    { id: 'AQ-001', location: 'Sukhna Lake (Chandigarh)', status: 'online' },
    { id: 'AQ-014', location: 'Kajauli Waterworks (Sector 39)', status: 'online' },
    { id: 'AQ-022', location: 'Budha Nullah (Ludhiana)', status: 'warning' },
    { id: 'AQ-035', location: 'Harike Wetland Sanctuary', status: 'online' }
  ]);
});

router.get('/public', (req, res) => {
  res.json({
    network: 'AquaTrust Punjab & Chandigarh Hydrology Grid',
    standards: 'BIS 10500:2012 & WHO Guidelines',
    timestamp: new Date().toISOString(),
    stations: [
      { id: 'AQ-CHD-01', location: 'Sukhna Lake (Sector 1, Chandigarh)', status: 'ONLINE', pH: 7.4, turbidity_ntu: 1.2, tds_ppm: 168 },
      { id: 'AQ-CHD-02', location: 'Kajauli Waterworks (Sector 39 Grid)', status: 'ONLINE', pH: 7.2, turbidity_ntu: 0.9, tds_ppm: 142 },
      { id: 'AQ-LUD-01', location: 'Budha Nullah (Ludhiana Industrial)', status: 'CRITICAL', pH: 5.2, turbidity_ntu: 18.8, tds_ppm: 840 },
      { id: 'AQ-PB-03', location: 'Harike Pattan Wetland (Tarn Taran)', status: 'ONLINE', pH: 7.6, turbidity_ntu: 3.4, tds_ppm: 210 }
    ]
  });
});

router.get('/:id/readings', (req, res) => {
  res.json({
    sensorId: req.params.id,
    readings: [
      { timestamp: new Date(), pH: 7.3, turbidity: 1.4, temp: 24.1, tds: 168 }
    ]
  });
});

router.post('/ingest', (req, res) => {
  const { device_id, telemetry, protocol, status_flag } = req.body;
  console.log(`[IoT Ingest] Received packet from device ${device_id} via ${protocol || 'MQTT'}:`, telemetry);
  
  res.status(200).json({
    status: 'success',
    message: 'Telemetry packet successfully ingested into AquaTrust grid',
    received_at: new Date().toISOString(),
    device_id: device_id || 'AQ-001',
    status_flag: status_flag || 'normal'
  });
});

export default router;
