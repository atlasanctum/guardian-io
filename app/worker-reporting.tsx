import { ScrollView, Text, View, TouchableOpacity, TextInput, Pressable, Modal, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

type IncidentType = "harassment" | "wage-theft" | "unsafe-conditions" | "trafficking" | "other";
type EscalationPath = "ngo" | "government" | "internal" | "anonymous";

interface IncidentCategory {
  id: IncidentType;
  label: string;
  description: string;
  icon: string;
}

interface EscalationOption {
  id: EscalationPath;
  label: string;
  description: string;
  icon: string;
}

const INCIDENT_CATEGORIES: IncidentCategory[] = [
  {
    id: "harassment",
    label: "Harassment",
    description: "Physical, verbal, or sexual harassment",
    icon: "⚠️",
  },
  {
    id: "wage-theft",
    label: "Wage Theft",
    description: "Unpaid wages, illegal deductions",
    icon: "💰",
  },
  {
    id: "unsafe-conditions",
    label: "Unsafe Conditions",
    description: "Dangerous work environment",
    icon: "🚨",
  },
  {
    id: "trafficking",
    label: "Trafficking Indicators",
    description: "Signs of forced labor or trafficking",
    icon: "🚫",
  },
  {
    id: "other",
    label: "Other",
    description: "Other rights violations",
    icon: "📝",
  },
];

const ESCALATION_OPTIONS: EscalationOption[] = [
  {
    id: "ngo",
    label: "Trusted NGO",
    description: "Report to verified NGO partners",
    icon: "🤝",
  },
  {
    id: "government",
    label: "Government Authority",
    description: "Report to labor department",
    icon: "🏛️",
  },
  {
    id: "internal",
    label: "Internal HR",
    description: "Report to company HR",
    icon: "💼",
  },
  {
    id: "anonymous",
    label: "Anonymous Only",
    description: "Keep completely anonymous",
    icon: "🔒",
  },
];

export default function WorkerReportingScreen() {
  const router = useRouter();
  const colors = useColors();
  const [step, setStep] = useState<"category" | "details" | "escalation" | "confirmation">("category");
  const [selectedCategory, setSelectedCategory] = useState<IncidentType | null>(null);
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationPath | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [reportId, setReportId] = useState("");

  const handleCategorySelect = (category: IncidentType) => {
    setSelectedCategory(category);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep("details");
  };

  const handleDetailsSubmit = () => {
    if (description.trim() && location.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep("escalation");
    }
  };

  const handleEscalationSelect = (escalation: EscalationPath) => {
    setSelectedEscalation(escalation);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep("confirmation");
  };

  const handleSubmitReport = async () => {
    // Generate anonymous report ID
    const id = `#${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
    setReportId(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep("confirmation");
  };

  const handleBackStep = () => {
    if (step === "details") {
      setStep("category");
    } else if (step === "escalation") {
      setStep("details");
    }
  };

  const handleNewReport = () => {
    setStep("category");
    setSelectedCategory(null);
    setSelectedEscalation(null);
    setDescription("");
    setLocation("");
    setReportId("");
  };

  const renderCategoryStep = () => (
    <View className="gap-4">
      <View className="items-center gap-2 pb-4">
        <Text className="text-4xl">📋</Text>
        <Text className="text-2xl font-bold text-foreground">Report Incident</Text>
        <Text className="text-sm text-muted text-center">
          Choose the type of violation you experienced
        </Text>
      </View>

      <View className="gap-3">
        {INCIDENT_CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => handleCategorySelect(category.id)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View className="bg-surface rounded-xl p-4 border border-border">
              <View className="flex-row items-start gap-3">
                <Text className="text-3xl">{category.icon}</Text>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {category.label}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    {category.description}
                  </Text>
                </View>
                <Text className="text-lg text-primary">→</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderDetailsStep = () => (
    <View className="gap-4">
      <View className="items-center gap-2 pb-4">
        <Text className="text-4xl">📝</Text>
        <Text className="text-2xl font-bold text-foreground">Incident Details</Text>
        <Text className="text-sm text-muted text-center">
          Provide information about what happened
        </Text>
      </View>

      <View className="gap-3">
        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">
            Incident Category
          </Text>
          <View className="bg-primary/10 rounded-lg p-3 border border-primary">
            <Text className="text-base text-foreground font-medium">
              {INCIDENT_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">
            What happened? *
          </Text>
          <TextInput
            placeholder="Describe the incident in detail..."
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            className="bg-surface rounded-lg p-3 text-foreground border border-border"
            style={{ color: colors.foreground }}
          />
          <Text className="text-xs text-muted mt-1">
            {description.length}/500 characters
          </Text>
        </View>

        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">
            Location (optional)
          </Text>
          <TextInput
            placeholder="Workplace or location where incident occurred"
            placeholderTextColor={colors.muted}
            value={location}
            onChangeText={setLocation}
            className="bg-surface rounded-lg p-3 text-foreground border border-border"
            style={{ color: colors.foreground }}
          />
        </View>

        <View className="gap-3 pt-4">
          <TouchableOpacity
            onPress={handleDetailsSubmit}
            style={{ backgroundColor: colors.primary }}
            className="py-4 rounded-lg items-center active:opacity-80"
            disabled={!description.trim() || !location.trim()}
          >
            <Text className="text-white font-semibold">Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBackStep}
            style={{ borderColor: colors.border }}
            className="py-4 rounded-lg items-center border active:opacity-80"
          >
            <Text className="text-foreground font-semibold">Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEscalationStep = () => (
    <View className="gap-4">
      <View className="items-center gap-2 pb-4">
        <Text className="text-4xl">🔗</Text>
        <Text className="text-2xl font-bold text-foreground">Who Should Know?</Text>
        <Text className="text-sm text-muted text-center">
          Choose how to escalate this report
        </Text>
      </View>

      <View className="gap-3">
        {ESCALATION_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => handleEscalationSelect(option.id)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View
              className={`rounded-xl p-4 border-2 ${
                selectedEscalation === option.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface"
              }`}
              style={{
                borderColor:
                  selectedEscalation === option.id ? colors.primary : colors.border,
              }}
            >
              <View className="flex-row items-start gap-3">
                <Text className="text-3xl">{option.icon}</Text>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {option.label}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    {option.description}
                  </Text>
                </View>
                {selectedEscalation === option.id && (
                  <Text className="text-lg text-primary">✓</Text>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View className="gap-3 pt-4">
        <TouchableOpacity
          onPress={handleSubmitReport}
          style={{ backgroundColor: colors.primary }}
          className="py-4 rounded-lg items-center active:opacity-80"
          disabled={!selectedEscalation}
        >
          <Text className="text-white font-semibold">Submit Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBackStep}
          style={{ borderColor: colors.border }}
          className="py-4 rounded-lg items-center border active:opacity-80"
        >
          <Text className="text-foreground font-semibold">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfirmationStep = () => (
    <View className="gap-6 items-center">
      <View className="items-center gap-4 pt-8">
        <Text className="text-6xl">✅</Text>
        <Text className="text-2xl font-bold text-foreground text-center">
          Report Submitted
        </Text>
        <Text className="text-sm text-muted text-center leading-relaxed">
          Your anonymous report has been securely submitted and will be reviewed by trusted
          organizations.
        </Text>
      </View>

      <View className="bg-surface rounded-xl p-6 w-full gap-3 mt-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-muted">Report ID</Text>
          <Text className="text-base font-mono font-bold text-foreground">{reportId}</Text>
        </View>

        <View className="h-px bg-border" />

        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-muted">Category</Text>
          <Text className="text-base text-foreground font-medium">
            {INCIDENT_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
          </Text>
        </View>

        <View className="h-px bg-border" />

        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-muted">Escalation</Text>
          <Text className="text-base text-foreground font-medium">
            {ESCALATION_OPTIONS.find((e) => e.id === selectedEscalation)?.label}
          </Text>
        </View>
      </View>

      <View className="bg-forest/10 rounded-xl p-4 gap-2 w-full border border-forest/30 mt-4">
        <Text className="text-sm font-semibold text-forest">What Happens Next</Text>
        <Text className="text-xs text-forest/80 leading-relaxed">
          Your report will be reviewed within 48 hours. You can track its status using your
          report ID. Emergency situations will be escalated immediately.
        </Text>
      </View>

      <View className="gap-3 w-full pt-4">
        <TouchableOpacity
          onPress={handleNewReport}
          style={{ backgroundColor: colors.primary }}
          className="py-4 rounded-lg items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Submit Another Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ borderColor: colors.border }}
          className="py-4 rounded-lg items-center border active:opacity-80"
        >
          <Text className="text-foreground font-semibold">Return Home</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center gap-2 pb-4">
        <Text className="text-xs text-muted">Emergency? Call our hotline:</Text>
        <Text className="text-sm font-bold text-error">+1-800-GUARDIAN</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          {step === "category" && renderCategoryStep()}
          {step === "details" && renderDetailsStep()}
          {step === "escalation" && renderEscalationStep()}
          {step === "confirmation" && renderConfirmationStep()}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
