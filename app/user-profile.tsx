import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joinDate: string;
  totalPoints: number;
  totalContributions: number;
  level: number;
  badges: string[];
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    points: number;
    date: string;
  }>;
}

const MOCK_USER_PROFILE: UserProfile = {
  id: "user-123",
  name: "Sarah Guardian",
  role: "Community Guardian",
  avatar: "👩",
  joinDate: "Jun 1, 2026",
  totalPoints: 1250,
  totalContributions: 18,
  level: 5,
  badges: ["🌟", "🏆", "🌍", "💚"],
  recentActivity: [
    {
      id: "1",
      type: "report",
      description: "Submitted wildlife incident report",
      points: 50,
      date: "Jul 4, 2026",
    },
    {
      id: "2",
      type: "observation",
      description: "Documented endangered species sighting",
      points: 75,
      date: "Jul 2, 2026",
    },
    {
      id: "3",
      type: "support",
      description: "Supported 3 other community members",
      points: 30,
      date: "Jun 30, 2026",
    },
    {
      id: "4",
      type: "achievement",
      description: "Unlocked 'Voice of Change' achievement",
      points: 100,
      date: "Jun 28, 2026",
    },
  ],
};

export default function UserProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const [profile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "rewards">("overview");

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to edit profile screen
  };

  const getNextLevelPoints = () => {
    return (profile.level + 1) * 500;
  };

  const getProgressPercentage = () => {
    const nextLevel = getNextLevelPoints();
    return (profile.totalPoints / nextLevel) * 100;
  };

  const getLevelBadgeColor = (level: number) => {
    if (level <= 2) return "#9CA3AF";
    if (level <= 5) return "#3B82F6";
    if (level <= 10) return "#8B5CF6";
    return "#EC4899";
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Profile Header */}
          <View className="bg-surface rounded-xl p-6 border border-border items-center gap-4">
            <Text className="text-6xl">{profile.avatar}</Text>
            <View className="items-center gap-1">
              <Text className="text-2xl font-bold text-foreground">{profile.name}</Text>
              <Text className="text-sm text-muted">{profile.role}</Text>
              <Text className="text-xs text-muted mt-1">Joined {profile.joinDate}</Text>
            </View>

            <View className="flex-row gap-2 mt-2">
              {profile.badges.map((badge, idx) => (
                <Text key={idx} className="text-2xl">
                  {badge}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleEditProfile}
              style={{ borderColor: colors.border }}
              className="w-full py-2 rounded-lg items-center border active:opacity-80 mt-2"
            >
              <Text className="text-foreground font-semibold text-sm">Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Level Progress */}
          <View className="bg-primary/10 rounded-xl p-4 border border-primary/30 gap-3">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm font-semibold text-primary">Level {profile.level}</Text>
                <Text className="text-xs text-primary/80 mt-1">
                  {profile.totalPoints} / {getNextLevelPoints()} points
                </Text>
              </View>
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: getLevelBadgeColor(profile.level) }}
              >
                <Text className="text-lg font-bold text-white">{profile.level}</Text>
              </View>
            </View>
            <View className="h-2 bg-primary/20 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
              />
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row gap-2">
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl font-bold text-primary">{profile.totalPoints}</Text>
              <Text className="text-xs text-muted text-center">Total Points</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl font-bold text-forest">{profile.totalContributions}</Text>
              <Text className="text-xs text-muted text-center">Contributions</Text>
            </View>
            <View className="flex-1 bg-surface rounded-lg p-4 border border-border items-center gap-2">
              <Text className="text-2xl font-bold text-ocean">{profile.badges.length}</Text>
              <Text className="text-xs text-muted text-center">Badges</Text>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-2 bg-surface rounded-lg p-1 border border-border">
            {(["overview", "activity", "rewards"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  backgroundColor: activeTab === tab ? colors.primary : "transparent",
                  flex: 1,
                }}
                className="py-2 rounded items-center active:opacity-80"
              >
                <Text
                  className="text-xs font-semibold capitalize"
                  style={{
                    color: activeTab === tab ? "white" : colors.foreground,
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <View className="gap-3">
              <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                <Text className="text-sm font-semibold text-foreground">About</Text>
                <Text className="text-xs text-muted leading-relaxed">
                  Active community member dedicated to protecting workers' rights and biodiversity. Passionate about creating positive change through data and collaboration.
                </Text>
              </View>

              <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                <Text className="text-sm font-semibold text-foreground">Specialties</Text>
                <View className="flex-row flex-wrap gap-2 mt-2">
                  {["Wildlife Monitoring", "Report Verification", "Community Support"].map(
                    (specialty, idx) => (
                      <View
                        key={idx}
                        className="bg-primary/10 rounded-full px-3 py-1 border border-primary/30"
                      >
                        <Text className="text-xs font-semibold text-primary">{specialty}</Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Recent Activity</Text>
              {profile.recentActivity.map((activity) => (
                <View
                  key={activity.id}
                  className="bg-surface rounded-lg p-3 border border-border flex-row items-start gap-3"
                >
                  <Text className="text-lg">
                    {activity.type === "report"
                      ? "📋"
                      : activity.type === "observation"
                        ? "👁️"
                        : activity.type === "support"
                          ? "🤝"
                          : "🏆"}
                  </Text>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {activity.description}
                    </Text>
                    <Text className="text-xs text-muted mt-1">{activity.date}</Text>
                  </View>
                  <View className="bg-primary/10 rounded px-2 py-1">
                    <Text className="text-xs font-bold text-primary">+{activity.points}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Rewards Tab */}
          {activeTab === "rewards" && (
            <View className="gap-3">
              <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                <Text className="text-sm font-semibold text-foreground">Available Rewards</Text>
                {[
                  { name: "Coffee Voucher", cost: 100, icon: "☕" },
                  { name: "Tree Planting", cost: 250, icon: "🌱" },
                  { name: "Donation Match", cost: 500, icon: "❤️" },
                ].map((reward, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center justify-between p-3 bg-background rounded-lg border border-border"
                  >
                    <View className="flex-row items-center gap-2 flex-1">
                      <Text className="text-2xl">{reward.icon}</Text>
                      <View>
                        <Text className="text-sm font-semibold text-foreground">{reward.name}</Text>
                        <Text className="text-xs text-muted">{reward.cost} points</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      disabled={profile.totalPoints < reward.cost}
                      style={{
                        backgroundColor:
                          profile.totalPoints >= reward.cost ? colors.primary : colors.border,
                      }}
                      className="px-3 py-1 rounded active:opacity-80"
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: profile.totalPoints >= reward.cost ? "white" : colors.muted,
                        }}
                      >
                        Redeem
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View className="bg-forest/10 rounded-lg p-4 border border-forest/30 gap-2">
                <Text className="text-sm font-semibold text-forest">💡 Earn More Points</Text>
                <Text className="text-xs text-forest/80 leading-relaxed">
                  Submit reports, document incidents, support other members, and unlock achievements to earn points for rewards.
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-2 mt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ borderColor: colors.border }}
              className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
            >
              <Text className="text-foreground font-semibold">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={{ backgroundColor: colors.primary }}
              className="flex-1 py-3 rounded-lg items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
