import { Router } from 'express';

const router = Router();

export interface LocalitySubscription {
  id: string;
  subscriberName: string;
  locality: string;
  notifyChannels: {
    browserPush: boolean;
    sms: boolean;
    email: boolean;
  };
  contactInfo: string;
  subscribedCategories: string[];
  createdAt: string;
}

export interface BroadcastAlert {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  locality: string;
  message: string;
  recommendedAction: string;
  issuedAt: string;
  expiresInHours: number;
}

let subscriptions: LocalitySubscription[] = [
  {
    id: 'SUB-101',
    subscriberName: 'Sector 35 Residents Welfare Association',
    locality: 'Sector 35 Chandigarh',
    notifyChannels: { browserPush: true, sms: true, email: true },
    contactInfo: 'rwa35chd@gmail.com',
    subscribedCategories: ['CRITICAL_SPIKE', 'PIPE_FLUSH_NOTICE', 'BOIL_WATER_ADVISORY'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'SUB-102',
    subscriberName: 'Punjab Agricultural University (PAU) Water Cell',
    locality: 'Ludhiana Industrial & Sutlej Basin',
    notifyChannels: { browserPush: true, sms: false, email: true },
    contactInfo: 'pau-water@punjab.gov.in',
    subscribedCategories: ['CRITICAL_SPIKE', 'CHEMICAL_DISCHARGE_WARNING'],
    createdAt: new Date().toISOString()
  }
];

let activeBroadcasts: BroadcastAlert[] = [
  {
    id: 'ADV-2026-04',
    title: 'Post-Maintenance Pipeline Scour Completed — Safe Water Restored',
    severity: 'INFO',
    locality: 'Sector 35-B Chandigarh',
    message: 'Turbidity returned to 0.6 NTU (BIS 10500 compliant). Tap water safe for all domestic consumption.',
    recommendedAction: 'Standard consumption resumed; running tap for 30s recommended if taps were dry.',
    issuedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expiresInHours: 24
  },
  {
    id: 'ADV-2026-03',
    title: 'Upstream Effluent Surge Alert — Sluice Diversion Engaged',
    severity: 'WARNING',
    locality: 'Budha Nullah - Phillaur Sutlej Confluence',
    message: 'Elevated COD and suspended solids detected upstream. Canal diversion gates partially opened.',
    recommendedAction: 'Direct livestock watering downstream paused until evening telemetry pass.',
    issuedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    expiresInHours: 12
  }
];

// GET active broadcasts
router.get('/broadcasts', (req, res) => {
  res.json({
    activeCount: activeBroadcasts.length,
    alerts: activeBroadcasts
  });
});

// POST subscribe to locality alerts
router.post('/subscribe', (req, res) => {
  const {
    subscriberName,
    locality,
    notifyChannels,
    contactInfo,
    subscribedCategories
  } = req.body;

  const newSub: LocalitySubscription = {
    id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
    subscriberName: subscriberName || 'Citizen Subscriber',
    locality: locality || 'Chandigarh & Punjab Regional Grid',
    notifyChannels: notifyChannels || { browserPush: true, sms: false, email: true },
    contactInfo: contactInfo || 'anonymous@citizen.grid',
    subscribedCategories: subscribedCategories || ['CRITICAL_SPIKE', 'BOIL_WATER_ADVISORY'],
    createdAt: new Date().toISOString()
  };

  subscriptions.push(newSub);

  res.status(201).json({
    status: 'success',
    message: `Subscribed successfully to real-time water safety alerts for ${newSub.locality}`,
    subscription: newSub
  });
});

// POST broadcast emergency alert
router.post('/broadcast', (req, res) => {
  const {
    title,
    severity = 'WARNING',
    locality,
    message,
    recommendedAction,
    expiresInHours = 24
  } = req.body;

  const newAlert: BroadcastAlert = {
    id: `ADV-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
    title: title || 'Urgent Water Quality Advisory',
    severity,
    locality: locality || 'Region-wide',
    message: message || 'Notice issued regarding water parameter deviation.',
    recommendedAction: recommendedAction || 'Boil water before drinking or use verified filtered water.',
    issuedAt: new Date().toISOString(),
    expiresInHours: Number(expiresInHours) || 24
  };

  activeBroadcasts.unshift(newAlert);

  res.status(201).json({
    status: 'success',
    message: `Emergency advisory broadcasted to ${subscriptions.length} active registered subscribers`,
    alert: newAlert,
    dispatchedToCount: subscriptions.length
  });
});

export default router;
