import { Text, View, TouchableOpacity, ScrollView, TextInput, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useWorkerReportSubmission } from "@/hooks/use-guardian-api";
import { useCameraCapture, useImagePicker, useMediaCollection } from "@/hooks/use-multimedia-capture";
import * as Haptics from "expo-haptics";

const INCIDENT_CATEGORIES = [
  { id: "harassment", label: "Harassment", icon: "😠" },
  { id: "wage-theft", label: "Wage Theft", icon: "💰" },
  { id: "unsafe-conditions", label: "Unsafe Conditions", icon: "⚠️" },
  { id: "trafficking", label: "Trafficking Indicators", icon: "🚨" },
  { id: "other", label: "Other", icon: "📝" },
];

const ESCALATION_PATHS = [
  { id: "ngo", label: "NGO Partner", description: "Report to trusted NGO" },
  { id: "government", label: "Government Agency", description: "Report to labor department" },
  { id: "internal", label: "Internal HR", description: "Report to company HR" },
  { id: "anonymous", label: "Anonymous Only", description: "Keep completely anonymous" },
];

export default function WorkerReportingEnhancedScreen() {
  const router = useRouter();
  const colors = useColors();
  const { submitReport, isLoading, error } = useWorkerReportSubmission();
  const { capturePhoto } = useCameraCapture();
  const { pickImage } = useImagePicker();
  const { mediaFiles, addMedia, removeMedia, getMediaCount } = useMediaCollection();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [step, setStep] = useState<"category" | "details" | "media" | "escalation" | "review">(
    "category",
  );
  const [reportId, setReportId] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleEscalationSelect = (escalationId: string) => {
    setSelectedEscalation(escalationId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCapturePhoto = async () => {
    const photo = await capturePhoto();
    if (photo) {
      addMedia(photo);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handlePickImage = async () => {
    const image = await pickImage();
    if (image) {
      addMedia(image);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedCategory || !description || !location || !selectedEscalation) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      const result = await submitReport({
        incidentType: selectedCategory,
        description,
        location,
        escalationPath: selectedEscalation,
      });

      if (result.success) {
        setReportId(result.reportId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStep("review");
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedEscalation(null);
    setDescription("");
    setLocation("");
    setReportId(null);
    setStep("category");
  };

  const getCategoryLabel = (id: string) => {
    return INCIDENT_CATEGORIES.find((c) => c.id === id)?.label || "";
  };

  const getEscalationLabel = (id: string) => {
    return ESCALATION_PATHS.find((e) => e.id === id)?.label || "";
  };

  // Step 1: Category Selection
  if (step === "category") {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-4">
            <View className="items-center gap-2 pb-4">
              <Text className="text-4xl">📋</Text>
              <Text className="text-2xl font-bold text-foreground">Report Incident</Text>
              <Text className="text-sm text-muted text-center">Step 1 of 4: Select incident type</Text>
            </View>

            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">What happened?</Text>
              {INCIDENT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => {
                    handleCategorySelect(category.id);
                    setStep("details");
                  }}
                  style={{
                    backgroundColor:
                      selectedCategory === category.id ? colors.primary : colors.surface,
                    borderColor: selectedCategory === category.id ? colors.primary : colors.border,
                  }}
                  className="p-4 rounded-xl border-2 active:opacity-80 flex-row items-center gap-3"
                >
                  <Text className="text-2xl">{category.icon}</Text>
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{
                        color:
                          selectedCategory === category.id ? "white" : colors.foreground,
                      }}
                    >
                      {category.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View className="bg-primary/10 rounded-xl p-4 gap-2 border border-primary/30 mt-4">
              <Text className="text-sm font-semibold text-primary">🔒 Your Safety First</Text>
              <Text className="text-xs text-primary/80 leading-relaxed">
                Your identity is protected. This report will be handled by trusted organizations.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Step 2: Details
  if (step === "details") {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-4">
            <View className="items-center gap-2 pb-4">
              <Text className="text-4xl">📝</Text>
              <Text className="text-2xl font-bold text-foreground">Incident Details</Text>
              <Text className="text-sm text-muted text-center">Step 2 of 4: Describe what happened</Text>
            </View>

            <View className="gap-3">
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Category: {getCategoryLabel(selectedCategory || "")}
                </Text>
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Location</Text>
                <TextInput
                  placeholder="Where did this happen?"
                  value={location}
                  onChangeText={setLocation}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Description</Text>
                <TextInput
                  placeholder="Describe the incident in detail..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={6}
                  className="bg-surface border border-border rounded-lg p-3 text-foreground"
                  placeholderTextColor={colors.muted}
                  textAlignVertical="top"
                />
                <Text className="text-xs text-muted mt-1">{description.length} / 1000</Text>
              </View>
            </View>

            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity
                onPress={() => setStep("category")}
                style={{ borderColor: colors.border }}
                className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
              >
                <Text className="text-foreground font-semibold">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStep("media")}
                style={{ backgroundColor: colors.primary }}
                className="flex-1 py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Step 3: Media
  if (step === "media") {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-4">
            <View className="items-center gap-2 pb-4">
              <Text className="text-4xl">📸</Text>
              <Text className="text-2xl font-bold text-foreground">Add Evidence</Text>
              <Text className="text-sm text-muted text-center">Step 3 of 4: Attach photos or videos (optional)</Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleCapturePhoto}
                style={{ backgroundColor: colors.primary }}
                className="flex-1 py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold text-sm">📷 Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePickImage}
                style={{ backgroundColor: colors.ocean }}
                className="flex-1 py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold text-sm">🖼️ Pick Image</Text>
              </TouchableOpacity>
            </View>

            {getMediaCount() > 0 && (
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Attached: {getMediaCount()} file{getMediaCount() !== 1 ? "s" : ""}
                </Text>
                {mediaFiles.map((media, idx) => (
                  <View
                    key={idx}
                    className="bg-surface rounded-lg p-3 flex-row items-center justify-between border border-border"
                  >
                    <View className="flex-row items-center gap-2 flex-1">
                      <Text className="text-xl">{media.type === "image" ? "🖼️" : "🎥"}</Text>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {media.fileName || `${media.type}.jpg`}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeMedia(media.uri)}
                      className="p-2 active:opacity-80"
                    >
                      <Text className="text-lg">❌</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View className="bg-forest/10 rounded-xl p-4 gap-2 border border-forest/30 mt-4">
              <Text className="text-sm font-semibold text-forest">📸 Evidence Tips</Text>
              <Text className="text-xs text-forest/80 leading-relaxed">
                Photos and videos strengthen your report. Capture clear images of any evidence, but prioritize your safety.
              </Text>
            </View>

            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity
                onPress={() => setStep("details")}
                style={{ borderColor: colors.border }}
                className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
              >
                <Text className="text-foreground font-semibold">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStep("escalation")}
                style={{ backgroundColor: colors.primary }}
                className="flex-1 py-3 rounded-lg items-center active:opacity-80"
              >
                <Text className="text-white font-semibold">Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Step 4: Escalation
  if (step === "escalation") {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-4">
            <View className="items-center gap-2 pb-4">
              <Text className="text-4xl">🎯</Text>
              <Text className="text-2xl font-bold text-foreground">Choose Path</Text>
              <Text className="text-sm text-muted text-center">Step 4 of 4: Where should this go?</Text>
            </View>

            <View className="gap-3">
              {ESCALATION_PATHS.map((path) => (
                <TouchableOpacity
                  key={path.id}
                  onPress={() => handleEscalationSelect(path.id)}
                  style={{
                    backgroundColor:
                      selectedEscalation === path.id ? colors.primary : colors.surface,
                    borderColor: selectedEscalation === path.id ? colors.primary : colors.border,
                  }}
                  className="p-4 rounded-xl border-2 active:opacity-80"
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color: selectedEscalation === path.id ? "white" : colors.foreground,
                    }}
                  >
                    {path.label}
                  </Text>
                  <Text
                    className="text-xs mt-1"
                    style={{
                      color: selectedEscalation === path.id ? "rgba(255,255,255,0.8)" : colors.muted,
                    }}
                  >
                    {path.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-2 mt-4">
              <TouchableOpacity
                onPress={() => setStep("media")}
                style={{ borderColor: colors.border }}
                className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
              >
                <Text className="text-foreground font-semibold">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitReport}
                style={{ backgroundColor: colors.primary }}
                className="flex-1 py-3 rounded-lg items-center active:opacity-80"
                disabled={isLoading}
              >
                <Text className="text-white font-semibold">
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View className="bg-error/10 rounded-xl p-4 gap-2 border border-error/30">
                <Text className="text-sm font-semibold text-error">❌ Error</Text>
                <Text className="text-xs text-error/80">{error}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Step 5: Review/Success
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4 items-center justify-center">
          <Text className="text-6xl">✅</Text>
          <Text className="text-2xl font-bold text-foreground text-center">Report Submitted</Text>
          <Text className="text-sm text-muted text-center">Your report has been safely received</Text>

          <View className="bg-primary/10 rounded-xl p-6 gap-3 border-2 border-primary w-full mt-6">
            <Text className="text-sm font-semibold text-primary">Your Report ID</Text>
            <Text className="text-2xl font-bold text-primary text-center">{reportId}</Text>
            <Text className="text-xs text-primary/80 text-center">
              Save this ID to track your report status
            </Text>
          </View>

          <View className="bg-surface rounded-xl p-4 gap-2 border border-border w-full mt-4">
            <Text className="text-sm font-semibold text-foreground">What happens next?</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Your report will be reviewed and escalated to {getEscalationLabel(selectedEscalation || "")}. You'll receive updates on the status using your Report ID.
            </Text>
          </View>

          <View className="flex-row gap-2 w-full mt-6">
            <TouchableOpacity
              onPress={() => router.push("/report-tracking")}
              style={{ backgroundColor: colors.primary }}
              className="flex-1 py-3 rounded-lg items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">Track Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReset}
              style={{ borderColor: colors.border }}
              className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
            >
              <Text className="text-foreground font-semibold">Submit Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
