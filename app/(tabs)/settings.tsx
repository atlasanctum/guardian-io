import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useRole } from "@/lib/role-context";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const router = useRouter();
  const { role, setRole } = useRole();
  const colors = useColors();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleChangeRole = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/role-selection");
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getRoleLabel = () => {
    switch (role) {
      case "worker":
        return "Worker";
      case "community-guardian":
        return "Community Guardian";
      case "business":
        return "Business";
      case "consumer":
        return "Consumer";
      default:
        return "Unknown";
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
          </View>

          {/* Account Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Account</Text>

            <View className="bg-surface rounded-xl p-4 gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-foreground font-medium">Current Role</Text>
                <Text className="text-sm text-muted">{getRoleLabel()}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/user-profile')}
                style={{ backgroundColor: colors.ocean }}
                className="py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">View My Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/data-export')}
                style={{ backgroundColor: colors.forest }}
                className="py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Export & Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/notification-preferences')}
                style={{ backgroundColor: colors.warning }}
                className="py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/analytics-insights')}
                style={{ backgroundColor: colors.ocean }}
                className="py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Your Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/community')}
                style={{ backgroundColor: colors.primary }}
                className="py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Community Forum</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/language-settings')}
                style={{ backgroundColor: colors.warning }}
                className="py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Language Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleChangeRole}
                style={{ backgroundColor: colors.primary }}
                className="py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Change Role</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferences Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Preferences</Text>

            <View className="bg-surface rounded-xl p-4 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-foreground">Notifications</Text>
                <Switch
                  value={notifications}
                  onValueChange={handleToggleNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={notifications ? colors.primary : colors.muted}
                />
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row justify-between items-center">
                <Text className="text-base text-foreground">Dark Mode</Text>
                <Switch
                  value={darkMode}
                  onValueChange={handleToggleDarkMode}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={darkMode ? colors.primary : colors.muted}
                />
              </View>
            </View>
          </View>

          {/* Language Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Language</Text>

            <View className="bg-surface rounded-xl p-4 gap-3">
              <TouchableOpacity className="py-3 px-4 rounded-lg border border-border active:opacity-80">
                <Text className="text-base text-foreground">English</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-3 px-4 rounded-lg border border-border active:opacity-80">
                <Text className="text-base text-foreground">Español</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-3 px-4 rounded-lg border border-border active:opacity-80">
                <Text className="text-base text-foreground">Français</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View className="bg-surface rounded-xl p-4 gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-muted">Version</Text>
                <Text className="text-base text-foreground font-medium">1.0.0</Text>
              </View>
              <TouchableOpacity className="py-3 px-4 rounded-lg border border-border active:opacity-80">
                <Text className="text-base text-foreground">Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-3 px-4 rounded-lg border border-border active:opacity-80">
                <Text className="text-base text-foreground">Terms of Service</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-3 px-4 rounded-lg border border-border active:opacity-80">
                <Text className="text-base text-foreground">Help & Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 pb-4">
            <Text className="text-xs text-muted text-center">
              Guardian-IO v1.0.0
            </Text>
            <Text className="text-xs text-muted text-center">
              Transparent. Resilient. Regenerative.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
