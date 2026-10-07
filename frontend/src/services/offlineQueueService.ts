/**
 * AquaTrust Offline Field Technician Queue & Sync Service
 * Stores field telemetry and citizen samples in local storage/IndexedDB when offline
 * and synchronizes automatically upon network recovery.
 */

import { ingestTelemetry, type IngestPayload } from './api';

const QUEUE_STORAGE_KEY = 'aquatrust_field_offline_queue';

export interface QueuedTelemetryItem {
  id: string;
  queuedAt: string;
  payload: IngestPayload;
  syncAttempts: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
  lastError?: string;
}

class OfflineQueueService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Array<(queue: QueuedTelemetryItem[], isOnline: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notifyListeners();
        this.autoSync();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notifyListeners();
      });
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public getQueue(): QueuedTelemetryItem[] {
    try {
      const data = localStorage.getItem(QUEUE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: QueuedTelemetryItem[]) {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      this.notifyListeners();
      window.dispatchEvent(new CustomEvent('aquatrust:queue-updated', { detail: { count: queue.length } }));
    } catch (e) {
      console.error('Failed to save offline queue', e);
    }
  }

  public enqueue(payload: IngestPayload): QueuedTelemetryItem {
    const queue = this.getQueue();
    const item: QueuedTelemetryItem = {
      id: `QUEUE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      queuedAt: new Date().toISOString(),
      payload,
      syncAttempts: 0,
      status: 'PENDING'
    };

    queue.push(item);
    this.saveQueue(queue);

    // If online, try to sync immediately
    if (this.isOnline) {
      setTimeout(() => this.autoSync(), 100);
    }

    return item;
  }

  public async syncQueue(): Promise<{ syncedCount: number; failedCount: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { syncedCount: 0, failedCount: 0 };

    let syncedCount = 0;
    let failedCount = 0;
    const remainingQueue: QueuedTelemetryItem[] = [];

    for (const item of queue) {
      try {
        item.status = 'SYNCING';
        item.syncAttempts += 1;
        const res = await ingestTelemetry(item.payload);
        if (res.success && res.mode === 'live') {
          syncedCount++;
        } else {
          // If server responded only in simulated fallback or errored
          item.status = 'PENDING';
          remainingQueue.push(item);
        }
      } catch (err: any) {
        failedCount++;
        item.status = 'FAILED';
        item.lastError = err.message || 'Network sync error';
        remainingQueue.push(item);
      }
    }

    this.saveQueue(remainingQueue);
    return { syncedCount, failedCount };
  }

  public async autoSync() {
    if (!this.isOnline) return;
    const queue = this.getQueue();
    if (queue.length > 0) {
      console.log(`[Offline Sync] Reconnection detected. Synchronizing ${queue.length} field packets...`);
      await this.syncQueue();
    }
  }

  public clearQueue() {
    this.saveQueue([]);
  }

  public subscribe(cb: (queue: QueuedTelemetryItem[], isOnline: boolean) => void) {
    this.listeners.push(cb);
    cb(this.getQueue(), this.isOnline);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notifyListeners() {
    const q = this.getQueue();
    this.listeners.forEach(cb => cb(q, this.isOnline));
  }
}

export const offlineQueue = new OfflineQueueService();
