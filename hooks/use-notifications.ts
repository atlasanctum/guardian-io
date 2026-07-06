import { useEffect, useState, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface NotificationData {
  type: "report-escalated" | "incident-resolved" | "achievement-unlocked" | "custom";
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // Register for push notifications
  const registerForPushNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Skip on web
      if (Platform.OS === "web") {
        setIsLoading(false);
        return;
      }

      // Request notification permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        setError("Failed to get push notification permissions");
        setIsLoading(false);
        return;
      }

      // Get Expo push token
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);

      // Configure Android notification channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to register for push notifications";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Set up notification listeners
  const setupNotificationListeners = (
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (response: Notifications.NotificationResponse) => void,
  ) => {
    // Listen to notifications when app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listen to notification responses (when user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });
  };

  // Clean up listeners
  const cleanupNotificationListeners = () => {
    if (notificationListener.current) {
      Notifications.removeNotificationSubscription(notificationListener.current);
    }
    if (responseListener.current) {
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  };

  // Send local notification
  const sendLocalNotification = async (notification: NotificationData) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          badge: 1,
        },
        trigger: null, // Send immediately
      });
    } catch (err) {
      console.error("Failed to send local notification:", err);
    }
  };

  // Send scheduled notification
  const sendScheduledNotification = async (
    notification: NotificationData,
    delaySeconds: number,
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          badge: 1,
        },
        trigger: {
          seconds: delaySeconds,
        },
      });
    } catch (err) {
      console.error("Failed to send scheduled notification:", err);
    }
  };

  return {
    expoPushToken,
    registerForPushNotifications,
    setupNotificationListeners,
    cleanupNotificationListeners,
    sendLocalNotification,
    sendScheduledNotification,
    isLoading,
    error,
  };
}

// Predefined notification templates
export const NotificationTemplates = {
  reportEscalated: (reportId: string, escalationPath: string): NotificationData => ({
    type: "report-escalated",
    title: "Report Escalated",
    body: `Your report #${reportId} has been escalated to ${escalationPath}`,
    data: { reportId, escalationPath },
  }),

  incidentResolved: (incidentId: string, species: string): NotificationData => ({
    type: "incident-resolved",
    title: "Incident Resolved",
    body: `The ${species} incident #${incidentId} has been resolved`,
    data: { incidentId, species },
  }),

  achievementUnlocked: (achievementName: string, icon: string): NotificationData => ({
    type: "achievement-unlocked",
    title: "Achievement Unlocked!",
    body: `You've unlocked: ${achievementName} ${icon}`,
    data: { achievementName, icon },
  }),

  reportStatusUpdate: (reportId: string, status: string): NotificationData => ({
    type: "custom",
    title: "Report Status Update",
    body: `Your report #${reportId} is now ${status}`,
    data: { reportId, status },
  }),

  contributionRecorded: (points: number): NotificationData => ({
    type: "custom",
    title: "Contribution Recorded",
    body: `You earned ${points} points for your contribution!`,
    data: { points },
  }),
};
