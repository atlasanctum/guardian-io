import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SyncQueueItem {
  id: string;
  type: "report" | "incident" | "contribution" | "update";
  action: "create" | "update" | "delete";
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

export interface CachedData {
  key: string;
  data: any;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

const STORAGE_KEYS = {
  SYNC_QUEUE: "@guardian-io/sync-queue",
  CACHED_REPORTS: "@guardian-io/cached-reports",
  CACHED_INCIDENTS: "@guardian-io/cached-incidents",
  CACHED_PRODUCTS: "@guardian-io/cached-products",
  CACHED_CONTRIBUTIONS: "@guardian-io/cached-contributions",
  OFFLINE_ENABLED: "@guardian-io/offline-enabled",
  LAST_SYNC: "@guardian-io/last-sync",
};

export class OfflineStorageManager {
  private syncQueue: Map<string, SyncQueueItem> = new Map();
  private isInitialized: boolean = false;

  async initialize() {
    try {
      await this.loadSyncQueue();
      this.isInitialized = true;
      console.log("Offline storage manager initialized");
    } catch (error) {
      console.error("Failed to initialize offline storage:", error);
    }
  }

  // Sync Queue Management
  async addToSyncQueue(item: Omit<SyncQueueItem, "id" | "timestamp" | "retries">) {
    try {
      const queueItem: SyncQueueItem = {
        ...item,
        id: `${item.type}-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        retries: 0,
      };

      this.syncQueue.set(queueItem.id, queueItem);
      await this.saveSyncQueue();
      console.log(`Added to sync queue: ${queueItem.id}`);
      return queueItem;
    } catch (error) {
      console.error("Failed to add to sync queue:", error);
      throw error;
    }
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return Array.from(this.syncQueue.values());
  }

  async removeSyncQueueItem(itemId: string) {
    try {
      this.syncQueue.delete(itemId);
      await this.saveSyncQueue();
      console.log(`Removed from sync queue: ${itemId}`);
    } catch (error) {
      console.error("Failed to remove sync queue item:", error);
      throw error;
    }
  }

  async updateSyncQueueItemRetries(itemId: string, retries: number) {
    try {
      const item = this.syncQueue.get(itemId);
      if (item) {
        item.retries = retries;
        await this.saveSyncQueue();
      }
    } catch (error) {
      console.error("Failed to update sync queue item retries:", error);
      throw error;
    }
  }

  async clearSyncQueue() {
    try {
      this.syncQueue.clear();
      await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
      console.log("Sync queue cleared");
    } catch (error) {
      console.error("Failed to clear sync queue:", error);
      throw error;
    }
  }

  private async saveSyncQueue() {
    try {
      const queueArray = Array.from(this.syncQueue.values());
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queueArray));
    } catch (error) {
      console.error("Failed to save sync queue:", error);
      throw error;
    }
  }

  private async loadSyncQueue() {
    try {
      const queueData = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (queueData) {
        const queueArray: SyncQueueItem[] = JSON.parse(queueData);
        this.syncQueue.clear();
        queueArray.forEach((item) => {
          this.syncQueue.set(item.id, item);
        });
        console.log(`Loaded ${queueArray.length} items from sync queue`);
      }
    } catch (error) {
      console.error("Failed to load sync queue:", error);
    }
  }

  // Cache Management
  async cacheData(key: string, data: any, ttl?: number) {
    try {
      const cachedData: CachedData = {
        key,
        data,
        timestamp: Date.now(),
        ttl,
      };

      await AsyncStorage.setItem(key, JSON.stringify(cachedData));
      console.log(`Cached data: ${key}`);
    } catch (error) {
      console.error("Failed to cache data:", error);
      throw error;
    }
  }

  async getCachedData(key: string): Promise<any | null> {
    try {
      const cachedDataStr = await AsyncStorage.getItem(key);
      if (!cachedDataStr) {
        return null;
      }

      const cachedData: CachedData = JSON.parse(cachedDataStr);

      // Check if cache has expired
      if (cachedData.ttl) {
        const age = Date.now() - cachedData.timestamp;
        if (age > cachedData.ttl) {
          await AsyncStorage.removeItem(key);
          console.log(`Cache expired: ${key}`);
          return null;
        }
      }

      return cachedData.data;
    } catch (error) {
      console.error("Failed to get cached data:", error);
      return null;
    }
  }

  async cacheReports(reports: any[]) {
    try {
      await this.cacheData(STORAGE_KEYS.CACHED_REPORTS, reports, 3600000); // 1 hour TTL
    } catch (error) {
      console.error("Failed to cache reports:", error);
    }
  }

  async getCachedReports(): Promise<any[]> {
    try {
      const reports = await this.getCachedData(STORAGE_KEYS.CACHED_REPORTS);
      return reports || [];
    } catch (error) {
      console.error("Failed to get cached reports:", error);
      return [];
    }
  }

  async cacheIncidents(incidents: any[]) {
    try {
      await this.cacheData(STORAGE_KEYS.CACHED_INCIDENTS, incidents, 3600000); // 1 hour TTL
    } catch (error) {
      console.error("Failed to cache incidents:", error);
    }
  }

  async getCachedIncidents(): Promise<any[]> {
    try {
      const incidents = await this.getCachedData(STORAGE_KEYS.CACHED_INCIDENTS);
      return incidents || [];
    } catch (error) {
      console.error("Failed to get cached incidents:", error);
      return [];
    }
  }

  async cacheProducts(products: any[]) {
    try {
      await this.cacheData(STORAGE_KEYS.CACHED_PRODUCTS, products, 7200000); // 2 hour TTL
    } catch (error) {
      console.error("Failed to cache products:", error);
    }
  }

  async getCachedProducts(): Promise<any[]> {
    try {
      const products = await this.getCachedData(STORAGE_KEYS.CACHED_PRODUCTS);
      return products || [];
    } catch (error) {
      console.error("Failed to get cached products:", error);
      return [];
    }
  }

  async setLastSyncTime(timestamp: number) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
    } catch (error) {
      console.error("Failed to set last sync time:", error);
    }
  }

  async getLastSyncTime(): Promise<number> {
    try {
      const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return timestamp ? parseInt(timestamp) : 0;
    } catch (error) {
      console.error("Failed to get last sync time:", error);
      return 0;
    }
  }

  async clearAllCache() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CACHED_REPORTS,
        STORAGE_KEYS.CACHED_INCIDENTS,
        STORAGE_KEYS.CACHED_PRODUCTS,
        STORAGE_KEYS.CACHED_CONTRIBUTIONS,
      ]);
      console.log("All cache cleared");
    } catch (error) {
      console.error("Failed to clear all cache:", error);
      throw error;
    }
  }

  async getStorageStats() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stats = {
        totalKeys: keys.length,
        guardianIOKeys: keys.filter((k) => k.startsWith("@guardian-io")).length,
        syncQueueSize: this.syncQueue.size,
      };
      return stats;
    } catch (error) {
      console.error("Failed to get storage stats:", error);
      return { totalKeys: 0, guardianIOKeys: 0, syncQueueSize: 0 };
    }
  }
}

// Singleton instance
let offlineStorageManager: OfflineStorageManager | null = null;

export function initializeOfflineStorage(): OfflineStorageManager {
  if (!offlineStorageManager) {
    offlineStorageManager = new OfflineStorageManager();
  }
  return offlineStorageManager;
}

export function getOfflineStorage(): OfflineStorageManager {
  if (!offlineStorageManager) {
    offlineStorageManager = new OfflineStorageManager();
  }
  return offlineStorageManager;
}

// React Hook for offline storage
import { useEffect, useState } from "react";

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueueSize, setSyncQueueSize] = useState(0);
  const storage = getOfflineStorage();

  useEffect(() => {
    const initStorage = async () => {
      await storage.initialize();
      const queue = await storage.getSyncQueue();
      setSyncQueueSize(queue.length);
    };

    initStorage();
  }, []);

  const addToQueue = async (item: Omit<SyncQueueItem, "id" | "timestamp" | "retries">) => {
    const queueItem = await storage.addToSyncQueue(item);
    const queue = await storage.getSyncQueue();
    setSyncQueueSize(queue.length);
    return queueItem;
  };

  const processSyncQueue = async (syncFn: (item: SyncQueueItem) => Promise<boolean>) => {
    const queue = await storage.getSyncQueue();

    for (const item of queue) {
      if (item.retries < item.maxRetries) {
        try {
          const success = await syncFn(item);
          if (success) {
            await storage.removeSyncQueueItem(item.id);
          } else {
            await storage.updateSyncQueueItemRetries(item.id, item.retries + 1);
          }
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          await storage.updateSyncQueueItemRetries(item.id, item.retries + 1);
        }
      }
    }

    const updatedQueue = await storage.getSyncQueue();
    setSyncQueueSize(updatedQueue.length);
  };

  return {
    isOnline,
    setIsOnline,
    syncQueueSize,
    addToQueue,
    processSyncQueue,
    storage,
  };
}
