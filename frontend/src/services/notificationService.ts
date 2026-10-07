/**
 * AquaTrust Locality Notification & Web Push Service
 */

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

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const LOCAL_STORAGE_KEY = 'aquatrust_user_subscription';
const SOUND_ENABLED_KEY = 'aquatrust_alert_sound';

export const fallbackBroadcasts: BroadcastAlert[] = [
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

export async function requestBrowserPushPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return 'denied';
  }
  return await Notification.requestPermission();
}

export function playAlertChime() {
  const soundEnabled = localStorage.getItem(SOUND_ENABLED_KEY) !== 'false';
  if (!soundEnabled) return;

  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (err) {
    // AudioContext blocked or not allowed yet
  }
}

export function triggerSystemNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    });
  }
  playAlertChime();
}

export async function fetchBroadcastAlerts(): Promise<BroadcastAlert[]> {
  try {
    const res = await fetch(`${API_BASE}/notifications/broadcasts`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.alerts)) return data.alerts;
    }
  } catch (err) {
    console.info('[Notifications] Loaded fallback broadcasts:', err);
  }
  return fallbackBroadcasts;
}

export async function subscribeToLocality(sub: Partial<LocalitySubscription>): Promise<LocalitySubscription> {
  const newSub: LocalitySubscription = {
    id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
    subscriberName: sub.subscriberName || 'Resident Subscriber',
    locality: sub.locality || 'Sector 35-B Chandigarh',
    notifyChannels: sub.notifyChannels || { browserPush: true, sms: false, email: true },
    contactInfo: sub.contactInfo || 'resident@aquatrust.org',
    subscribedCategories: sub.subscribedCategories || ['CRITICAL_SPIKE', 'BOIL_WATER_ADVISORY'],
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch(`${API_BASE}/notifications/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.subscription));
      return data.subscription;
    }
  } catch (err) {
    console.info('[Notifications] Local storage fallback for subscription:', err);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSub));
  return newSub;
}

export function getStoredSubscription(): LocalitySubscription | null {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
