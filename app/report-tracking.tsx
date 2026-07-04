import { Text, View, TouchableOpacity, ScrollView, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface ReportStatus {
  id: string;
  reportId: string;
  incidentType: string;
  location: string;
  status: "submitted" | "under-review" | "escalated" | "resolved";
  severity: string;
  submittedDate: string;
  lastUpdated: string;
  escalationPath: string;
  notes: string;
}

const MOCK_REPORTS: ReportStatus[] = [
  {
    id: "1",
    reportId: "#A7F2E8",
    incidentType: "Wage Theft",
    location: "Factory District, Region A",
    status: "escalated",
    severity: "high",
    submittedDate: "Jul 2, 2026",
    lastUpdated: "Jul 3, 2026",
    escalationPath: "NGO Partner",
    notes: "Report escalated to local NGO for investigation. Expected follow-up within 5 business days.",
  },
  {
    id: "2",
    reportId: "#B9K3L2",
    incidentType: "Unsafe Conditions",
    location: "Manufacturing Plant, Region B",
    status: "under-review",
    severity: "high",
    submittedDate: "Jun 30, 2026",
    lastUpdated: "Jul 1, 2026",
    escalationPath: "Government Agency",
    notes: "Under review by labor department. Your identity remains protected.",
  },
  {
    id: "3",
    reportId: "#C2M5N9",
    incidentType: "Harassment",
    location: "Service Center, Region C",
    status: "resolved",
    severity: "medium",
    submittedDate: "Jun 15, 2026",
    lastUpdated: "Jun 28, 2026",
    escalationPath: "Internal HR",
    notes: "Issue resolved. HR has implemented corrective measures.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "#10B981";
    case "escalated":
      return "#F59E0B";
    case "under-review":
      return "#3B82F6";
    case "submitted":
      return "#6B7280";
    default:
      return "#9CA3AF";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "resolved":
      return "✓ Resolved";
    case "escalated":
      return "→ Escalated";
    case "under-review":
      return "⏳ Under Review";
    case "submitted":
      return "📤 Submitted";
    default:
      return "Unknown";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "#EF4444";
    case "high":
      return "#F59E0B";
    case "medium":
      return "#D97706";
    case "low":
      return "#10B981";
    default:
      return "#9CA3AF";
  }
};

export default function ReportTrackingScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedReport, setSelectedReport] = useState<ReportStatus | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "resolved">("all");

  const filteredReports = MOCK_REPORTS.filter((report) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return report.status !== "resolved";
    return report.status === "resolved";
  });

  const handleSelectReport = (report: ReportStatus) => {
    setSelectedReport(report);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCopyReportId = (reportId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // In a real app, this would copy to clipboard
  };

  const renderReportCard = (report: ReportStatus) => (
    <Pressable
      onPress={() => handleSelectReport(report)}
      style={({ pressed }: any) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground">{report.incidentType}</Text>
            <Text className="text-sm text-muted mt-1">{report.location}</Text>
          </View>
          <View
            className="rounded-full px-2 py-1"
            style={{ backgroundColor: getStatusColor(report.status) }}
          >
            <Text className="text-xs font-bold text-white">{getStatusLabel(report.status)}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-xs text-muted">Report ID</Text>
            <Text className="text-sm font-semibold text-foreground">{report.reportId}</Text>
          </View>
          <View
            className="rounded-full px-2 py-1"
            style={{ backgroundColor: `${getSeverityColor(report.severity)}20` }}
          >
            <Text className="text-xs font-semibold" style={{ color: getSeverityColor(report.severity) }}>
              {report.severity.toUpperCase()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-3 text-xs text-muted">
          <Text className="text-xs text-muted">Submitted: {report.submittedDate}</Text>
          <Text className="text-xs text-muted">Updated: {report.lastUpdated}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">📋</Text>
            <Text className="text-2xl font-bold text-foreground">Report Tracking</Text>
            <Text className="text-sm text-muted text-center">
              Monitor the status of your submitted reports
            </Text>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row gap-2 bg-surface rounded-lg p-1 border border-border">
            {(["all", "active", "resolved"] as const).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilterStatus(status)}
                style={{
                  backgroundColor: filterStatus === status ? colors.primary : "transparent",
                  flex: 1,
                }}
                className="py-2 rounded items-center active:opacity-80"
              >
                <Text
                  className="text-xs font-semibold capitalize"
                  style={{
                    color: filterStatus === status ? "white" : colors.foreground,
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Reports List */}
          {filteredReports.length > 0 ? (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                {filteredReports.length} Report{filteredReports.length !== 1 ? "s" : ""}
              </Text>
              {filteredReports.map((report) => renderReportCard(report))}
            </View>
          ) : (
            <View className="bg-surface rounded-xl p-6 items-center gap-2 border border-border">
              <Text className="text-3xl">📭</Text>
              <Text className="text-sm font-semibold text-foreground">No reports found</Text>
              <Text className="text-xs text-muted text-center">
                Your submitted reports will appear here
              </Text>
            </View>
          )}

          {/* Selected Report Details */}
          {selectedReport && (
            <View className="bg-surface rounded-xl p-4 gap-3 border-2 border-primary mt-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">
                    {selectedReport.incidentType}
                  </Text>
                  <Text className="text-sm text-muted mt-1">{selectedReport.location}</Text>
                </View>
                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: getStatusColor(selectedReport.status) }}
                >
                  <Text className="text-xs font-bold text-white">
                    {getStatusLabel(selectedReport.status)}
                  </Text>
                </View>
              </View>

              <View className="h-px bg-border" />

              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Report ID</Text>
                  <TouchableOpacity
                    onPress={() => handleCopyReportId(selectedReport.reportId)}
                    className="flex-row items-center gap-1"
                  >
                    <Text className="text-sm font-semibold text-primary">
                      {selectedReport.reportId}
                    </Text>
                    <Text className="text-xs">📋</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Escalation Path</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {selectedReport.escalationPath}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Severity</Text>
                  <View
                    className="rounded-full px-2 py-1"
                    style={{
                      backgroundColor: `${getSeverityColor(selectedReport.severity)}20`,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: getSeverityColor(selectedReport.severity) }}
                    >
                      {selectedReport.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">Submitted</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {selectedReport.submittedDate}
                  </Text>
                </View>
              </View>

              <View className="h-px bg-border" />

              <View className="bg-forest/10 rounded-lg p-3 gap-2 border border-forest/30">
                <Text className="text-xs font-semibold text-forest">📝 Latest Update</Text>
                <Text className="text-xs text-forest/80 leading-relaxed">{selectedReport.notes}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedReport(null)}
                style={{ borderColor: colors.border }}
                className="py-2 rounded-lg items-center border active:opacity-80 mt-2"
              >
                <Text className="text-foreground font-semibold text-sm">Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Info Box */}
          <View className="bg-primary/10 rounded-xl p-4 gap-2 border border-primary/30 mt-4">
            <Text className="text-sm font-semibold text-primary">🔒 Your Privacy is Protected</Text>
            <Text className="text-xs text-primary/80 leading-relaxed">
              Your identity remains anonymous throughout the reporting process. Use your Report ID to
              track progress without revealing personal information.
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={() => router.push("/worker-reporting")}
            style={{ backgroundColor: colors.primary }}
            className="py-4 rounded-lg items-center active:opacity-80 mt-4"
          >
            <Text className="text-white font-semibold">Submit New Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
