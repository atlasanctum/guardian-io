import AsyncStorage from "@react-native-async-storage/async-storage";

export type NotificationChannel = "in-app" | "push" | "email";
export type NotificationEvent =
  | "report-escalation"
  | "incident-update"
  | "achievement-unlock"
  | "contribution-milestone"
  | "community-alert"
  | "system-update";

export interface NotificationPreference {
  event: NotificationEvent;
  channels: NotificationChannel[];
  enabled: boolean;
}

export interface NotificationSettings {
  userId: string;
  preferences: NotificationPreference[];
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
  language: "en" | "es" | "fr";
  timezone: string;
  updatedAt: number;
}

const STORAGE_KEY = "@guardian-io/notification-settings";

const DEFAULT_PREFERENCES: NotificationPreference[] = [
  {
    event: "report-escalation",
    channels: ["in-app", "push"],
    enabled: true,
  },
  {
    event: "incident-update",
    channels: ["in-app", "push"],
    enabled: true,
  },
  {
    event: "achievement-unlock",
    channels: ["in-app"],
    enabled: true,
  },
  {
    event: "contribution-milestone",
    channels: ["in-app", "push"],
    enabled: true,
  },
  {
    event: "community-alert",
    channels: ["push"],
    enabled: true,
  },
  {
    event: "system-update",
    channels: ["in-app"],
    enabled: false,
  },
];

export class NotificationPreferencesManager {
  private settings: NotificationSettings | null = null;

  async initialize(userId: string) {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        this.settings = JSON.parse(stored);
      } else {
        this.settings = {
          userId,
          preferences: DEFAULT_PREFERENCES,
          quietHours: {
            enabled: false,
            start: "22:00",
            end: "08:00",
          },
          language: "en",
          timezone: "UTC",
          updatedAt: Date.now(),
        };

        await this.save();
      }

      console.log("Notification preferences initialized");
    } catch (error) {
      console.error("Failed to initialize notification preferences:", error);
      this.settings = {
        userId,
        preferences: DEFAULT_PREFERENCES,
        language: "en",
        timezone: "UTC",
        updatedAt: Date.now(),
      };
    }
  }

  async getSettings(): Promise<NotificationSettings> {
    if (!this.settings) {
      throw new Error("Notification preferences not initialized");
    }
    return this.settings;
  }

  async updatePreference(event: NotificationEvent, channels: NotificationChannel[]) {
    if (!this.settings) {
      throw new Error("Notification preferences not initialized");
    }

    const preference = this.settings.preferences.find((p) => p.event === event);

    if (preference) {
      preference.channels = channels;
      preference.enabled = channels.length > 0;
    }

    this.settings.updatedAt = Date.now();
    await this.save();
  }

  async togglePreference(event: NotificationEvent) {
    if (!this.settings) {
      throw new Error("Notification preferences not initialized");
    }

    const preference = this.settings.preferences.find((p) => p.event === event);

    if (preference) {
      preference.enabled = !preference.enabled;
    }

    this.settings.updatedAt = Date.now();
    await this.save();
  }

  async setQuietHours(enabled: boolean, start?: string, end?: string) {
    if (!this.settings) {
      throw new Error("Notification preferences not initialized");
    }

    if (!this.settings.quietHours) {
      this.settings.quietHours = {
        enabled: false,
        start: "22:00",
        end: "08:00",
      };
    }

    this.settings.quietHours.enabled = enabled;

    if (start) {
      this.settings.quietHours.start = start;
    }

    if (end) {
      this.settings.quietHours.end = end;
    }

    this.settings.updatedAt = Date.now();
    await this.save();
  }

  async setLanguage(language: "en" | "es" | "fr") {
    if (!this.settings) {
      throw new Error("Notification preferences not initialized");
    }

    this.settings.language = language;
    this.settings.updatedAt = Date.now();
    await this.save();
  }

  async setTimezone(timezone: string) {
    if (!this.settings) {
      throw new Error("Notification preferences not initialized");
    }

    this.settings.timezone = timezone;
    this.settings.updatedAt = Date.now();
    await this.save();
  }

  shouldNotify(event: NotificationEvent, channel: NotificationChannel): boolean {
    if (!this.settings) {
      return false;
    }

    const preference = this.settings.preferences.find((p) => p.event === event);

    if (!preference || !preference.enabled) {
      return false;
    }

    if (!preference.channels.includes(channel)) {
      return false;
    }

    // Check quiet hours
    if (this.settings.quietHours?.enabled && channel === "push") {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const start = this.settings.quietHours.start;
      const end = this.settings.quietHours.end;

      // Simple time comparison (doesn't handle day boundary)
      if (start < end) {
        if (currentTime >= start && currentTime <= end) {
          return false;
        }
      } else {
        if (currentTime >= start || currentTime <= end) {
          return false;
        }
      }
    }

    return true;
  }

  private async save() {
    try {
      if (this.settings) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      }
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
      throw error;
    }
  }

  async reset() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      this.settings = null;
      console.log("Notification preferences reset");
    } catch (error) {
      console.error("Failed to reset notification preferences:", error);
      throw error;
    }
  }
}

// Singleton instance
let notificationPreferencesManager: NotificationPreferencesManager | null = null;

export function initializeNotificationPreferences(userId: string): NotificationPreferencesManager {
  if (!notificationPreferencesManager) {
    notificationPreferencesManager = new NotificationPreferencesManager();
  }
  notificationPreferencesManager.initialize(userId);
  return notificationPreferencesManager;
}

export function getNotificationPreferences(): NotificationPreferencesManager {
  if (!notificationPreferencesManager) {
    notificationPreferencesManager = new NotificationPreferencesManager();
  }
  return notificationPreferencesManager;
}

// React Hook
import { useState, useCallback } from "react";

export function useNotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const manager = getNotificationPreferences();

  const loadSettings = useCallback(async () => {
    try {
      const loaded = await manager.getSettings();
      setSettings(loaded);
    } catch (error) {
      console.error("Failed to load notification settings:", error);
    }
  }, []);

  const updatePreference = useCallback(
    async (event: NotificationEvent, channels: NotificationChannel[]) => {
      try {
        await manager.updatePreference(event, channels);
        const updated = await manager.getSettings();
        setSettings(updated);
      } catch (error) {
        console.error("Failed to update preference:", error);
      }
    },
    [],
  );

  const togglePreference = useCallback(async (event: NotificationEvent) => {
    try {
      await manager.togglePreference(event);
      const updated = await manager.getSettings();
      setSettings(updated);
    } catch (error) {
      console.error("Failed to toggle preference:", error);
    }
  }, []);

  const setQuietHours = useCallback(async (enabled: boolean, start?: string, end?: string) => {
    try {
      await manager.setQuietHours(enabled, start, end);
      const updated = await manager.getSettings();
      setSettings(updated);
    } catch (error) {
      console.error("Failed to set quiet hours:", error);
    }
  }, []);

  return {
    settings,
    loadSettings,
    updatePreference,
    togglePreference,
    setQuietHours,
  };
}
