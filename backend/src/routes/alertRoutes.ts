import { Router } from 'express';

const router = Router();

// Mock endpoints for alerts
router.get('/', (req, res) => {
  res.json([
    { id: 1, type: 'critical', message: 'Industrial chemical & turbidity spike (14.2 NTU)', location: 'Budha Nullah (Ludhiana)' },
    { id: 2, type: 'warning', message: 'Catchment run-off causing slight pH deviation (6.8)', location: 'Sukhna Lake (Sector 1, Chandigarh)' },
    { id: 3, type: 'info', message: 'Routine spectrophotometer sensor calibration recommended', location: 'Kajauli Waterworks (Sector 39 Grid)' },
    { id: 4, type: 'warning', message: 'Seasonal low Dissolved Oxygen reading (5.2 mg/L)', location: 'Harike Wetland Sanctuary' }
  ]);
});

export default router;
