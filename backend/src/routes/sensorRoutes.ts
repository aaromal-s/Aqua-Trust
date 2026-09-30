import { Router } from 'express';

const router = Router();

// Mock endpoints for sensors
router.get('/', (req, res) => {
  res.json([
    { id: 'AQ-001', location: 'River North', status: 'online' },
    { id: 'AQ-014', location: 'Lake East', status: 'warning' }
  ]);
});

router.get('/:id/readings', (req, res) => {
  res.json({
    sensorId: req.params.id,
    readings: [
      { timestamp: new Date(), pH: 7.2, turbidity: 4.5, temp: 24.1 }
    ]
  });
});

export default router;
