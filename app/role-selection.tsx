import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export type UserRole = "worker" | "community-guardian" | "business" | "consumer";

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "worker",
    title: "Worker",
    description: "Report rights violations, access labor passports, and emergency support",
    icon: "👤",
  },
  {
    id: "community-guardian",
    title: "Community Guardian",
    description: "Monitor wildlife, report incidents, and protect biodiversity",
    icon: "🌿",
  },
  {
    id: "business",
    title: "Business",
    description: "Verify suppliers, assess risks, and track ESG compliance",
    icon: "🏢",
  },
  {
    id: "consumer",
    title: "Consumer",
    description: "Scan products, discover impact stories, and make ethical choices",
    icon: "🛍️",
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check if user already has a role selected
    const checkRole = async () => {
      const savedRole = await AsyncStorage.getItem("userRole");
      if (savedRole) {
        router.replace("/(tabs)");
      }
    };
    checkRole();
  }, [router]);

  const handleRoleSelect = async (role: UserRole) => {
    setSelectedRole(role);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Save role to local storage
    await AsyncStorage.setItem("userRole", role);

    // Navigate to appropriate onboarding or home screen
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer className="p-6" containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-3 pt-8">
            <Text className="text-5xl">🌍</Text>
            <Text className="text-3xl font-bold text-foreground text-center">Guardian-IO</Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              Transparent. Resilient. Regenerative.
            </Text>
            <Text className="text-sm text-muted text-center leading-relaxed mt-2">
              Choose your role to get started building ethical supply chains
            </Text>
          </View>

          {/* Role Selection Cards */}
          <View className="gap-4">
            {ROLE_OPTIONS.map((role) => (
              <Pressable
                key={role.id}
                onPress={() => handleRoleSelect(role.id)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View
                  className={`p-5 rounded-2xl border-2 ${
                    selectedRole === role.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface"
                  }`}
                  style={{
                    borderColor:
                      selectedRole === role.id ? colors.primary : colors.border,
                  }}
                >
                  <View className="flex-row items-start gap-4">
                    <Text className="text-4xl">{role.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">
                        {role.title}
                      </Text>
                      <Text className="text-sm text-muted leading-relaxed mt-1">
                        {role.description}
                      </Text>
                    </View>
                    {selectedRole === role.id && (
                      <Text className="text-xl text-primary">✓</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Continue Button */}
          {selectedRole && (
            <TouchableOpacity
              onPress={() => handleRoleSelect(selectedRole)}
              style={{
                backgroundColor: colors.primary,
              }}
              className="py-4 rounded-full items-center active:opacity-80"
            >
              <Text className="text-lg font-semibold text-background">
                Continue as {ROLE_OPTIONS.find((r) => r.id === selectedRole)?.title}
              </Text>
            </TouchableOpacity>
          )}

          {/* Footer Info */}
          <View className="items-center gap-2 pb-4">
            <Text className="text-xs text-muted text-center">
              Your role determines which features and tools you'll access
            </Text>
            <Text className="text-xs text-muted text-center">
              You can change your role anytime in Settings
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
