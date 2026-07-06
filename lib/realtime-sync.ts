import { useEffect, useRef, useState, useCallback } from "react";

export type SyncEventType =
  | "report-updated"
  | "incident-updated"
  | "leaderboard-updated"
  | "impact-updated"
  | "user-contribution"
  | "achievement-unlocked";

export interface SyncEvent {
  type: SyncEventType;
  data: any;
  timestamp: number;
}

export interface RealtimeSyncOptions {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

class RealtimeSyncClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectAttempts: number = 0;
  private listeners: Map<SyncEventType, Set<(event: SyncEvent) => void>> = new Map();
  private isConnected: boolean = false;

  constructor(options: RealtimeSyncOptions = {}) {
    this.url = options.url || (typeof window !== "undefined" ? this.getWebSocketUrl() : "");
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
  }

  private getWebSocketUrl(): string {
    if (typeof window === "undefined") return "";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/api/realtime`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const syncEvent: SyncEvent = JSON.parse(event.data);
            this.handleEvent(syncEvent);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.isConnected = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket disconnected");
          this.isConnected = false;
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect().catch((error) => {
          console.error("Reconnection failed:", error);
        });
      }, this.reconnectInterval);
    }
  }

  private handleEvent(event: SyncEvent) {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error("Error in event listener:", error);
        }
      });
    }
  }

  subscribe(eventType: SyncEventType, listener: (event: SyncEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  emit(event: SyncEvent) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(event));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
let syncClient: RealtimeSyncClient | null = null;

export function initializeRealtimeSync(options?: RealtimeSyncOptions): RealtimeSyncClient {
  if (!syncClient) {
    syncClient = new RealtimeSyncClient(options);
  }
  return syncClient;
}

export function getRealtimeSyncClient(): RealtimeSyncClient {
  if (!syncClient) {
    syncClient = new RealtimeSyncClient();
  }
  return syncClient;
}

// React Hook for real-time sync
export function useRealtimeSync(eventType: SyncEventType, onEvent: (event: SyncEvent) => void) {
  const clientRef = useRef<RealtimeSyncClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = getRealtimeSyncClient();
    clientRef.current = client;

    // Connect if not already connected
    if (!client.getConnectionStatus()) {
      client.connect().then(() => setIsConnected(true)).catch(console.error);
    } else {
      setIsConnected(true);
    }

    // Subscribe to events
    const unsubscribe = client.subscribe(eventType, onEvent);

    return () => {
      unsubscribe();
    };
  }, [eventType, onEvent]);

  return { isConnected };
}

// Polling fallback for environments without WebSocket
export class PollingSync {
  private pollInterval: number;
  private timerId: NodeJS.Timeout | null = null;
  private listeners: Map<SyncEventType, Set<(event: SyncEvent) => void>> = new Map();

  constructor(pollInterval: number = 5000) {
    this.pollInterval = pollInterval;
  }

  subscribe(eventType: SyncEventType, listener: (event: SyncEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(listener);

    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  start() {
    this.timerId = setInterval(async () => {
      try {
        const response = await fetch("/api/realtime/sync");
        const events: SyncEvent[] = await response.json();

        events.forEach((event) => {
          const listeners = this.listeners.get(event.type);
          if (listeners) {
            listeners.forEach((listener) => {
              try {
                listener(event);
              } catch (error) {
                console.error("Error in event listener:", error);
              }
            });
          }
        });
      } catch (error) {
        console.error("Polling sync error:", error);
      }
    }, this.pollInterval);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

// React Hook for polling sync
export function usePollingSync(eventType: SyncEventType, onEvent: (event: SyncEvent) => void) {
  const syncRef = useRef<PollingSync | null>(null);

  useEffect(() => {
    if (!syncRef.current) {
      syncRef.current = new PollingSync();
      syncRef.current.start();
    }

    const unsubscribe = syncRef.current.subscribe(eventType, onEvent);

    return () => {
      unsubscribe();
    };
  }, [eventType, onEvent]);

  return { isActive: true };
}
