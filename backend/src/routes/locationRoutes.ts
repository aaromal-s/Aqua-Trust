import { Router } from 'express';

const router = Router();

// Mock endpoints for locations
router.get('/', (req, res) => {
  res.json([
    { id: 'loc-1', name: 'Chandigarh Tricity Sector Grid' },
    { id: 'loc-2', name: 'Sukhna Lake Watershed' },
    { id: 'loc-3', name: 'Ludhiana Industrial District' },
    { id: 'loc-4', name: 'Harike Wetland Sanctuary (Punjab)' }
  ]);
});

export default router;
