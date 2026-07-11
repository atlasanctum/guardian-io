import * as admin from "firebase-admin";

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: string;
  sound?: string;
}

export interface SendNotificationOptions {
  tokens: string[];
  payload: NotificationPayload;
  android?: {
    priority?: "high" | "normal";
    ttl?: number;
  };
  apns?: {
    headers?: Record<string, string>;
  };
  webpush?: {
    headers?: Record<string, string>;
  };
}

export class FCMService {
  private initialized = false;

  async initialize(serviceAccountPath?: string) {
    if (this.initialized) return;

    try {
      if (!admin.apps.length) {
        if (serviceAccountPath) {
          const serviceAccount = require(serviceAccountPath);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        } else {
          admin.initializeApp();
        }
      }
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize Firebase Admin SDK:", error);
      throw error;
    }
  }

  async sendNotification(options: SendNotificationOptions): Promise<string[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    const messaging = admin.messaging();
    const successfulTokens: string[] = [];
    const failedTokens: string[] = [];

    for (const token of options.tokens) {
      try {
        const message: admin.messaging.Message = {
          notification: {
            title: options.payload.title,
            body: options.payload.body,
            imageUrl: options.payload.badge,
          },
          data: options.payload.data || {},
          token,
          android: options.android
            ? {
                priority: options.android.priority || "high",
                ttl: options.android.ttl || 86400,
              }
            : undefined,
          apns: options.apns
            ? {
                headers: options.apns.headers || {},
              }
            : undefined,
          webpush: options.webpush
            ? {
                headers: options.webpush.headers || {},
              }
            : undefined,
        };

        await messaging.send(message);
        successfulTokens.push(token);
      } catch (error) {
        console.error(`Failed to send notification to token ${token}:`, error);
        failedTokens.push(token);
      }
    }

    return successfulTokens;
  }

  async sendMulticast(
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<admin.messaging.BatchResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const messaging = admin.messaging();
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.badge,
      },
      data: payload.data || {},
      tokens,
    };

    return messaging.sendMulticast(message);
  }

  async subscribeToTopic(tokens: string[], topic: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    const messaging = admin.messaging();
    await messaging.subscribeToTopic(tokens, topic);
  }

  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    const messaging = admin.messaging();
    await messaging.unsubscribeFromTopic(tokens, topic);
  }

  async sendToTopic(topic: string, payload: NotificationPayload): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    const messaging = admin.messaging();
    const message: admin.messaging.Message = {
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.badge,
      },
      data: payload.data || {},
      topic,
    };

    return messaging.send(message);
  }
}

// Predefined notification templates
export const NotificationTemplates = {
  reportEscalated: (reportId: string, escalationLevel: string): NotificationPayload => ({
    title: "Report Escalated",
    body: `Your report #${reportId} has been escalated to ${escalationLevel}`,
    data: {
      type: "report_escalated",
      reportId,
      escalationLevel,
    },
    badge: "🚨",
    sound: "default",
  }),

  incidentResolved: (incidentId: string, resolution: string): NotificationPayload => ({
    title: "Incident Resolved",
    body: `Incident #${incidentId} has been resolved: ${resolution}`,
    data: {
      type: "incident_resolved",
      incidentId,
    },
    badge: "✅",
    sound: "default",
  }),

  achievementUnlocked: (achievementName: string, points: number): NotificationPayload => ({
    title: "Achievement Unlocked!",
    body: `You earned "${achievementName}" and gained ${points} points!`,
    data: {
      type: "achievement_unlocked",
      achievementName,
      points: points.toString(),
    },
    badge: "🏆",
    sound: "default",
  }),

  weeklyDigest: (stats: Record<string, string>): NotificationPayload => ({
    title: "Your Weekly Impact Summary",
    body: `Check out your contributions this week: ${stats.contributions || "0"} reports, ${stats.impact || "0"} impact points`,
    data: {
      type: "weekly_digest",
      ...stats,
    },
    badge: "📊",
    sound: "default",
  }),

  communityAlert: (alertType: string, message: string): NotificationPayload => ({
    title: "Community Alert",
    body: message,
    data: {
      type: "community_alert",
      alertType,
    },
    badge: "👥",
    sound: "default",
  }),

  leaderboardUpdate: (rank: number, totalPoints: number): NotificationPayload => ({
    title: "Leaderboard Update",
    body: `You're now ranked #${rank} with ${totalPoints} points!`,
    data: {
      type: "leaderboard_update",
      rank: rank.toString(),
      totalPoints: totalPoints.toString(),
    },
    badge: "🏅",
    sound: "default",
  }),
};

let fcmService: FCMService | null = null;

export function initializeFCM(): FCMService {
  if (!fcmService) {
    fcmService = new FCMService();
  }
  return fcmService;
}

export function getFCM(): FCMService {
  if (!fcmService) {
    fcmService = new FCMService();
  }
  return fcmService;
}
