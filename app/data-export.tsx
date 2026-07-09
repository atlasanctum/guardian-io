import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useDataExport } from "@/lib/data-export";
import * as Haptics from "expo-haptics";

interface ExportOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  action: () => Promise<void>;
}

export default function DataExportScreen() {
  const router = useRouter();
  const colors = useColors();
  const { exportImpactReport, exportContributionCertificate, shareStory, shareAchievement } =
    useDataExport();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "json" | "csv">("pdf");

  const handleExportImpactReport = async () => {
    setIsExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const mockData = {
        title: "Guardian-IO Global Impact Report",
        metrics: {
          workersProtected: 2847,
          speciesProtected: 156,
          forestPreserved: "12,500 acres",
          wagesImproved: "$487,500",
          communityFund: "$125,000",
        },
        stories: [
          {
            icon: "👷",
            title: "Worker Protection",
            description: "2,847 workers protected from exploitation",
          },
          {
            icon: "🦁",
            title: "Species Conservation",
            description: "156 endangered species documented",
          },
        ],
        generatedDate: new Date().toLocaleDateString(),
      };

      const success = await exportImpactReport(mockData);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Impact report exported successfully!");
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to export impact report");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCertificate = async () => {
    setIsExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const mockCertificate = {
        userId: "user-123",
        userName: "Sarah Guardian",
        contributionType: "Wildlife Incident Report",
        points: 75,
        date: new Date().toLocaleDateString(),
        certificateId: `CERT-${Date.now()}`,
      };

      const success = await exportContributionCertificate(mockCertificate);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Certificate exported successfully!");
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to export certificate");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareStory = async () => {
    setIsExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const mockStory = {
        title: "Worker Protection Initiative",
        description:
          "2,847 workers have reported incidents and received support through Guardian-IO",
        metrics: {
          "Lives Protected": "2,847",
          "Reports Processed": "1,250",
          "Escalations": "450",
        },
        hashtags: ["GuardianIO", "WorkerRights", "GlobalChange"],
      };

      const success = await shareStory(mockStory);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Story shared successfully!");
      }
    } catch (error) {
      console.error("Share error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareAchievement = async () => {
    setIsExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const mockAchievement = {
        userName: "Sarah Guardian",
        achievementName: "Voice of Change",
        icon: "🏆",
        points: 100,
      };

      const success = await shareAchievement(mockAchievement);

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Achievement shared successfully!");
      }
    } catch (error) {
      console.error("Share error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">📊</Text>
            <Text className="text-3xl font-bold text-foreground">Export & Share</Text>
            <Text className="text-sm text-muted">Download reports and share your impact</Text>
          </View>

          {/* Export Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Export Data</Text>

            {/* Impact Report Export */}
            <TouchableOpacity
              onPress={handleExportImpactReport}
              disabled={isExporting}
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              className="p-4 rounded-lg border active:opacity-80"
            >
              <View className="flex-row items-start gap-3">
                <Text className="text-2xl">📈</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Impact Report</Text>
                  <Text className="text-xs text-muted mt-1">
                    Export global impact metrics and trends
                  </Text>
                  <View className="flex-row gap-2 mt-2">
                    {["PDF", "JSON", "CSV"].map((format) => (
                      <View
                        key={format}
                        className="bg-primary/10 rounded px-2 py-1"
                        style={{
                          borderColor: colors.primary,
                          borderWidth: selectedFormat === format.toLowerCase() ? 1 : 0,
                        }}
                      >
                        <Text className="text-xs font-semibold text-primary">{format}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Text className="text-lg">{isExporting ? "⏳" : "⬇️"}</Text>
              </View>
            </TouchableOpacity>

            {/* Certificate Export */}
            <TouchableOpacity
              onPress={handleExportCertificate}
              disabled={isExporting}
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              className="p-4 rounded-lg border active:opacity-80"
            >
              <View className="flex-row items-start gap-3">
                <Text className="text-2xl">🏆</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Contribution Certificate
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Download your achievement certificate
                  </Text>
                </View>
                <Text className="text-lg">{isExporting ? "⏳" : "⬇️"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sharing Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Share Your Impact</Text>

            {/* Share Story */}
            <TouchableOpacity
              onPress={handleShareStory}
              disabled={isExporting}
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              className="p-4 rounded-lg border active:opacity-80"
            >
              <View className="flex-row items-start gap-3">
                <Text className="text-2xl">📱</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Share Impact Story</Text>
                  <Text className="text-xs text-muted mt-1">
                    Post your impact story on social media
                  </Text>
                </View>
                <Text className="text-lg">{isExporting ? "⏳" : "📤"}</Text>
              </View>
            </TouchableOpacity>

            {/* Share Achievement */}
            <TouchableOpacity
              onPress={handleShareAchievement}
              disabled={isExporting}
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              className="p-4 rounded-lg border active:opacity-80"
            >
              <View className="flex-row items-start gap-3">
                <Text className="text-2xl">🎉</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Share Achievement
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Celebrate your badges and milestones
                  </Text>
                </View>
                <Text className="text-lg">{isExporting ? "⏳" : "📤"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tips Section */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary/30 gap-2">
            <Text className="text-sm font-semibold text-primary">💡 Sharing Tips</Text>
            <Text className="text-xs text-primary/80 leading-relaxed">
              Share your impact stories and achievements to inspire others. Use hashtags
              #GuardianIO #ImpactMatters to reach more people and build the movement.
            </Text>
          </View>

          {/* Format Selection */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Export Format</Text>
            <View className="flex-row gap-2">
              {(["pdf", "json", "csv"] as const).map((format) => (
                <TouchableOpacity
                  key={format}
                  onPress={() => setSelectedFormat(format)}
                  style={{
                    backgroundColor: selectedFormat === format ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  }}
                  className="flex-1 py-2 rounded-lg border active:opacity-80 items-center"
                >
                  <Text
                    className="text-sm font-semibold uppercase"
                    style={{
                      color: selectedFormat === format ? "white" : colors.foreground,
                    }}
                  >
                    {format}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
              onPress={() => router.push("/impact-dashboard")}
              style={{ backgroundColor: colors.primary }}
              className="flex-1 py-3 rounded-lg items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">View Impact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
