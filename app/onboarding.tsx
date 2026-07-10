import { Text, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  tips: string[];
  action: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Guardian-IO",
    description: "An ethical infrastructure operating system protecting workers, wildlife, and the environment.",
    icon: "🌍",
    tips: [
      "Guardian-IO connects workers, communities, and consumers",
      "Report incidents anonymously and safely",
      "Track your impact on global change",
    ],
    action: "Next",
  },
  {
    id: 2,
    title: "Submit Worker Reports",
    description: "Report labor violations, unsafe conditions, and exploitation anonymously.",
    icon: "📝",
    tips: [
      "Choose from multiple incident categories",
      "Add location and evidence photos",
      "Select escalation pathways (NGOs, government, HR)",
      "Receive anonymous report ID for tracking",
    ],
    action: "Next",
  },
  {
    id: 3,
    title: "Scan Products",
    description: "Discover product origins, worker information, and environmental impact.",
    icon: "📱",
    tips: [
      "Use QR code scanner for instant product data",
      "View fair wages and working conditions",
      "See environmental impact metrics",
      "Share product stories with community",
    ],
    action: "Next",
  },
  {
    id: 4,
    title: "Track Wildlife",
    description: "Report endangered species incidents and monitor biodiversity hotspots.",
    icon: "🦁",
    tips: [
      "Document wildlife incidents with photos",
      "View real-time incident map",
      "Join community protection zones",
      "Earn badges for conservation contributions",
    ],
    action: "Next",
  },
  {
    id: 5,
    title: "Earn Rewards",
    description: "Climb the leaderboard, unlock achievements, and see your global impact.",
    icon: "🏆",
    tips: [
      "Earn points for every contribution",
      "Unlock achievement badges",
      "Climb community leaderboard",
      "View your impact metrics",
    ],
    action: "Next",
  },
  {
    id: 6,
    title: "Customize Notifications",
    description: "Choose how and when you receive updates about your contributions.",
    icon: "🔔",
    tips: [
      "Select notification types (reports, incidents, achievements)",
      "Choose channels (in-app, push, email)",
      "Set quiet hours for uninterrupted rest",
      "Receive weekly impact digests",
    ],
    action: "Next",
  },
  {
    id: 7,
    title: "View Your Analytics",
    description: "Track your progress and see your contribution trends over time.",
    icon: "📊",
    tips: [
      "Monitor your level and ranking",
      "View monthly contribution trends",
      "See global impact metrics",
      "Celebrate your achievements",
    ],
    action: "Get Started",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useColors();
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleComplete();
  };

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)");
  };

  const handleGoToStep = (stepIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(stepIndex);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Progress Bar */}
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs font-semibold text-muted">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </Text>
              <TouchableOpacity onPress={handleSkip}>
                <Text className="text-xs font-semibold text-primary">Skip</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-surface rounded-full h-2 overflow-hidden border border-border">
              <View
                style={{
                  width: `${progress}%`,
                  backgroundColor: colors.primary,
                }}
                className="h-full"
              />
            </View>
          </View>

          {/* Main Content */}
          <View className="flex-1 gap-6 py-4">
            {/* Icon */}
            <View className="items-center">
              <Text className="text-6xl">{step.icon}</Text>
            </View>

            {/* Title and Description */}
            <View className="gap-3 items-center">
              <Text className="text-3xl font-bold text-foreground text-center">{step.title}</Text>
              <Text className="text-base text-muted text-center leading-relaxed">
                {step.description}
              </Text>
            </View>

            {/* Tips */}
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <Text className="text-sm font-semibold text-foreground">💡 Key Points:</Text>
              {step.tips.map((tip, index) => (
                <View key={index} className="flex-row gap-3">
                  <Text className="text-primary font-bold">•</Text>
                  <Text className="text-sm text-muted flex-1 leading-relaxed">{tip}</Text>
                </View>
              ))}
            </View>

            {/* Step Indicators */}
            <View className="flex-row justify-center gap-2 flex-wrap">
              {ONBOARDING_STEPS.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleGoToStep(index)}
                  style={{
                    backgroundColor: index === currentStep ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  }}
                  className="w-8 h-8 rounded-full items-center justify-center border active:opacity-80"
                >
                  <Text
                    className="text-xs font-bold"
                    style={{
                      color: index === currentStep ? "white" : colors.foreground,
                    }}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 pt-4">
            {currentStep > 0 && (
              <TouchableOpacity
                onPress={() => handleGoToStep(currentStep - 1)}
                style={{ borderColor: colors.border }}
                className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
              >
                <Text className="text-foreground font-semibold">Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              style={{ backgroundColor: colors.primary }}
              className={`${currentStep === 0 ? "flex-1" : "flex-1"} py-3 rounded-lg items-center active:opacity-80`}
            >
              <Text className="text-white font-semibold">{step.action}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
