import { Router } from 'express';

const router = Router();

// Mock endpoints for auth
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@aquatrust.com' && password === 'admin') {
    res.json({ token: 'mock-jwt-token', user: { role: 'admin', email } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/register', (req, res) => {
  res.json({ message: 'User registered' });
});

export default router;
