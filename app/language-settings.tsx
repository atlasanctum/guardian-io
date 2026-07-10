import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useI18n, type Language } from "@/lib/i18n";
import * as Haptics from "expo-haptics";

const LANGUAGES: Array<{ code: Language; name: string; nativeName: string; flag: string }> = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
];

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { language, setLanguage, t } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  const handleSelectLanguage = async (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLanguage(lang);
    await setLanguage(lang);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">🌐</Text>
            <Text className="text-3xl font-bold text-foreground">Language</Text>
            <Text className="text-sm text-muted">Choose your preferred language</Text>
          </View>

          {/* Language Options */}
          <View className="gap-3">
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleSelectLanguage(lang.code)}
                style={{
                  backgroundColor: selectedLanguage === lang.code ? colors.primary : colors.surface,
                  borderColor: selectedLanguage === lang.code ? colors.primary : colors.border,
                }}
                className="p-4 rounded-lg border flex-row items-center justify-between active:opacity-80"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Text className="text-3xl">{lang.flag}</Text>
                  <View>
                    <Text
                      className="text-base font-semibold"
                      style={{
                        color: selectedLanguage === lang.code ? "white" : colors.foreground,
                      }}
                    >
                      {lang.name}
                    </Text>
                    <Text
                      className="text-xs"
                      style={{
                        color: selectedLanguage === lang.code ? "rgba(255,255,255,0.7)" : colors.muted,
                      }}
                    >
                      {lang.nativeName}
                    </Text>
                  </View>
                </View>
                {selectedLanguage === lang.code && (
                  <Text className="text-lg">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Box */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary/30 gap-2">
            <Text className="text-sm font-semibold text-primary">💡 Language Support</Text>
            <Text className="text-xs text-primary/80 leading-relaxed">
              Guardian-IO is available in English, Spanish, and French. Your language preference will be saved and applied across the app.
            </Text>
          </View>

          {/* Language Features */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Translated Features</Text>
            <View className="gap-2">
              {[
                "✓ All user interface elements",
                "✓ Report submission forms",
                "✓ Notifications and alerts",
                "✓ Community discussions",
                "✓ Help and support content",
              ].map((feature, index) => (
                <View key={index} className="flex-row items-center gap-2">
                  <Text className="text-primary">{feature.split(" ")[0]}</Text>
                  <Text className="text-xs text-muted">{feature.substring(2)}</Text>
                </View>
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
              onPress={() => router.push("/(tabs)")}
              style={{ backgroundColor: colors.primary }}
              className="flex-1 py-3 rounded-lg items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
