import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface AnalyticsData {
  totalContributions: number;
  totalPoints: number;
  currentLevel: number;
  nextLevelPoints: number;
  contributionTrend: number; // percentage change
  reportsSubmitted: number;
  incidentsReported: number;
  productsScanned: number;
  communityRank: number;
  communitySize: number;
  impactMetrics: {
    workersProtected: number;
    speciesProtected: number;
    forestPreserved: string;
    wagesImproved: string;
  };
  monthlyTrend: Array<{
    month: string;
    contributions: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    icon: string;
    unlockedAt: string;
    rarity: "common" | "rare" | "epic" | "legendary";
  }>;
}

// Mock data
const MOCK_ANALYTICS: AnalyticsData = {
  totalContributions: 247,
  totalPoints: 12450,
  currentLevel: 8,
  nextLevelPoints: 15000,
  contributionTrend: 23,
  reportsSubmitted: 45,
  incidentsReported: 78,
  productsScanned: 124,
  communityRank: 127,
  communitySize: 8942,
  impactMetrics: {
    workersProtected: 2847,
    speciesProtected: 156,
    forestPreserved: "12,500 acres",
    wagesImproved: "$487,500",
  },
  monthlyTrend: [
    { month: "Jan", contributions: 15 },
    { month: "Feb", contributions: 22 },
    { month: "Mar", contributions: 28 },
    { month: "Apr", contributions: 35 },
    { month: "May", contributions: 42 },
    { month: "Jun", contributions: 48 },
    { month: "Jul", contributions: 52 },
  ],
  achievements: [
    {
      id: "1",
      name: "First Step",
      icon: "👣",
      unlockedAt: "2 months ago",
      rarity: "common",
    },
    {
      id: "2",
      name: "Voice of Change",
      icon: "🎤",
      unlockedAt: "1 month ago",
      rarity: "rare",
    },
    {
      id: "3",
      name: "Guardian Angel",
      icon: "👼",
      unlockedAt: "2 weeks ago",
      rarity: "epic",
    },
  ],
};

export default function AnalyticsInsightsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedTab, setSelectedTab] = useState<"overview" | "trends" | "achievements">(
    "overview",
  );
  const data = MOCK_ANALYTICS;

  const handleTabChange = (tab: "overview" | "trends" | "achievements") => {
    setSelectedTab(tab);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const progressPercentage = (data.totalPoints / data.nextLevelPoints) * 100;
  const rankPercentage = (data.communityRank / data.communitySize) * 100;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">📊</Text>
            <Text className="text-3xl font-bold text-foreground">Your Analytics</Text>
            <Text className="text-sm text-muted">Track your impact and progress</Text>
          </View>

          {/* Tab Navigation */}
          <View className="flex-row gap-2 bg-surface rounded-lg p-1 border border-border">
            {(["overview", "trends", "achievements"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabChange(tab)}
                style={{
                  backgroundColor: selectedTab === tab ? colors.primary : "transparent",
                  flex: 1,
                }}
                className="py-2 rounded-md items-center active:opacity-80"
              >
                <Text
                  className="text-sm font-semibold capitalize"
                  style={{
                    color: selectedTab === tab ? "white" : colors.foreground,
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <View className="gap-4">
              {/* Level Progress */}
              <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="p-4 rounded-lg border gap-3"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-sm font-semibold text-foreground">Level {data.currentLevel}</Text>
                    <Text className="text-xs text-muted mt-1">Guardian</Text>
                  </View>
                  <Text className="text-3xl">🏆</Text>
                </View>
                <View className="bg-background rounded-full h-2 overflow-hidden">
                  <View
                    style={{
                      width: `${Math.min(progressPercentage, 100)}%`,
                      backgroundColor: colors.primary,
                    }}
                    className="h-full"
                  />
                </View>
                <Text className="text-xs text-muted">
                  {data.totalPoints.toLocaleString()} / {data.nextLevelPoints.toLocaleString()} points
                </Text>
              </View>

              {/* Community Rank */}
              <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="p-4 rounded-lg border gap-3"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-sm font-semibold text-foreground">Community Rank</Text>
                    <Text className="text-xs text-muted mt-1">
                      #{data.communityRank} of {data.communitySize.toLocaleString()}
                    </Text>
                  </View>
                  <Text className="text-3xl">📈</Text>
                </View>
                <View className="bg-background rounded-full h-2 overflow-hidden">
                  <View
                    style={{
                      width: `${100 - rankPercentage}%`,
                      backgroundColor: colors.success,
                    }}
                    className="h-full"
                  />
                </View>
              </View>

              {/* Contribution Stats */}
              <View className="grid grid-cols-2 gap-3">
                <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  className="p-3 rounded-lg border items-center gap-2"
                >
                  <Text className="text-2xl">📝</Text>
                  <Text className="text-lg font-bold text-foreground">{data.reportsSubmitted}</Text>
                  <Text className="text-xs text-muted text-center">Reports</Text>
                </View>
                <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  className="p-3 rounded-lg border items-center gap-2"
                >
                  <Text className="text-2xl">🐾</Text>
                  <Text className="text-lg font-bold text-foreground">{data.incidentsReported}</Text>
                  <Text className="text-xs text-muted text-center">Incidents</Text>
                </View>
                <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  className="p-3 rounded-lg border items-center gap-2"
                >
                  <Text className="text-2xl">📱</Text>
                  <Text className="text-lg font-bold text-foreground">{data.productsScanned}</Text>
                  <Text className="text-xs text-muted text-center">Scans</Text>
                </View>
                <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  className="p-3 rounded-lg border items-center gap-2"
                >
                  <Text className="text-2xl">⭐</Text>
                  <Text className="text-lg font-bold text-foreground">{data.totalContributions}</Text>
                  <Text className="text-xs text-muted text-center">Total</Text>
                </View>
              </View>

              {/* Impact Metrics */}
              <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="p-4 rounded-lg border gap-3"
              >
                <Text className="text-sm font-semibold text-foreground">Your Global Impact</Text>
                <View className="gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">Workers Protected</Text>
                    <Text className="text-sm font-bold text-foreground">
                      {data.impactMetrics.workersProtected.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">Species Protected</Text>
                    <Text className="text-sm font-bold text-foreground">
                      {data.impactMetrics.speciesProtected}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">Forest Preserved</Text>
                    <Text className="text-sm font-bold text-foreground">
                      {data.impactMetrics.forestPreserved}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">Wages Improved</Text>
                    <Text className="text-sm font-bold text-foreground">
                      {data.impactMetrics.wagesImproved}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Trends Tab */}
          {selectedTab === "trends" && (
            <View className="gap-4">
              <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                className="p-4 rounded-lg border gap-3"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-semibold text-foreground">Monthly Contributions</Text>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-xs font-bold text-success">↑ {data.contributionTrend}%</Text>
                  </View>
                </View>

                {/* Simple bar chart */}
                <View className="gap-2">
                  {data.monthlyTrend.map((item, index) => {
                    const maxValue = Math.max(...data.monthlyTrend.map((m) => m.contributions));
                    const percentage = (item.contributions / maxValue) * 100;

                    return (
                      <View key={index} className="gap-1">
                        <Text className="text-xs text-muted">{item.month}</Text>
                        <View className="bg-background rounded-full h-6 overflow-hidden flex-row items-center">
                          <View
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: colors.primary,
                            }}
                            className="h-full items-center justify-center"
                          >
                            {percentage > 20 && (
                              <Text className="text-xs font-bold text-white">
                                {item.contributions}
                              </Text>
                            )}
                          </View>
                          {percentage <= 20 && (
                            <Text className="text-xs font-bold text-foreground ml-2">
                              {item.contributions}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View className="bg-primary/10 rounded-lg p-4 border border-primary/30 gap-2">
                <Text className="text-sm font-semibold text-primary">📈 Trend Analysis</Text>
                <Text className="text-xs text-primary/80 leading-relaxed">
                  Your contributions have increased by {data.contributionTrend}% this month. Keep up the great work!
                </Text>
              </View>
            </View>
          )}

          {/* Achievements Tab */}
          {selectedTab === "achievements" && (
            <View className="gap-4">
              {data.achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  className="p-4 rounded-lg border flex-row items-center gap-3"
                >
                  <Text className="text-3xl">{achievement.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {achievement.name}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      Unlocked {achievement.unlockedAt}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor:
                        achievement.rarity === "legendary"
                          ? "#FFD700"
                          : achievement.rarity === "epic"
                            ? "#9C27B0"
                            : achievement.rarity === "rare"
                              ? "#2196F3"
                              : "#4CAF50",
                    }}
                    className="px-2 py-1 rounded"
                  >
                    <Text className="text-xs font-bold text-white capitalize">
                      {achievement.rarity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Footer */}
          <View className="flex-row gap-2 mt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ borderColor: colors.border }}
              className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
            >
              <Text className="text-foreground font-semibold">Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
