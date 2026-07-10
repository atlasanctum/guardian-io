import { Text, View, TouchableOpacity, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  useNotificationPreferences,
  NotificationEvent,
  NotificationChannel,
} from "@/lib/notification-preferences";
import * as Haptics from "expo-haptics";

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const colors = useColors();
  const { settings, loadSettings, updatePreference, togglePreference, setQuietHours } =
    useNotificationPreferences();
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings?.quietHours) {
      setQuietHoursEnabled(settings.quietHours.enabled);
      setQuietStart(settings.quietHours.start);
      setQuietEnd(settings.quietHours.end);
    }
  }, [settings]);

  const handleTogglePreference = async (event: NotificationEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await togglePreference(event);
  };

  const handleToggleChannel = async (
    event: NotificationEvent,
    channel: NotificationChannel,
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const preference = settings?.preferences.find((p) => p.event === event);
    if (preference) {
      const newChannels = preference.channels.includes(channel)
        ? preference.channels.filter((c) => c !== channel)
        : [...preference.channels, channel];

      await updatePreference(event, newChannels);
    }
  };

  const handleToggleQuietHours = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newState = !quietHoursEnabled;
    setQuietHoursEnabled(newState);
    await setQuietHours(newState, quietStart, quietEnd);
  };

  const getEventLabel = (event: NotificationEvent): string => {
    switch (event) {
      case "report-escalation":
        return "Report Escalation";
      case "incident-update":
        return "Incident Updates";
      case "achievement-unlock":
        return "Achievement Unlocked";
      case "contribution-milestone":
        return "Contribution Milestone";
      case "community-alert":
        return "Community Alerts";
      case "system-update":
        return "System Updates";
      default:
        return event;
    }
  };

  const getEventDescription = (event: NotificationEvent): string => {
    switch (event) {
      case "report-escalation":
        return "When your report is escalated to authorities";
      case "incident-update":
        return "When wildlife incidents are updated";
      case "achievement-unlock":
        return "When you unlock new badges";
      case "contribution-milestone":
        return "When you reach contribution milestones";
      case "community-alert":
        return "Important community announcements";
      case "system-update":
        return "App updates and maintenance notices";
      default:
        return "";
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">🔔</Text>
            <Text className="text-3xl font-bold text-foreground">Notifications</Text>
            <Text className="text-sm text-muted">Customize your notification preferences</Text>
          </View>

          {/* Quiet Hours Section */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Quiet Hours</Text>
                <Text className="text-xs text-muted mt-1">
                  Pause push notifications during your rest time
                </Text>
              </View>
              <Switch
                value={quietHoursEnabled}
                onValueChange={handleToggleQuietHours}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={quietHoursEnabled ? colors.primary : colors.muted}
              />
            </View>

            {quietHoursEnabled && (
              <View className="gap-2 pt-2 border-t border-border">
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-muted flex-1">From</Text>
                  <View
                    style={{ borderColor: colors.border }}
                    className="bg-background rounded px-3 py-2 border"
                  >
                    <Text className="text-sm font-semibold text-foreground">{quietStart}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-muted flex-1">To</Text>
                  <View
                    style={{ borderColor: colors.border }}
                    className="bg-background rounded px-3 py-2 border"
                  >
                    <Text className="text-sm font-semibold text-foreground">{quietEnd}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Notification Events */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Notification Events</Text>

            {settings?.preferences.map((preference) => (
              <View
                key={preference.event}
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="p-4 rounded-lg border gap-3"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {getEventLabel(preference.event)}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {getEventDescription(preference.event)}
                    </Text>
                  </View>
                  <Switch
                    value={preference.enabled}
                    onValueChange={() => handleTogglePreference(preference.event)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={preference.enabled ? colors.primary : colors.muted}
                  />
                </View>

                {preference.enabled && (
                  <View className="gap-2 pt-2 border-t border-border">
                    <Text className="text-xs font-semibold text-muted uppercase">Channels</Text>
                    <View className="flex-row gap-2 flex-wrap">
                      {(["in-app", "push", "email"] as const).map((channel) => (
                        <TouchableOpacity
                          key={channel}
                          onPress={() =>
                            handleToggleChannel(preference.event, channel)
                          }
                          style={{
                            backgroundColor: preference.channels.includes(channel)
                              ? colors.primary
                              : colors.background,
                            borderColor: colors.border,
                          }}
                          className="px-3 py-1 rounded-full border active:opacity-80"
                        >
                          <Text
                            className="text-xs font-semibold capitalize"
                            style={{
                              color: preference.channels.includes(channel)
                                ? "white"
                                : colors.foreground,
                            }}
                          >
                            {channel === "in-app" ? "In-App" : channel === "push" ? "Push" : "Email"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary/30 gap-2">
            <Text className="text-sm font-semibold text-primary">💡 Notification Tips</Text>
            <Text className="text-xs text-primary/80 leading-relaxed">
              Choose which events you want to be notified about and how you prefer to receive them.
              Quiet hours will suppress push notifications during your rest time.
            </Text>
          </View>

          {/* Footer */}
          <View className="flex-row gap-2 mt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ borderColor: colors.border }}
              className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
            >
              <Text className="text-foreground font-semibold">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)")}
              style={{ backgroundColor: colors.primary }}
              className="flex-1 py-3 rounded-lg items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
