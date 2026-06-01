import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Send,
  UserPlus,
  Users,
} from "lucide-react-native";
import type { User } from "../models/user";
import { useTripDetailViewModel } from "../viewmodels/useTripDetailViewModel";
import { getInitials, getInitialsFromName } from "../utils/initials";

type TripDetailScreenProps = {
  publicId: string;
  onBack: () => void;
};

export function TripDetailScreen({ publicId, onBack }: TripDetailScreenProps) {
  const vm = useTripDetailViewModel(publicId);
  const trip = vm.trip;

  if (vm.isLoading && !trip) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color="#FF6535" />
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{vm.error ?? "Trip not found"}</Text>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const membershipLabel = trip.hasJoined
    ? "Joined"
    : trip.hasRequested
      ? "Requested"
      : "Join Trip";
  const showMembershipAction = Boolean(trip.publicId && !trip.isOwner);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          {trip.image ? (
            <Image source={{ uri: trip.image }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroFallback}>
              <Text style={styles.heroFallbackText}>{trip.category ?? "Trip"}</Text>
            </View>
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.heroActions}>
            <Pressable style={styles.circleButton} onPress={onBack}>
              <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.3} />
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.badgeRow}>
              <Pill label={trip.visibility ?? "Public"} tone="mint" />
              <Pill label={trip.joinPolicy ?? "Open"} tone="orange" />
              <Pill label={trip.status ?? "Upcoming"} tone="cream" />
            </View>
            <Text style={styles.heroTitle}>{trip.title}</Text>
            <View style={styles.locationRow}>
              <MapPin color="#FFFFFF" size={14} />
              <Text style={styles.heroLocation}>
                {trip.location ?? trip.country ?? "Destination"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.hostRow}>
            <Avatar userName={trip.host} />
            <View style={styles.hostTextWrap}>
              <Text style={styles.hostName}>{trip.host}</Text>
              <Text style={styles.hostRole}>Trip Organizer</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {vm.stats.map((stat, index) => (
              <View
                key={stat.label}
                style={[
                  styles.statBox,
                  index === 1 && styles.statMint,
                  index === 2 && styles.statBlue,
                ]}
              >
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text numberOfLines={2} style={styles.statValue}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.likeButton} onPress={vm.toggleLike}>
              <Heart
                color={trip.liked ? "#FF6535" : "#98A2B3"}
                fill={trip.liked ? "#FF6535" : "transparent"}
                size={22}
              />
              <Text style={styles.likeButtonText}>Like</Text>
            </Pressable>
            {showMembershipAction ? (
              <Pressable
                disabled={!vm.canJoin}
                style={[
                  styles.joinButton,
                  !vm.canJoin && styles.joinButtonDisabled,
                ]}
                onPress={vm.requestJoin}
              >
                <UserPlus color="#FFFFFF" size={20} />
                <Text style={styles.joinButtonText}>{membershipLabel}</Text>
              </Pressable>
            ) : null}
            <Pressable
              style={styles.inviteButton}
              onPress={() => vm.setIsInviteOpen(true)}
            >
              <UserPlus color="#98A2B3" size={21} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.feedTitle}>Trip Feed</Text>

        {vm.canPost ? (
          <View style={styles.composer}>
            <Avatar userName={vm.currentUser?.firstName ?? "You"} small />
            <TextInput
              placeholder="Share a moment..."
              placeholderTextColor="#98A2B3"
              style={styles.composerInput}
              value={vm.postBody}
              onChangeText={vm.setPostBody}
            />
            <Pressable style={styles.sendButton} onPress={vm.submitPost}>
              <Send color="#FFFFFF" size={18} />
            </Pressable>
          </View>
        ) : null}

        {vm.posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Avatar
                firstName={post.author.firstName}
                lastName={post.author.lastName}
                username={post.author.username}
                userName={`${post.author.firstName} ${post.author.lastName}`}
                small
              />
              <View style={styles.postAuthorWrap}>
                <Text style={styles.postAuthor}>
                  {post.author.firstName} {post.author.lastName}
                </Text>
                <Text style={styles.postTime}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text style={styles.postBody}>{post.body}</Text>
            {post.imageUrl ? (
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            ) : null}
          </View>
        ))}

        {vm.posts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No posts yet. Start the trip feed.</Text>
          </View>
        ) : null}
      </ScrollView>

      <InviteFriendsSheet
        users={vm.inviteUsers}
        visible={vm.isInviteOpen}
        query={vm.query}
        onChangeQuery={vm.setQuery}
        onClose={() => vm.setIsInviteOpen(false)}
        onInvite={vm.inviteUser}
      />
    </SafeAreaView>
  );
}

function Pill({ label, tone }: { label: string; tone: "mint" | "orange" | "cream" }) {
  return (
    <View
      style={[
        styles.pill,
        tone === "mint" && styles.pillMint,
        tone === "orange" && styles.pillOrange,
      ]}
    >
      <Text
        style={[
          styles.pillText,
          tone === "mint" && styles.pillTextMint,
          tone === "orange" && styles.pillTextOrange,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function Avatar({
  firstName,
  lastName,
  username,
  userName,
  small = false,
}: {
  firstName?: string;
  lastName?: string;
  username?: string;
  userName: string;
  small?: boolean;
}) {
  const sizeStyle = small ? styles.avatarSmall : styles.avatar;
  const initials = firstName || lastName || username
    ? getInitials(firstName, lastName, username)
    : getInitialsFromName(userName);

  return (
    <View style={[sizeStyle, styles.avatarFallback]}>
      <Text style={styles.avatarFallbackText}>{initials}</Text>
    </View>
  );
}

function InviteFriendsSheet({
  users,
  visible,
  query,
  onChangeQuery,
  onClose,
  onInvite,
}: {
  users: User[];
  visible: boolean;
  query: string;
  onChangeQuery: (value: string) => void;
  onClose: () => void;
  onInvite: (userId: string) => void;
}) {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View style={styles.inviteSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.inviteTitle}>Invite Friends</Text>
          <View style={styles.searchBox}>
            <Send color="#98A2B3" size={18} />
            <TextInput
              autoCapitalize="none"
              placeholder="Search or enter email..."
              placeholderTextColor="#8F96A6"
              style={styles.searchInput}
              value={query}
              onChangeText={onChangeQuery}
            />
          </View>
          <Text style={styles.suggestedLabel}>Suggested</Text>
          {users.map((user) => (
            <View key={user.id} style={styles.inviteRow}>
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                username={user.username}
                userName={`${user.firstName} ${user.lastName}`}
                small
              />
              <View style={styles.inviteUserText}>
                <Text style={styles.inviteName}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.inviteHandle}>
                  @{user.username ?? user.email.split("@")[0]}
                </Text>
              </View>
              <Pressable
                style={styles.inviteAction}
                onPress={() => onInvite(user.id)}
              >
                <Text style={styles.inviteActionText}>Invite</Text>
              </Pressable>
            </View>
          ))}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8F0E7", flex: 1 },
  centered: {
    alignItems: "center",
    backgroundColor: "#F8F0E7",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: { paddingBottom: 32 },
  hero: { height: 390, overflow: "hidden" },
  heroImage: { height: "100%", width: "100%" },
  heroFallback: {
    alignItems: "center",
    backgroundColor: "#FFEEE5",
    flex: 1,
    justifyContent: "center",
  },
  heroFallbackText: { color: "#FF6535", fontSize: 34, fontWeight: "900" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18,14,8,0.24)",
  },
  heroActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    left: 20,
    position: "absolute",
    right: 20,
    top: 24,
  },
  circleButton: {
    alignItems: "center",
    backgroundColor: "rgba(23,23,43,0.45)",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  heroBottom: { bottom: 72, left: 24, position: "absolute", right: 24 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    backgroundColor: "#FFF8F3",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillMint: { backgroundColor: "#12CFA0" },
  pillOrange: { backgroundColor: "#FF6535" },
  pillText: { color: "#F26A2E", fontSize: 12, fontWeight: "900" },
  pillTextMint: { color: "#FFFFFF" },
  pillTextOrange: { color: "#FFFFFF" },
  heroTitle: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", marginTop: 16 },
  locationRow: { alignItems: "center", flexDirection: "row", gap: 6, marginTop: 10 },
  heroLocation: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#ECE3DA",
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: 18,
    marginTop: -48,
    padding: 18,
  },
  hostRow: { alignItems: "center", flexDirection: "row" },
  avatar: { borderRadius: 24, height: 48, width: 48 },
  avatarSmall: { borderRadius: 20, height: 40, width: 40 },
  avatarFallback: {
    alignItems: "center",
    backgroundColor: "#FFF0EA",
    justifyContent: "center",
  },
  avatarFallbackText: { color: "#FF6535", fontSize: 18, fontWeight: "900" },
  hostTextWrap: { flex: 1, marginLeft: 12 },
  hostName: { color: "#17172B", fontSize: 16, fontWeight: "900" },
  hostRole: { color: "#98A2B3", fontSize: 13, fontWeight: "700", marginTop: 4 },
  statsGrid: { flexDirection: "row", gap: 12, marginTop: 18 },
  statBox: {
    backgroundColor: "#FFF1E8",
    borderRadius: 16,
    flex: 1,
    minHeight: 78,
    padding: 12,
  },
  statMint: { backgroundColor: "#E5FBF2" },
  statBlue: { backgroundColor: "#E7F8FC" },
  statLabel: { color: "#98A2B3", fontSize: 12, fontWeight: "800" },
  statValue: { color: "#26233B", fontSize: 14, fontWeight: "900", marginTop: 8 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  likeButton: {
    alignItems: "center",
    backgroundColor: "#F4EFEA",
    borderRadius: 16,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 56,
  },
  likeButtonText: { color: "#8F96A6", fontSize: 15, fontWeight: "900" },
  joinButton: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 16,
    flex: 1.25,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 56,
  },
  joinButtonDisabled: {
    backgroundColor: "#98A2B3",
  },
  joinButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  inviteButton: {
    alignItems: "center",
    backgroundColor: "#F4EFEA",
    borderRadius: 16,
    minHeight: 56,
    justifyContent: "center",
    width: 56,
  },
  feedTitle: {
    color: "#17172B",
    fontSize: 20,
    fontWeight: "900",
    marginHorizontal: 18,
    marginTop: 24,
  },
  composer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#ECE3DA",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 18,
    marginTop: 20,
    padding: 14,
  },
  composerInput: {
    backgroundColor: "#F7F2EE",
    borderRadius: 16,
    color: "#17172B",
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 16,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 18,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#ECE3DA",
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 18,
    marginTop: 18,
    overflow: "hidden",
  },
  postHeader: { alignItems: "center", flexDirection: "row", padding: 16 },
  postAuthorWrap: { flex: 1, marginLeft: 12 },
  postAuthor: { color: "#17172B", fontSize: 15, fontWeight: "900" },
  postTime: { color: "#98A2B3", fontSize: 12, fontWeight: "700", marginTop: 3 },
  postBody: { color: "#17172B", fontSize: 15, lineHeight: 22, paddingHorizontal: 16, paddingBottom: 14 },
  postImage: { height: 280, width: "100%" },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    margin: 18,
    padding: 24,
  },
  emptyText: { color: "#8F96A6", fontWeight: "800" },
  errorText: { color: "#C2410C", marginBottom: 16, textAlign: "center" },
  secondaryButton: { backgroundColor: "#FFFFFF", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14 },
  secondaryButtonText: { color: "#FF6535", fontWeight: "900" },
  modalBackdrop: {
    backgroundColor: "rgba(23,23,43,0.5)",
    flex: 1,
    justifyContent: "flex-end",
  },
  inviteSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 30,
  },
  sheetHandle: { alignSelf: "center", backgroundColor: "#E4E0DC", borderRadius: 999, height: 5, marginBottom: 22, width: 54 },
  inviteTitle: { color: "#17172B", fontSize: 22, fontWeight: "900" },
  searchBox: {
    alignItems: "center",
    backgroundColor: "#F7F2EE",
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    paddingHorizontal: 14,
  },
  searchInput: { color: "#17172B", flex: 1, minHeight: 54 },
  suggestedLabel: { color: "#98A2B3", fontSize: 13, fontWeight: "900", marginTop: 18, textTransform: "uppercase" },
  inviteRow: { alignItems: "center", flexDirection: "row", gap: 12, marginTop: 14 },
  inviteUserText: { flex: 1 },
  inviteName: { color: "#17172B", fontSize: 15, fontWeight: "900" },
  inviteHandle: { color: "#8F96A6", fontSize: 13, fontWeight: "700", marginTop: 3 },
  inviteAction: { backgroundColor: "#FF6535", borderRadius: 18, paddingHorizontal: 18, paddingVertical: 12 },
  inviteActionText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  closeButton: { alignItems: "center", backgroundColor: "#F0ECE8", borderRadius: 16, marginTop: 22, minHeight: 54, justifyContent: "center" },
  closeButtonText: { color: "#667085", fontSize: 16, fontWeight: "900" },
});
