import { Text, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRealtimeSync, usePollingSync } from "@/lib/realtime-sync";

interface ImpactMetrics {
  workersProtected: number;
  speciesProtected: number;
  forestPreserved: number;
  wagesImproved: number;
  communityFund: number;
}

interface ImpactTrend {
  date: string;
  value: number;
}

const MOCK_IMPACT_METRICS: ImpactMetrics = {
  workersProtected: 2847,
  speciesProtected: 156,
  forestPreserved: 12500,
  wagesImproved: 487500,
  communityFund: 125000,
};

const MOCK_TRENDS: Record<string, ImpactTrend[]> = {
  workersProtected: [
    { date: "Jun 1", value: 1200 },
    { date: "Jun 8", value: 1650 },
    { date: "Jun 15", value: 2100 },
    { date: "Jun 22", value: 2500 },
    { date: "Jun 29", value: 2847 },
  ],
  speciesProtected: [
    { date: "Jun 1", value: 45 },
    { date: "Jun 8", value: 78 },
    { date: "Jun 15", value: 102 },
    { date: "Jun 22", value: 130 },
    { date: "Jun 29", value: 156 },
  ],
  forestPreserved: [
    { date: "Jun 1", value: 3200 },
    { date: "Jun 8", value: 5800 },
    { date: "Jun 15", value: 8200 },
    { date: "Jun 22", value: 10500 },
    { date: "Jun 29", value: 12500 },
  ],
};

export default function ImpactDashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const [metrics, setMetrics] = useState<ImpactMetrics>(MOCK_IMPACT_METRICS);
  const [selectedMetric, setSelectedMetric] = useState<keyof ImpactMetrics>("workersProtected");
  const [trends, setTrends] = useState<ImpactTrend[]>(MOCK_TRENDS.workersProtected);
  const [activeTab, setActiveTab] = useState<"overview" | "trends" | "stories">("overview");

  // Use real-time sync with fallback to polling
  useRealtimeSync("impact-updated", (event) => {
    if (event.data) {
      setMetrics(event.data);
    }
  });

  usePollingSync("impact-updated", (event) => {
    if (event.data) {
      setMetrics(event.data);
    }
  });

  const handleMetricSelect = (metric: keyof ImpactMetrics) => {
    setSelectedMetric(metric);
    setTrends(MOCK_TRENDS[metric as keyof typeof MOCK_TRENDS] || []);
  };

  const getMetricIcon = (metric: keyof ImpactMetrics) => {
    switch (metric) {
      case "workersProtected":
        return "👷";
      case "speciesProtected":
        return "🦁";
      case "forestPreserved":
        return "🌲";
      case "wagesImproved":
        return "💰";
      case "communityFund":
        return "🤝";
    }
  };

  const getMetricLabel = (metric: keyof ImpactMetrics) => {
    switch (metric) {
      case "workersProtected":
        return "Workers Protected";
      case "speciesProtected":
        return "Species Protected";
      case "forestPreserved":
        return "Forest Preserved (acres)";
      case "wagesImproved":
        return "Wages Improved ($)";
      case "communityFund":
        return "Community Fund ($)";
    }
  };

  const getMetricColor = (metric: keyof ImpactMetrics) => {
    switch (metric) {
      case "workersProtected":
        return colors.primary;
      case "speciesProtected":
        return colors.forest;
      case "forestPreserved":
        return colors.forest;
      case "wagesImproved":
        return colors.ocean;
      case "communityFund":
        return colors.primary;
    }
  };

  const formatMetricValue = (metric: keyof ImpactMetrics, value: number) => {
    if (metric === "wagesImproved" || metric === "communityFund") {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    if (metric === "forestPreserved") {
      return `${value.toLocaleString()} acres`;
    }
    return value.toLocaleString();
  };

  const getMaxTrendValue = () => {
    return Math.max(...trends.map((t) => t.value)) * 1.2;
  };

  const getTrendBarHeight = (value: number) => {
    const maxValue = getMaxTrendValue();
    return (value / maxValue) * 150;
  };

  const impactMetricsArray: Array<keyof ImpactMetrics> = [
    "workersProtected",
    "speciesProtected",
    "forestPreserved",
    "wagesImproved",
    "communityFund",
  ];

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">🌍</Text>
            <Text className="text-3xl font-bold text-foreground">Global Impact</Text>
            <Text className="text-sm text-muted">Real-time collective progress</Text>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-2 bg-surface rounded-lg p-1 border border-border">
            {(["overview", "trends", "stories"] as const).map((tab) => (
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
            <View className="gap-4">
              {/* Primary Metric */}
              <View
                className="rounded-xl p-6 gap-2 border-2"
                style={{
                  backgroundColor: `${getMetricColor(selectedMetric)}20`,
                  borderColor: getMetricColor(selectedMetric),
                }}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-3xl">{getMetricIcon(selectedMetric)}</Text>
                  <View className="flex-1">
                    <Text className="text-sm text-muted">{getMetricLabel(selectedMetric)}</Text>
                    <Text className="text-3xl font-bold text-foreground">
                      {formatMetricValue(selectedMetric, metrics[selectedMetric])}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-muted">
                  Updated {new Date().toLocaleDateString()}
                </Text>
              </View>

              {/* All Metrics Grid */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">All Metrics</Text>
                <View className="flex-row flex-wrap gap-2">
                  {impactMetricsArray.map((metric) => (
                    <TouchableOpacity
                      key={metric}
                      onPress={() => handleMetricSelect(metric)}
                      style={{
                        backgroundColor:
                          selectedMetric === metric ? getMetricColor(metric) : colors.surface,
                        borderColor: getMetricColor(metric),
                      }}
                      className="flex-1 min-w-[45%] p-3 rounded-lg border-2 active:opacity-80"
                    >
                      <Text
                        className="text-2xl mb-1"
                        style={{
                          opacity: selectedMetric === metric ? 1 : 0.6,
                        }}
                      >
                        {getMetricIcon(metric)}
                      </Text>
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: selectedMetric === metric ? "white" : colors.foreground,
                        }}
                      >
                        {formatMetricValue(metric, metrics[metric])}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Key Achievements */}
              <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                <Text className="text-sm font-semibold text-foreground">🏆 Key Achievements</Text>
                {[
                  { icon: "👷", text: "Over 2,800 workers protected from exploitation" },
                  { icon: "🦁", text: "156 endangered species documented and monitored" },
                  { icon: "🌲", text: "12,500 acres of forest preserved" },
                  { icon: "💰", text: "$487K in wages improved for vulnerable workers" },
                ].map((achievement, idx) => (
                  <View key={idx} className="flex-row items-start gap-2">
                    <Text className="text-lg">{achievement.icon}</Text>
                    <Text className="text-xs text-muted flex-1 leading-relaxed">
                      {achievement.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Trends Tab */}
          {activeTab === "trends" && (
            <View className="gap-4">
              <View className="bg-surface rounded-lg p-4 border border-border gap-4">
                <Text className="text-sm font-semibold text-foreground">
                  {getMetricLabel(selectedMetric)} Trend
                </Text>

                {/* Simple bar chart */}
                <View className="flex-row items-end gap-2 h-40">
                  {trends.map((trend, idx) => (
                    <View key={idx} className="flex-1 items-center gap-1">
                      <View
                        style={{
                          height: getTrendBarHeight(trend.value),
                          backgroundColor: getMetricColor(selectedMetric),
                          width: "100%",
                          borderRadius: 4,
                        }}
                      />
                      <Text className="text-xs text-muted">{trend.date}</Text>
                    </View>
                  ))}
                </View>

                {/* Trend stats */}
                <View className="flex-row gap-2 pt-2 border-t border-border">
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Start</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {formatMetricValue(selectedMetric, trends[0]?.value || 0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Current</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {formatMetricValue(selectedMetric, trends[trends.length - 1]?.value || 0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Growth</Text>
                    <Text className="text-sm font-semibold text-forest">
                      +
                      {(
                        (((trends[trends.length - 1]?.value || 0) - (trends[0]?.value || 0)) /
                          (trends[0]?.value || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </Text>
                  </View>
                </View>
              </View>

              {/* Metric selector for trends */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">View Other Trends</Text>
                <View className="flex-row flex-wrap gap-2">
                  {impactMetricsArray.map((metric) => (
                    <TouchableOpacity
                      key={metric}
                      onPress={() => handleMetricSelect(metric)}
                      style={{
                        backgroundColor:
                          selectedMetric === metric ? getMetricColor(metric) : colors.surface,
                        borderColor: getMetricColor(metric),
                      }}
                      className="px-3 py-2 rounded-full border active:opacity-80"
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: selectedMetric === metric ? "white" : colors.foreground,
                        }}
                      >
                        {getMetricIcon(metric)} {getMetricLabel(metric).split(" ")[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Stories Tab */}
          {activeTab === "stories" && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">Impact Stories</Text>
              {[
                {
                  icon: "👷",
                  title: "Worker Protection Initiative",
                  description:
                    "2,847 workers have reported incidents and received support through Guardian-IO",
                  impact: "Lives Protected",
                },
                {
                  icon: "🦁",
                  title: "Species Conservation",
                  description: "156 endangered species documented with real-time monitoring",
                  impact: "Species Saved",
                },
                {
                  icon: "🌲",
                  title: "Forest Preservation",
                  description: "12,500 acres of critical forest habitat protected from exploitation",
                  impact: "Acres Preserved",
                },
                {
                  icon: "💰",
                  title: "Wage Improvement",
                  description: "$487,500 in wages improved for vulnerable workers globally",
                  impact: "Economic Impact",
                },
              ].map((story, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  className="p-4 rounded-lg border active:opacity-80"
                >
                  <View className="flex-row items-start gap-3">
                    <Text className="text-2xl">{story.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">{story.title}</Text>
                      <Text className="text-xs text-muted leading-relaxed mt-1">
                        {story.description}
                      </Text>
                      <View className="bg-primary/10 rounded px-2 py-1 mt-2 w-fit">
                        <Text className="text-xs font-semibold text-primary">{story.impact}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => router.push("/leaderboard")}
              style={{ backgroundColor: colors.primary }}
              className="flex-1 py-3 rounded-lg items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">Leaderboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
