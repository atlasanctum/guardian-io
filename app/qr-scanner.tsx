import { Text, View, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface ProductData {
  id: string;
  name: string;
  origin: string;
  workers: number;
  wages: string;
  environmental: string;
  biodiversity: string;
  community: string;
  story: string;
  impact: {
    label: string;
    value: string;
  }[];
}

// Mock product data - in real app, this would come from scanned QR code
const MOCK_PRODUCTS: Record<string, ProductData> = {
  "PROD-001": {
    id: "PROD-001",
    name: "Fair Trade Coffee",
    origin: "Ethiopian Highlands, Yirgacheffe Region",
    workers: 47,
    wages: "$8.50/hour (above local average)",
    environmental: "100% shade-grown, no pesticides",
    biodiversity: "Protected 250 acres of native forest",
    community: "$5,000 invested in local school",
    story:
      "This coffee is grown by the Tadesse Cooperative, a worker-owned collective of 47 farmers. Each purchase supports fair wages, environmental stewardship, and community development.",
    impact: [
      { label: "Workers Supported", value: "47" },
      { label: "Forest Protected", value: "250 acres" },
      { label: "Community Fund", value: "$5,000" },
      { label: "Carbon Offset", value: "2.3 tons" },
    ],
  },
  "PROD-002": {
    id: "PROD-002",
    name: "Regenerative Cotton T-Shirt",
    origin: "Organic Farm, Rajasthan, India",
    workers: 12,
    wages: "$6.75/hour (certified fair wage)",
    environmental: "Regenerative agriculture, water conservation",
    biodiversity: "Soil health improved, pollinator habitat restored",
    community: "Worker training program, healthcare access",
    story:
      "Made from cotton grown using regenerative practices that restore soil health and increase biodiversity. Workers receive fair wages and access to healthcare and education.",
    impact: [
      { label: "Workers Empowered", value: "12" },
      { label: "Soil Health Score", value: "8.5/10" },
      { label: "Water Saved", value: "45,000 L" },
      { label: "Health Coverage", value: "100%" },
    ],
  },
};

export default function QRScannerScreen() {
  const router = useRouter();
  const colors = useColors();
  const [scannedProduct, setScannedProduct] = useState<ProductData | null>(null);
  const [showScanner, setShowScanner] = useState(true);

  const handleSimulatedScan = (productId: string) => {
    const product = MOCK_PRODUCTS[productId];
    if (product) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScannedProduct(product);
      setShowScanner(false);
    }
  };

  const handleNewScan = () => {
    setShowScanner(true);
    setScannedProduct(null);
  };

  const handleContribute = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to contribution screen
  };

  const renderScannerView = () => (
    <View className="gap-6">
      <View className="items-center gap-4 pt-8">
        <Text className="text-6xl">📱</Text>
        <Text className="text-2xl font-bold text-foreground text-center">
          Scan Product QR Code
        </Text>
        <Text className="text-sm text-muted text-center leading-relaxed">
          Point your camera at the QR code on the product packaging to discover its story
        </Text>
      </View>

      <View
        className="w-full aspect-square rounded-2xl border-4 border-dashed"
        style={{ borderColor: colors.primary }}
      >
        <View className="flex-1 bg-surface/50 rounded-2xl items-center justify-center gap-4">
          <Text className="text-5xl">📷</Text>
          <Text className="text-sm text-muted text-center px-4">
            Camera access required
          </Text>
        </View>
      </View>

      <View className="gap-3">
        <TouchableOpacity
          onPress={() => handleSimulatedScan("PROD-001")}
          style={{ backgroundColor: colors.primary }}
          className="py-4 rounded-lg items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Scan Coffee Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSimulatedScan("PROD-002")}
          style={{ backgroundColor: colors.ocean }}
          className="py-4 rounded-lg items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Scan T-Shirt Product</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-forest/10 rounded-xl p-4 gap-2 border border-forest/30">
        <Text className="text-sm font-semibold text-forest">How It Works</Text>
        <Text className="text-xs text-forest/80 leading-relaxed">
          Each Guardian-IO verified product has a unique QR code. Scanning it reveals the
          complete supply chain story, worker information, environmental impact, and
          community benefits.
        </Text>
      </View>
    </View>
  );

  const renderProductView = () => (
    <View className="gap-6">
      {/* Product Header */}
      <View className="items-center gap-3 pt-4">
        <Text className="text-5xl">📦</Text>
        <Text className="text-2xl font-bold text-foreground text-center">
          {scannedProduct?.name}
        </Text>
        <View className="bg-primary/10 rounded-full px-4 py-2 border border-primary">
          <Text className="text-xs font-semibold text-primary">✓ Verified Ethical</Text>
        </View>
      </View>

      {/* Origin & Details */}
      <View className="bg-surface rounded-xl p-4 gap-3 border border-border">
        <View>
          <Text className="text-xs text-muted font-semibold mb-1">ORIGIN</Text>
          <Text className="text-base text-foreground">{scannedProduct?.origin}</Text>
        </View>
        <View className="h-px bg-border" />
        <View>
          <Text className="text-xs text-muted font-semibold mb-1">WORKERS</Text>
          <Text className="text-base text-foreground">{scannedProduct?.workers} people</Text>
        </View>
        <View className="h-px bg-border" />
        <View>
          <Text className="text-xs text-muted font-semibold mb-1">FAIR WAGES</Text>
          <Text className="text-base text-foreground">{scannedProduct?.wages}</Text>
        </View>
      </View>

      {/* Impact Metrics */}
      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">Your Impact</Text>
        <View className="gap-2">
          {scannedProduct?.impact.map((metric, idx) => (
            <View key={idx} className="bg-surface rounded-lg p-3 flex-row justify-between items-center border border-border">
              <Text className="text-sm text-muted">{metric.label}</Text>
              <Text className="text-base font-bold text-primary">{metric.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Story Section */}
      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">The Story</Text>
        <View className="bg-surface rounded-xl p-4 border border-border">
          <Text className="text-sm text-foreground leading-relaxed">
            {scannedProduct?.story}
          </Text>
        </View>
      </View>

      {/* Environmental & Community */}
      <View className="gap-3">
        <View className="bg-forest/10 rounded-xl p-4 gap-2 border border-forest/30">
          <Text className="text-sm font-semibold text-forest">🌱 Environmental</Text>
          <Text className="text-xs text-forest/80 leading-relaxed">
            {scannedProduct?.environmental}
          </Text>
        </View>

        <View className="bg-ocean/10 rounded-xl p-4 gap-2 border border-ocean/30">
          <Text className="text-sm font-semibold text-ocean">🌍 Biodiversity</Text>
          <Text className="text-xs text-ocean/80 leading-relaxed">
            {scannedProduct?.biodiversity}
          </Text>
        </View>

        <View className="bg-primary/10 rounded-xl p-4 gap-2 border border-primary/30">
          <Text className="text-sm font-semibold text-primary">🤝 Community</Text>
          <Text className="text-xs text-primary/80 leading-relaxed">
            {scannedProduct?.community}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="gap-3 pt-4">
        <TouchableOpacity
          onPress={handleContribute}
          style={{ backgroundColor: colors.primary }}
          className="py-4 rounded-lg items-center active:opacity-80"
        >
          <Text className="text-white font-semibold">Support This Producer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNewScan}
          style={{ borderColor: colors.border }}
          className="py-4 rounded-lg items-center border active:opacity-80"
        >
          <Text className="text-foreground font-semibold">Scan Another Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ borderColor: colors.border }}
          className="py-4 rounded-lg items-center border active:opacity-80"
        >
          <Text className="text-foreground font-semibold">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          {showScanner ? renderScannerView() : renderProductView()}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
