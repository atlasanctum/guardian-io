import { Text, View, TouchableOpacity, ScrollView, TextInput, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useI18n } from "@/lib/i18n";
import * as Haptics from "expo-haptics";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  liked: boolean;
}

interface ImpactStory {
  id: string;
  title: string;
  description: string;
  author: string;
  avatar: string;
  image: string;
  impact: string;
  timestamp: string;
  likes: number;
  shares: number;
  liked: boolean;
}

// Mock data
const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "1",
    title: "How to safely report labor violations",
    content: "I successfully reported unsafe working conditions using Guardian-IO. Here's what helped me...",
    author: "Maria García",
    avatar: "👩",
    timestamp: "2 hours ago",
    category: "Worker Rights",
    likes: 124,
    comments: 23,
    views: 456,
    liked: false,
  },
  {
    id: "2",
    title: "Community victory: Protected 500 acres of rainforest",
    content: "Thanks to our collective efforts, we successfully protected a critical habitat...",
    author: "James Okonkwo",
    avatar: "👨",
    timestamp: "1 day ago",
    category: "Conservation",
    likes: 892,
    comments: 156,
    views: 3421,
    liked: true,
  },
];

const MOCK_IMPACT_STORIES: ImpactStory[] = [
  {
    id: "1",
    title: "From Exploitation to Empowerment",
    description: "How reporting my story led to better working conditions for 50 workers in my factory",
    author: "Amara Osei",
    avatar: "👩‍🦱",
    image: "🏭",
    impact: "50 workers protected",
    timestamp: "3 days ago",
    likes: 567,
    shares: 89,
    liked: false,
  },
  {
    id: "2",
    title: "Saving the Bengal Tigers",
    description: "Our community's efforts to protect endangered tigers in the Sundarbans",
    author: "Rajesh Kumar",
    avatar: "👨‍🦱",
    image: "🐯",
    impact: "12 tigers protected",
    timestamp: "1 week ago",
    likes: 1234,
    shares: 234,
    liked: true,
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useI18n();
  const [selectedTab, setSelectedTab] = useState<"forum" | "stories">("forum");
  const [forumPosts, setForumPosts] = useState(MOCK_FORUM_POSTS);
  const [impactStories, setImpactStories] = useState(MOCK_IMPACT_STORIES);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (tab: "forum" | "stories") => {
    setSelectedTab(tab);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLikePost = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setForumPosts(
      forumPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const handleLikeStory = (storyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setImpactStories(
      impactStories.map((story) =>
        story.id === storyId
          ? {
              ...story,
              liked: !story.liked,
              likes: story.liked ? story.likes - 1 : story.likes + 1,
            }
          : story,
      ),
    );
  };

  const filteredPosts = forumPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredStories = impactStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="items-center gap-2 pb-2">
            <Text className="text-4xl">👥</Text>
            <Text className="text-3xl font-bold text-foreground">{t("community.forum")}</Text>
            <Text className="text-sm text-muted">Connect, share, and celebrate impact</Text>
          </View>

          {/* Search Bar */}
          <View
            style={{ borderColor: colors.border }}
            className="flex-row items-center gap-2 bg-surface rounded-lg px-3 py-2 border"
          >
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Search discussions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-foreground"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Tab Navigation */}
          <View className="flex-row gap-2 bg-surface rounded-lg p-1 border border-border">
            <TouchableOpacity
              onPress={() => handleTabChange("forum")}
              style={{
                backgroundColor: selectedTab === "forum" ? colors.primary : "transparent",
                flex: 1,
              }}
              className="py-2 rounded-md items-center active:opacity-80"
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color: selectedTab === "forum" ? "white" : colors.foreground,
                }}
              >
                {t("community.discussions")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleTabChange("stories")}
              style={{
                backgroundColor: selectedTab === "stories" ? colors.primary : "transparent",
                flex: 1,
              }}
              className="py-2 rounded-md items-center active:opacity-80"
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color: selectedTab === "stories" ? "white" : colors.foreground,
                }}
              >
                {t("community.impactStories")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forum Posts */}
          {selectedTab === "forum" && (
            <View className="gap-3">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <TouchableOpacity
                    key={post.id}
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                    className="p-4 rounded-lg border active:opacity-80"
                  >
                    {/* Post Header */}
                    <View className="flex-row items-center gap-3 mb-3">
                      <Text className="text-2xl">{post.avatar}</Text>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">{post.author}</Text>
                        <Text className="text-xs text-muted">{post.timestamp}</Text>
                      </View>
                      <View
                        style={{ backgroundColor: colors.primary }}
                        className="px-2 py-1 rounded"
                      >
                        <Text className="text-xs font-bold text-white">{post.category}</Text>
                      </View>
                    </View>

                    {/* Post Content */}
                    <View className="gap-2 mb-3">
                      <Text className="text-sm font-semibold text-foreground">{post.title}</Text>
                      <Text className="text-xs text-muted leading-relaxed">{post.content}</Text>
                    </View>

                    {/* Post Stats */}
                    <View className="flex-row justify-between items-center py-2 border-t border-border">
                      <View className="flex-row gap-4">
                        <TouchableOpacity
                          onPress={() => handleLikePost(post.id)}
                          className="flex-row items-center gap-1 active:opacity-80"
                        >
                          <Text className="text-lg">{post.liked ? "❤️" : "🤍"}</Text>
                          <Text className="text-xs text-muted">{post.likes}</Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-lg">💬</Text>
                          <Text className="text-xs text-muted">{post.comments}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-lg">👁️</Text>
                          <Text className="text-xs text-muted">{post.views}</Text>
                        </View>
                      </View>
                      <TouchableOpacity className="active:opacity-80">
                        <Text className="text-lg">↗️</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="items-center py-8 gap-2">
                  <Text className="text-2xl">🔍</Text>
                  <Text className="text-sm text-muted">{t("messages.noResults")}</Text>
                </View>
              )}
            </View>
          )}

          {/* Impact Stories */}
          {selectedTab === "stories" && (
            <View className="gap-3">
              {filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <TouchableOpacity
                    key={story.id}
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                    className="p-4 rounded-lg border active:opacity-80"
                  >
                    {/* Story Header */}
                    <View className="flex-row items-center gap-3 mb-3">
                      <Text className="text-2xl">{story.avatar}</Text>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">{story.author}</Text>
                        <Text className="text-xs text-muted">{story.timestamp}</Text>
                      </View>
                    </View>

                    {/* Story Image */}
                    <View className="bg-background rounded-lg py-8 items-center mb-3">
                      <Text className="text-5xl">{story.image}</Text>
                    </View>

                    {/* Story Content */}
                    <View className="gap-2 mb-3">
                      <Text className="text-sm font-semibold text-foreground">{story.title}</Text>
                      <Text className="text-xs text-muted leading-relaxed">{story.description}</Text>
                    </View>

                    {/* Impact Badge */}
                    <View
                      style={{ backgroundColor: colors.success }}
                      className="px-3 py-1 rounded-full mb-3 self-start"
                    >
                      <Text className="text-xs font-bold text-white">✨ {story.impact}</Text>
                    </View>

                    {/* Story Stats */}
                    <View className="flex-row justify-between items-center py-2 border-t border-border">
                      <View className="flex-row gap-4">
                        <TouchableOpacity
                          onPress={() => handleLikeStory(story.id)}
                          className="flex-row items-center gap-1 active:opacity-80"
                        >
                          <Text className="text-lg">{story.liked ? "❤️" : "🤍"}</Text>
                          <Text className="text-xs text-muted">{story.likes}</Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-lg">📤</Text>
                          <Text className="text-xs text-muted">{story.shares}</Text>
                        </View>
                      </View>
                      <TouchableOpacity className="active:opacity-80">
                        <Text className="text-lg">↗️</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="items-center py-8 gap-2">
                  <Text className="text-2xl">📖</Text>
                  <Text className="text-sm text-muted">{t("messages.noResults")}</Text>
                </View>
              )}
            </View>
          )}

          {/* Create Button */}
          <View className="flex-row gap-2 pt-4">
            <TouchableOpacity
              style={{ backgroundColor: colors.primary, flex: 1 }}
              className="py-3 rounded-lg items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">
                {selectedTab === "forum"
                  ? t("community.createPost")
                  : t("community.createStory")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row gap-2 pt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ borderColor: colors.border }}
              className="flex-1 py-3 rounded-lg items-center border active:opacity-80"
            >
              <Text className="text-foreground font-semibold">{t("common.back")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
