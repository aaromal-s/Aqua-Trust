import { Router } from 'express';

const router = Router();

// Mock endpoints for locations
router.get('/', (req, res) => {
  res.json([
    { id: 'loc-1', name: 'River North Zone' },
    { id: 'loc-2', name: 'Lake East Zone' }
  ]);
});

export default router;
