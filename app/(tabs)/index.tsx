import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useRole } from "@/lib/role-context";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const { role } = useRole();
  const colors = useColors();

  if (!role) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-lg text-muted">Loading...</Text>
      </ScreenContainer>
    );
  }

  const renderWorkerDashboard = () => (
    <View className="gap-6">
      <View className="items-center gap-2 pb-4">
        <Text className="text-sm text-muted">Anonymous Identity</Text>
        <Text className="text-2xl font-bold text-foreground font-mono">
          #A7F2E8
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Quick Actions</Text>
        <TouchableOpacity
          onPress={() => router.push('/worker-reporting')}
          style={{ backgroundColor: colors.primary }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Report Rights Violation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.ocean }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">View Labor Passport</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.forest }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Emergency Support</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Recent Activity</Text>
        <View className="bg-surface rounded-xl p-4">
          <Text className="text-sm text-muted">No reports yet</Text>
        </View>
      </View>
    </View>
  );

  const renderCommunityGuardianDashboard = () => (
    <View className="gap-6">
      <View className="items-center gap-2 pb-4">
        <Text className="text-4xl">🌿</Text>
        <Text className="text-lg font-semibold text-foreground">Biodiversity Guardian</Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Quick Actions</Text>
        <TouchableOpacity
          onPress={() => router.push('/biodiversity-map')}
          style={{ backgroundColor: colors.primary }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">View Hotspot Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.ocean }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Log Observation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.forest }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">View Rewards</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Contribution Score</Text>
        <View className="bg-surface rounded-xl p-4">
          <Text className="text-3xl font-bold text-primary">245</Text>
          <Text className="text-sm text-muted mt-1">Points earned</Text>
        </View>
      </View>
    </View>
  );

  const renderBusinessDashboard = () => (
    <View className="gap-6">
      <View className="items-center gap-2 pb-4">
        <Text className="text-4xl">🏢</Text>
        <Text className="text-lg font-semibold text-foreground">Supply Chain Manager</Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Quick Actions</Text>
        <TouchableOpacity
          style={{ backgroundColor: colors.primary }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Verify Supplier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.ocean }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Risk Assessment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.forest }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">ESG Report</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Compliance Score</Text>
        <View className="bg-surface rounded-xl p-4">
          <Text className="text-3xl font-bold text-primary">87%</Text>
          <Text className="text-sm text-muted mt-1">Overall compliance</Text>
        </View>
      </View>
    </View>
  );

  const renderConsumerDashboard = () => (
    <View className="gap-6">
      <View className="items-center gap-2 pb-4">
        <Text className="text-4xl">🛍️</Text>
        <Text className="text-lg font-semibold text-foreground">Ethical Shopper</Text>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Quick Actions</Text>
        <TouchableOpacity
          onPress={() => router.push('/qr-scanner')}
          style={{ backgroundColor: colors.primary }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Scan QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.ocean }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Discover Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: colors.forest }}
          className="p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Impact Stories</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Your Impact</Text>
        <View className="bg-surface rounded-xl p-4">
          <Text className="text-sm text-muted">Purchases: 12</Text>
          <Text className="text-sm text-muted mt-1">Lives supported: 24</Text>
        </View>
      </View>
    </View>
  );

  const getDashboard = () => {
    switch (role) {
      case "worker":
        return renderWorkerDashboard();
      case "community-guardian":
        return renderCommunityGuardianDashboard();
      case "business":
        return renderBusinessDashboard();
      case "consumer":
        return renderConsumerDashboard();
      default:
        return null;
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">Guardian-IO</Text>
            <Text className="text-sm text-muted">Transparent. Resilient. Regenerative.</Text>
          </View>

          {/* Role-Specific Dashboard */}
          {getDashboard()}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
