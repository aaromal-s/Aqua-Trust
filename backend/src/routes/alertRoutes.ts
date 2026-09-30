import { Router } from 'express';

const router = Router();

// Mock endpoints for alerts
router.get('/', (req, res) => {
  res.json([
    { id: 1, type: 'critical', message: 'High turbidity detected', location: 'AQ-014' },
    { id: 2, type: 'warning', message: 'pH deviation detected', location: 'AQ-001' }
  ]);
});

export default router;
