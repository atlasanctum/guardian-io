import { Text, View, TouchableOpacity, ScrollView, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface IncidentMarker {
  id: string;
  type: "poaching" | "habitat-loss" | "trafficking" | "sighting";
  species: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  reports: number;
  icon: string;
}

interface HotspotZone {
  id: string;
  name: string;
  status: "active" | "monitoring" | "resolved";
  incidents: number;
  species: string[];
  color: string;
}

const INCIDENT_MARKERS: IncidentMarker[] = [
  {
    id: "INC-001",
    type: "poaching",
    species: "African Elephant",
    location: "Northern Reserve",
    latitude: 0.5,
    longitude: 30.2,
    severity: "critical",
    timestamp: "2 hours ago",
    reports: 3,
    icon: "🚨",
  },
  {
    id: "INC-002",
    type: "trafficking",
    species: "Pangolin",
    location: "Border Region",
    latitude: 1.2,
    longitude: 31.5,
    severity: "high",
    timestamp: "6 hours ago",
    reports: 2,
    icon: "🚫",
  },
  {
    id: "INC-003",
    type: "habitat-loss",
    species: "Mountain Gorilla",
    location: "Western Forest",
    latitude: -0.8,
    longitude: 29.3,
    severity: "high",
    timestamp: "1 day ago",
    reports: 5,
    icon: "⚠️",
  },
  {
    id: "INC-004",
    type: "sighting",
    species: "Black Rhino",
    location: "Central Park",
    latitude: 0.1,
    longitude: 30.8,
    severity: "low",
    timestamp: "3 days ago",
    reports: 1,
    icon: "👀",
  },
];

const HOTSPOT_ZONES: HotspotZone[] = [
  {
    id: "ZONE-001",
    name: "Northern Reserve",
    status: "active",
    incidents: 8,
    species: ["Elephant", "Lion", "Zebra"],
    color: "#EF4444",
  },
  {
    id: "ZONE-002",
    name: "Border Region",
    status: "monitoring",
    incidents: 5,
    species: ["Pangolin", "Antelope"],
    color: "#F59E0B",
  },
  {
    id: "ZONE-003",
    name: "Western Forest",
    status: "active",
    incidents: 12,
    species: ["Mountain Gorilla", "Chimpanzee", "Forest Buffalo"],
    color: "#D97706",
  },
];

export default function BiodiversityMapScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedIncident, setSelectedIncident] = useState<IncidentMarker | null>(null);
  const [filterType, setFilterType] = useState<"all" | "critical" | "high" | "medium">("all");
  const [viewMode, setViewMode] = useState<"map" | "list" | "zones">("map");

  const filteredIncidents = INCIDENT_MARKERS.filter((incident) => {
    if (filterType === "all") return true;
    return incident.severity === filterType;
  });

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
        return colors.muted;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "CRITICAL";
      case "high":
        return "HIGH";
      case "medium":
        return "MEDIUM";
      case "low":
        return "LOW";
      default:
        return "UNKNOWN";
    }
  };

  const handleIncidentSelect = (incident: IncidentMarker) => {
    setSelectedIncident(incident);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReportIncident = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to incident reporting
  };

  const renderMapView = () => (
    <View className="gap-6">
      <View className="items-center gap-2">
        <Text className="text-4xl">🗺️</Text>
        <Text className="text-2xl font-bold text-foreground">Biodiversity Hotspot Map</Text>
        <Text className="text-sm text-muted text-center">
          Real-time wildlife incident tracking and protection zones
        </Text>
      </View>

      {/* Map Simulation */}
      <View className="bg-surface rounded-2xl p-4 border-2 border-border aspect-square items-center justify-center gap-4">
        <Text className="text-5xl">🌍</Text>
        <Text className="text-sm text-muted text-center px-4">
          Interactive map showing {filteredIncidents.length} active incidents
        </Text>

        {/* Incident Markers */}
        <View className="gap-2 w-full">
          {filteredIncidents.slice(0, 3).map((incident) => (
            <Pressable
              key={incident.id}
              onPress={() => handleIncidentSelect(incident)}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View
                className="rounded-lg p-3 flex-row items-center gap-3"
                style={{ backgroundColor: `${getSeverityColor(incident.severity)}20` }}
              >
                <Text className="text-2xl">{incident.icon}</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">
                    {incident.species}
                  </Text>
                  <Text className="text-xs text-muted">{incident.location}</Text>
                </View>
                <View
                  className="rounded-full px-2 py-1"
                  style={{ backgroundColor: getSeverityColor(incident.severity) }}
                >
                  <Text className="text-xs font-bold text-white">
                    {getSeverityLabel(incident.severity)}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Filter Controls */}
      <View className="gap-3">
        <Text className="text-sm font-semibold text-foreground">Filter by Severity</Text>
        <View className="flex-row gap-2">
          {(["all", "critical", "high", "medium"] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              style={{
                backgroundColor:
                  filterType === type ? colors.primary : colors.surface,
                borderColor: filterType === type ? colors.primary : colors.border,
              }}
              className="flex-1 py-2 rounded-lg border items-center active:opacity-80"
            >
              <Text
                className="text-xs font-semibold capitalize"
                style={{
                  color: filterType === type ? "white" : colors.foreground,
                }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selected Incident Details */}
      {selectedIncident && (
        <View className="bg-surface rounded-xl p-4 gap-3 border-2 border-primary">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">
                {selectedIncident.species}
              </Text>
              <Text className="text-sm text-muted mt-1">{selectedIncident.location}</Text>
            </View>
            <Text className="text-3xl">{selectedIncident.icon}</Text>
          </View>

          <View className="h-px bg-border" />

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-muted">Severity</Text>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: getSeverityColor(selectedIncident.severity) }}
            >
              <Text className="text-xs font-bold text-white">
                {getSeverityLabel(selectedIncident.severity)}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-muted">Reports</Text>
            <Text className="text-sm font-semibold text-foreground">
              {selectedIncident.reports} community reports
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-muted">Last Updated</Text>
            <Text className="text-sm font-semibold text-foreground">
              {selectedIncident.timestamp}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleReportIncident}
            style={{ backgroundColor: colors.primary }}
            className="py-3 rounded-lg items-center active:opacity-80 mt-2"
          >
            <Text className="text-white font-semibold text-sm">Add to This Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderListView = () => (
    <View className="gap-4">
      <View className="items-center gap-2 pb-2">
        <Text className="text-2xl font-bold text-foreground">Active Incidents</Text>
        <Text className="text-sm text-muted">
          {filteredIncidents.length} incidents found
        </Text>
      </View>

      <FlatList
        data={filteredIncidents}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleIncidentSelect(item)}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <View className="bg-surface rounded-xl p-4 mb-3 border border-border">
              <View className="flex-row items-start gap-3">
                <Text className="text-3xl">{item.icon}</Text>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-base font-bold text-foreground">
                      {item.species}
                    </Text>
                    <View
                      className="rounded-full px-2 py-1"
                      style={{ backgroundColor: getSeverityColor(item.severity) }}
                    >
                      <Text className="text-xs font-bold text-white">
                        {getSeverityLabel(item.severity)}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-muted mb-2">{item.location}</Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-muted">{item.timestamp}</Text>
                    <Text className="text-xs font-semibold text-primary">
                      {item.reports} reports
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );

  const renderZonesView = () => (
    <View className="gap-4">
      <View className="items-center gap-2 pb-2">
        <Text className="text-2xl font-bold text-foreground">Protection Zones</Text>
        <Text className="text-sm text-muted">
          {HOTSPOT_ZONES.length} active zones
        </Text>
      </View>

      {HOTSPOT_ZONES.map((zone) => (
        <View key={zone.id} className="bg-surface rounded-xl p-4 border border-border gap-3">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground">{zone.name}</Text>
              <Text className="text-sm text-muted mt-1">
                {zone.incidents} active incidents
              </Text>
            </View>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: zone.color }}
            >
              <Text className="text-xs font-bold text-white capitalize">
                {zone.status}
              </Text>
            </View>
          </View>

          <View className="h-px bg-border" />

          <View>
            <Text className="text-xs text-muted font-semibold mb-2">Species</Text>
            <View className="flex-row flex-wrap gap-2">
              {zone.species.map((species, idx) => (
                <View
                  key={idx}
                  className="bg-primary/10 rounded-full px-3 py-1 border border-primary/30"
                >
                  <Text className="text-xs text-primary font-medium">{species}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setSelectedIncident(null)}
            style={{ borderColor: colors.border }}
            className="py-2 rounded-lg items-center border active:opacity-80 mt-2"
          >
            <Text className="text-foreground font-semibold text-sm">View Details</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* View Mode Tabs */}
          <View className="flex-row gap-2 bg-surface rounded-lg p-1 border border-border">
            {(["map", "list", "zones"] as const).map((mode) => (
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
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content */}
          {viewMode === "map" && renderMapView()}
          {viewMode === "list" && renderListView()}
          {viewMode === "zones" && renderZonesView()}

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleReportIncident}
            style={{ backgroundColor: colors.primary }}
            className="py-4 rounded-lg items-center active:opacity-80 mt-4"
          >
            <Text className="text-white font-semibold">Report New Incident</Text>
          </TouchableOpacity>

          {/* Stats Footer */}
          <View className="bg-forest/10 rounded-xl p-4 gap-2 border border-forest/30 mt-4">
            <Text className="text-sm font-semibold text-forest">📊 This Month</Text>
            <View className="flex-row justify-between gap-2">
              <View className="flex-1">
                <Text className="text-xs text-forest/80">Incidents</Text>
                <Text className="text-lg font-bold text-forest">24</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-forest/80">Species Protected</Text>
                <Text className="text-lg font-bold text-forest">12</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-forest/80">Community Reports</Text>
                <Text className="text-lg font-bold text-forest">47</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
