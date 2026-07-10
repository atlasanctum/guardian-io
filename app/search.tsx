import { Text, View, TouchableOpacity, ScrollView, TextInput, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useSearch, SearchFilterEngine } from "@/lib/search-filter";
import * as Haptics from "expo-haptics";

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  type: "report" | "incident" | "product";
  severity?: "low" | "medium" | "high" | "critical";
  location?: string;
  status?: string;
  createdAt: Date;
  reportCount?: number;
  icon: string;
}

// Mock data for demonstration
const MOCK_ITEMS: SearchableItem[] = [
  {
    id: "1",
    title: "Unsafe Working Conditions",
    description: "Workers report inadequate safety equipment at factory",
    type: "report",
    severity: "high",
    location: "Vietnam",
    status: "escalated",
    createdAt: new Date(Date.now() - 86400000),
    reportCount: 12,
    icon: "⚠️",
  },
  {
    id: "2",
    title: "Endangered Tiger Spotted",
    description: "Bengal tiger sighting in protected forest zone",
    type: "incident",
    severity: "critical",
    location: "India",
    status: "active",
    createdAt: new Date(Date.now() - 172800000),
    reportCount: 45,
    icon: "🐯",
  },
  {
    id: "3",
    title: "Fair Trade Coffee",
    description: "Certified organic and fair trade coffee from Colombia",
    type: "product",
    location: "Colombia",
    status: "verified",
    createdAt: new Date(Date.now() - 259200000),
    reportCount: 234,
    icon: "☕",
  },
  {
    id: "4",
    title: "Wage Theft Investigation",
    description: "Workers denied overtime pay at textile factory",
    type: "report",
    severity: "high",
    location: "Bangladesh",
    status: "under-review",
    createdAt: new Date(Date.now() - 345600000),
    reportCount: 8,
    icon: "💰",
  },
  {
    id: "5",
    title: "Forest Deforestation Alert",
    description: "Illegal logging detected in Amazon rainforest",
    type: "incident",
    severity: "critical",
    location: "Brazil",
    status: "active",
    createdAt: new Date(Date.now() - 432000000),
    reportCount: 156,
    icon: "🌳",
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "report" | "incident" | "product">(
    "all",
  );
  const [selectedSeverity, setSelectedSeverity] = useState<
    "all" | "low" | "medium" | "high" | "critical"
  >("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "popularity">("relevance");

  const searchFields = ["title", "description", "location"] as const;

  const {
    results,
    total,
    page,
    hasMore,
    filters,
    updateFilters,
    clearFilters,
    nextPage,
    previousPage,
  } = useSearch(MOCK_ITEMS, searchFields);

  // Apply type filter
  const filteredByType =
    selectedType === "all"
      ? results
      : results.filter((item) => item.type === selectedType);

  // Apply severity filter
  const filteredBySeverity =
    selectedSeverity === "all"
      ? filteredByType
      : filteredByType.filter((item) => {
          if (!item.severity) return selectedSeverity === "all";
          const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          const minSeverity = severityOrder[selectedSeverity];
          return severityOrder[item.severity] >= minSeverity;
        });

  // Apply location filter
  const filteredByLocation =
    !selectedLocation || selectedLocation.trim().length === 0
      ? filteredBySeverity
      : filteredBySeverity.filter(
          (item) =>
            item.location && item.location.toLowerCase().includes(selectedLocation.toLowerCase()),
        );

  // Final results
  const finalResults = filteredByLocation;

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    updateFilters({ query: text });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleTypeFilter = (type: "all" | "report" | "incident" | "product") => {
    setSelectedType(type);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSeverityFilter = (severity: "all" | "low" | "medium" | "high" | "critical") => {
    setSelectedSeverity(severity);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedSeverity("all");
    setSelectedLocation("");
    clearFilters();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "report":
        return "Worker Report";
      case "incident":
        return "Wildlife Incident";
      case "product":
        return "Verified Product";
      default:
        return type;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "low":
        return colors.success;
      case "medium":
        return colors.warning;
      case "high":
        return colors.error;
      case "critical":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">🔍</Text>
            <Text className="text-3xl font-bold text-foreground">Search & Discover</Text>
            <Text className="text-sm text-muted">Find reports, incidents, and products</Text>
          </View>

          {/* Search Bar */}
          <View
            style={{ borderColor: colors.border }}
            className="flex-row items-center gap-2 bg-surface rounded-lg border px-3 py-2"
          >
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Search by title, description, location..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={handleSearch}
              className="flex-1 text-foreground"
              style={{ color: colors.foreground }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Text className="text-lg">✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Tabs */}
          <View className="gap-3">
            {/* Type Filter */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">Type</Text>
              <View className="flex-row gap-2 flex-wrap">
                {(["all", "report", "incident", "product"] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleTypeFilter(type)}
                    style={{
                      backgroundColor: selectedType === type ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    }}
                    className="px-3 py-1 rounded-full border active:opacity-80"
                  >
                    <Text
                      className="text-xs font-semibold capitalize"
                      style={{
                        color: selectedType === type ? "white" : colors.foreground,
                      }}
                    >
                      {type === "all" ? "All" : getTypeLabel(type).split(" ")[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Severity Filter */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">Severity</Text>
              <View className="flex-row gap-2 flex-wrap">
                {(["all", "low", "medium", "high", "critical"] as const).map((severity) => (
                  <TouchableOpacity
                    key={severity}
                    onPress={() => handleSeverityFilter(severity)}
                    style={{
                      backgroundColor:
                        selectedSeverity === severity
                          ? getSeverityColor(severity)
                          : colors.surface,
                      borderColor: colors.border,
                    }}
                    className="px-3 py-1 rounded-full border active:opacity-80"
                  >
                    <Text
                      className="text-xs font-semibold capitalize"
                      style={{
                        color: selectedSeverity === severity ? "white" : colors.foreground,
                      }}
                    >
                      {severity === "all" ? "All" : severity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location Filter */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">Location</Text>
              <View
                style={{ borderColor: colors.border }}
                className="flex-row items-center gap-2 bg-surface rounded-lg border px-3 py-2"
              >
                <Text className="text-lg">📍</Text>
                <TextInput
                  placeholder="Filter by location..."
                  placeholderTextColor={colors.muted}
                  value={selectedLocation}
                  onChangeText={setSelectedLocation}
                  className="flex-1 text-foreground"
                  style={{ color: colors.foreground }}
                />
              </View>
            </View>

            {/* Clear Filters Button */}
            {(searchQuery ||
              selectedType !== "all" ||
              selectedSeverity !== "all" ||
              selectedLocation) && (
              <TouchableOpacity
                onPress={handleClearFilters}
                style={{ borderColor: colors.border }}
                className="py-2 rounded-lg border items-center active:opacity-80"
              >
                <Text className="text-sm font-semibold text-foreground">Clear All Filters</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Results Count */}
          <View className="bg-surface rounded-lg p-3 border border-border">
            <Text className="text-sm text-muted">
              Found <Text className="font-bold text-foreground">{finalResults.length}</Text> result
              {finalResults.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {/* Search Results */}
          {finalResults.length > 0 ? (
            <View className="gap-3">
              {finalResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  className="p-4 rounded-lg border active:opacity-80"
                >
                  <View className="flex-row items-start gap-3">
                    <Text className="text-2xl">{item.icon}</Text>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-sm font-semibold text-foreground flex-1">
                          {item.title}
                        </Text>
                        {item.severity && (
                          <View
                            style={{ backgroundColor: getSeverityColor(item.severity) }}
                            className="rounded px-2 py-1"
                          >
                            <Text className="text-xs font-semibold text-white capitalize">
                              {item.severity}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-muted mb-2 leading-relaxed">
                        {item.description}
                      </Text>
                      <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs">📍</Text>
                          <Text className="text-xs text-muted">{item.location || "Unknown"}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs">👥</Text>
                          <Text className="text-xs text-muted">{item.reportCount || 0}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs">🏷️</Text>
                          <Text className="text-xs text-muted">{getTypeLabel(item.type)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="bg-surface rounded-lg p-6 items-center gap-2 border border-border">
              <Text className="text-2xl">🔍</Text>
              <Text className="text-sm font-semibold text-foreground">No Results Found</Text>
              <Text className="text-xs text-muted text-center">
                Try adjusting your search filters or clearing them to see all items
              </Text>
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
