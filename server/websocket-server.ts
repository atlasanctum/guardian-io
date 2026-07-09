import { WebSocketServer, WebSocket } from "ws";
import { Server as HTTPServer } from "http";
import { EventEmitter } from "events";

export type EventType =
  | "report-updated"
  | "report-escalated"
  | "incident-updated"
  | "leaderboard-updated"
  | "impact-updated"
  | "user-contribution"
  | "achievement-unlocked"
  | "connection"
  | "disconnect";

export interface BroadcastEvent {
  type: EventType;
  data: any;
  timestamp: number;
  userId?: string;
}

interface ClientConnection {
  ws: WebSocket;
  userId?: string;
  subscriptions: Set<EventType>;
}

export class GuardianWebSocketServer extends EventEmitter {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private clientCounter: number = 0;
  private eventHistory: Map<EventType, BroadcastEvent[]> = new Map();
  private maxHistorySize: number = 100;

  constructor(httpServer: HTTPServer, options?: { port?: number }) {
    super();

    this.wss = new WebSocketServer({
      server: httpServer,
      path: "/api/realtime",
    });

    this.setupEventHandlers();
    console.log("WebSocket server initialized");
  }

  private setupEventHandlers() {
    this.wss.on("connection", (ws: WebSocket) => {
      const clientId = `client-${++this.clientCounter}`;
      console.log(`Client connected: ${clientId}`);

      const connection: ClientConnection = {
        ws,
        subscriptions: new Set(),
      };

      this.clients.set(clientId, connection);

      // Send welcome message
      this.sendToClient(clientId, {
        type: "connection",
        data: { clientId, message: "Connected to Guardian-IO real-time server" },
        timestamp: Date.now(),
      });

      // Handle incoming messages
      ws.on("message", (data: string) => {
        try {
          const message = JSON.parse(data);
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      });

      // Handle client disconnect
      ws.on("close", () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
        this.emit("disconnect", { clientId });
      });

      // Handle errors
      ws.on("error", (error) => {
        console.error(`WebSocket error for ${clientId}:`, error);
      });

      this.emit("connection", { clientId });
    });
  }

  private handleClientMessage(clientId: string, message: any) {
    const connection = this.clients.get(clientId);
    if (!connection) return;

    const { action, type, data, userId } = message;

    switch (action) {
      case "subscribe":
        if (type) {
          connection.subscriptions.add(type);
          console.log(`Client ${clientId} subscribed to ${type}`);
        }
        break;

      case "unsubscribe":
        if (type) {
          connection.subscriptions.delete(type);
          console.log(`Client ${clientId} unsubscribed from ${type}`);
        }
        break;

      case "set-user-id":
        connection.userId = userId;
        console.log(`Client ${clientId} set user ID: ${userId}`);
        break;

      case "ping":
        this.sendToClient(clientId, {
          type: "pong",
          data: {},
          timestamp: Date.now(),
        });
        break;

      default:
        console.warn(`Unknown action: ${action}`);
    }
  }

  private sendToClient(clientId: string, event: BroadcastEvent) {
    const connection = this.clients.get(clientId);
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(event));
    }
  }

  private broadcastToSubscribers(event: BroadcastEvent) {
    // Store event in history
    if (!this.eventHistory.has(event.type)) {
      this.eventHistory.set(event.type, []);
    }
    const history = this.eventHistory.get(event.type)!;
    history.push(event);
    if (history.length > this.maxHistorySize) {
      history.shift();
    }

    // Broadcast to all subscribed clients
    this.clients.forEach((connection, clientId) => {
      if (connection.subscriptions.has(event.type)) {
        this.sendToClient(clientId, event);
      }
    });

    this.emit("broadcast", event);
  }

  // Public API Methods

  public broadcast(event: BroadcastEvent) {
    this.broadcastToSubscribers(event);
  }

  public broadcastReportUpdate(reportId: string, status: string, data: any) {
    this.broadcast({
      type: "report-updated",
      data: { reportId, status, ...data },
      timestamp: Date.now(),
    });
  }

  public broadcastReportEscalation(reportId: string, escalationPath: string, data: any) {
    this.broadcast({
      type: "report-escalated",
      data: { reportId, escalationPath, ...data },
      timestamp: Date.now(),
    });
  }

  public broadcastIncidentUpdate(incidentId: string, status: string, data: any) {
    this.broadcast({
      type: "incident-updated",
      data: { incidentId, status, ...data },
      timestamp: Date.now(),
    });
  }

  public broadcastLeaderboardUpdate(topContributors: any[]) {
    this.broadcast({
      type: "leaderboard-updated",
      data: { topContributors },
      timestamp: Date.now(),
    });
  }

  public broadcastImpactUpdate(metrics: any) {
    this.broadcast({
      type: "impact-updated",
      data: metrics,
      timestamp: Date.now(),
    });
  }

  public broadcastUserContribution(userId: string, contributionData: any) {
    this.broadcast({
      type: "user-contribution",
      data: { userId, ...contributionData },
      timestamp: Date.now(),
      userId,
    });
  }

  public broadcastAchievementUnlocked(userId: string, achievement: string, icon: string) {
    this.broadcast({
      type: "achievement-unlocked",
      data: { userId, achievement, icon },
      timestamp: Date.now(),
      userId,
    });
  }

  public sendToUser(userId: string, event: BroadcastEvent) {
    this.clients.forEach((connection, clientId) => {
      if (connection.userId === userId) {
        this.sendToClient(clientId, event);
      }
    });
  }

  public getConnectedClients(): number {
    return this.clients.size;
  }

  public getClientStats() {
    const stats = {
      totalConnected: this.clients.size,
      subscriptionStats: new Map<EventType, number>(),
    };

    this.clients.forEach((connection) => {
      connection.subscriptions.forEach((eventType) => {
        const current = stats.subscriptionStats.get(eventType) || 0;
        stats.subscriptionStats.set(eventType, current + 1);
      });
    });

    return stats;
  }

  public close() {
    this.wss.close();
    console.log("WebSocket server closed");
  }
}

// Singleton instance
let wsServer: GuardianWebSocketServer | null = null;

export function initializeWebSocketServer(httpServer: HTTPServer): GuardianWebSocketServer {
  if (!wsServer) {
    wsServer = new GuardianWebSocketServer(httpServer);
  }
  return wsServer;
}

export function getWebSocketServer(): GuardianWebSocketServer {
  if (!wsServer) {
    throw new Error("WebSocket server not initialized. Call initializeWebSocketServer first.");
  }
  return wsServer;
}
