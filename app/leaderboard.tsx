import { Text, View, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  points: number;
  contributions: number;
  badges: string[];
  avatar: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  unlockedAt?: string;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 1,
    userName: "Sarah Guardian",
    points: 2850,
    contributions: 47,
    badges: ["🌟", "🏆", "🌍"],
    avatar: "👩",
  },
  {
    rank: 2,
    userId: 2,
    userName: "Marcus Protector",
    points: 2620,
    contributions: 42,
    badges: ["🌟", "🏆"],
    avatar: "👨",
  },
  {
    rank: 3,
    userId: 3,
    userName: "Elena Defender",
    points: 2410,
    contributions: 38,
    badges: ["🌟"],
    avatar: "👩",
  },
  {
    rank: 4,
    userId: 4,
    userName: "James Advocate",
    points: 1950,
    contributions: 31,
    badges: [],
    avatar: "👨",
  },
  {
    rank: 5,
    userId: 5,
    userName: "Amara Guardian",
    points: 1680,
    contributions: 26,
    badges: [],
    avatar: "👩",
  },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-report",
    name: "First Voice",
    description: "Submit your first report",
    icon: "🎤",
    requirement: 1,
    unlockedAt: "Jun 15, 2026",
  },
  {
    id: "ten-reports",
    name: "Persistent Guardian",
    description: "Submit 10 reports",
    icon: "🔟",
    requirement: 10,
    unlockedAt: "Jul 1, 2026",
  },
  {
    id: "fifty-reports",
    name: "Voice of Change",
    description: "Submit 50 reports",
    icon: "📢",
    requirement: 50,
  },
  {
    id: "hundred-points",
    name: "Community Builder",
    description: "Earn 100 contribution points",
    icon: "🏗️",
    requirement: 100,
    unlockedAt: "Jun 28, 2026",
  },
  {
    id: "thousand-points",
    name: "Impact Maker",
    description: "Earn 1000 contribution points",
    icon: "⭐",
    requirement: 1000,
  },
  {
    id: "helper",
    name: "Helping Hand",
    description: "Support 5 other reports",
    icon: "🤝",
    requirement: 5,
  },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const [viewMode, setViewMode] = useState<"leaderboard" | "achievements">("leaderboard");
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);

  const handleSelectEntry = (entry: LeaderboardEntry) => {
    setSelectedEntry(entry);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "•";
    }
  };

  const renderLeaderboardEntry = (entry: LeaderboardEntry) => (
    <TouchableOpacity
      onPress={() => handleSelectEntry(entry)}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <View className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row items-center gap-3">
        <Text className="text-2xl">{getMedalEmoji(entry.rank)}</Text>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-lg">{entry.avatar}</Text>
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground">{entry.userName}</Text>
              <Text className="text-xs text-muted">{entry.contributions} contributions</Text>
            </View>
          </View>
          <View className="flex-row gap-1">
            {entry.badges.map((badge, idx) => (
              <Text key={idx} className="text-sm">
                {badge}
              </Text>
            ))}
          </View>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-primary">{entry.points}</Text>
          <Text className="text-xs text-muted">points</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAchievementCard = (achievement: Achievement) => (
    <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
      <View className="flex-row items-start gap-3">
        <Text className="text-4xl">{achievement.icon}</Text>
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground">{achievement.name}</Text>
          <Text className="text-sm text-muted mt-1">{achievement.description}</Text>
          {achievement.unlockedAt && (
            <Text className="text-xs text-primary font-semibold mt-2">
              ✓ Unlocked {achievement.unlockedAt}
            </Text>
          )}
        </View>
        {!achievement.unlockedAt && (
          <View className="bg-muted/20 rounded-lg px-2 py-1">
            <Text className="text-xs font-semibold text-muted">{achievement.requirement}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">🏆</Text>
            <Text className="text-2xl font-bold text-foreground">Community Impact</Text>
            <Text className="text-sm text-muted text-center">
              Celebrate contributions and unlock achievements
            </Text>
          </View>

          {/* View Mode Tabs */}
          <View className="flex-row gap-2 bg-surface rounded-lg p-1 border border-border">
            {(["leaderboard", "achievements"] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setViewMode(mode)}
                style={{
                  backgroundColor: viewMode === mode ? colors.primary : "transparent",
                  flex: 1,
                }}
                className="py-2 rounded items-center active:opacity-80"
              >
                <Text
                  className="text-xs font-semibold capitalize"
                  style={{
                    color: viewMode === mode ? "white" : colors.foreground,
                  }}
                >
                  {mode === "leaderboard" ? "Leaderboard" : "Achievements"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Leaderboard View */}
          {viewMode === "leaderboard" && (
            <View className="gap-4">
              {/* Your Rank Card */}
              <View className="bg-primary/10 rounded-xl p-4 border-2 border-primary gap-3">
                <Text className="text-sm font-semibold text-primary">YOUR RANK</Text>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-3xl font-bold text-foreground">#12</Text>
                    <Text className="text-sm text-muted mt-1">1,250 points</Text>
                  </View>
                  <View className="items-center gap-1">
                    <Text className="text-4xl">👤</Text>
                    <Text className="text-xs text-muted">You</Text>
                  </View>
                </View>
              </View>

              {/* Leaderboard List */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Top Contributors
                </Text>
                {MOCK_LEADERBOARD.map((entry) => renderLeaderboardEntry(entry))}
              </View>
            </View>
          )}

          {/* Achievements View */}
          {viewMode === "achievements" && (
            <View className="gap-4">
              {/* Progress Summary */}
              <View className="bg-surface rounded-xl p-4 border border-border gap-3">
                <Text className="text-sm font-semibold text-foreground">Progress</Text>
                <View className="gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted">Achievements Unlocked</Text>
                    <Text className="text-sm font-bold text-primary">4 / 6</Text>
                  </View>
                  <View
                    className="h-2 bg-border rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.border }}
                  >
                    <View
                      className="h-full bg-primary rounded-full"
                      style={{ width: "66.67%" }}
                    />
                  </View>
                </View>
              </View>

              {/* Achievements List */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  All Achievements
                </Text>
                {ACHIEVEMENTS.map((achievement) => renderAchievementCard(achievement))}
              </View>
            </View>
          )}

          {/* Selected Entry Details */}
          {selectedEntry && viewMode === "leaderboard" && (
            <View className="bg-surface rounded-xl p-4 gap-3 border-2 border-primary mt-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">
                    {selectedEntry.userName}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    Rank #{selectedEntry.rank}
                  </Text>
                </View>
                <Text className="text-3xl">{selectedEntry.avatar}</Text>
              </View>

              <View className="h-px bg-border" />

              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Total Points</Text>
                  <Text className="text-lg font-bold text-primary">{selectedEntry.points}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Contributions</Text>
                  <Text className="text-lg font-bold text-foreground">
                    {selectedEntry.contributions}
                  </Text>
                </View>

                {selectedEntry.badges.length > 0 && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted">Badges</Text>
                    <View className="flex-row gap-1">
                      {selectedEntry.badges.map((badge, idx) => (
                        <Text key={idx} className="text-lg">
                          {badge}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setSelectedEntry(null)}
                style={{ borderColor: colors.border }}
                className="py-2 rounded-lg items-center border active:opacity-80 mt-2"
              >
                <Text className="text-foreground font-semibold text-sm">Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Info Box */}
          <View className="bg-forest/10 rounded-xl p-4 gap-2 border border-forest/30 mt-4">
            <Text className="text-sm font-semibold text-forest">🎯 How to Earn Points</Text>
            <Text className="text-xs text-forest/80 leading-relaxed">
              Submit reports, support others, scan products, and document incidents to earn points and unlock achievements. Every action contributes to positive change.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
