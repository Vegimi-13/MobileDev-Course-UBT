import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Globe2,
  Pencil,
  Plane,
} from "lucide-react-native";
import EditProfileSheet from "../components/EditProfileSheet";
import ProfileTripRow from "../components/ProfileTripRow";
import { useProfileViewModel } from "../viewmodels/useProfileViewModel";
import { getInitials } from "../utils/initials";

type ProfileScreenProps = {
  onLogout: () => void;
  onOpenTrip?: (publicId: string) => void;
};

export function ProfileScreen({ onLogout, onOpenTrip }: ProfileScreenProps) {
  const {
    user,
    error,
    trips,
    allTrips,
    fullName,
    handle,
    badgeItems,
    stats,
    tabItems,
    activeTab,
    cancelEditing,
    editError,
    isEditing,
    isSaving,
    profileForm,
    saveProfile,
    setActiveTab,
    startEditing,
    updateProfileField,
    emptyStateText,
  } = useProfileViewModel();

  const badgeIcons = {
    softOrange: <Globe2 color="#F26A2E" size={14} strokeWidth={2.1} />,
    softMint: <Plane color="#10B981" size={14} strokeWidth={2.1} />,
  } as const;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.decorBubbleOne} />
          <View style={styles.decorBubbleTwo} />

          <View style={styles.headerTitleRow}>
            <Text style={styles.profileLabel}>Profile</Text>
          </View>

          <View style={styles.headerLower}>
            <View style={styles.avatarShell}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(user?.firstName, user?.lastName, user?.username)}
                </Text>
              </View>
            </View>

            <Pressable style={styles.editButton} onPress={startEditing}>
              <Pencil color="#FFFFFF" size={16} strokeWidth={2.1} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.handle}>@{handle}</Text>
          <Text style={styles.bio}>
            {user?.bio ??
              "Explorer. Coffee addict. Always planning the next trip."}
          </Text>

          <View style={styles.badgesRow}>
            {badgeItems.map((badge) => (
              <View
                key={badge.label}
                style={[
                  styles.badge,
                  badge.tone === "softOrange" && styles.badgeOrange,
                  badge.tone === "softMint" && styles.badgeMint,
                ]}
              >
                {badgeIcons[badge.tone]}
                <Text
                  style={[
                    styles.badgeText,
                    badge.tone === "softOrange" && styles.badgeTextOrange,
                    badge.tone === "softMint" && styles.badgeTextMint,
                  ]}
                >
                  {badge.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View
                key={stat.label}
                style={[
                  styles.statBox,
                  index < stats.length - 1 && styles.statBoxDivider,
                ]}
              >
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tabRow}>
            {tabItems.map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeTab === "trips" && (
            <View style={styles.tripList}>
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <ProfileTripRow
                    key={trip.id}
                    trip={trip}
                    onOpenTrip={(item) =>
                      item.publicId && onOpenTrip?.(item.publicId)
                    }
                  />
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>{emptyStateText}</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === "gallery" && (
            <View style={styles.photoGrid}>
              {allTrips.filter((trip) => trip.image).length > 0 ? (
                allTrips.filter((trip) => trip.image).slice(0, 9).map((trip) => (
                  <Image
                    key={trip.id}
                    source={{ uri: trip.image }}
                    style={styles.photoTile}
                  />
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>{emptyStateText}</Text>
                </View>
              )}
            </View>
          )}

          <Pressable style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Sign out</Text>
          </Pressable>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.footerSpacer} />
        </View>
      </ScrollView>
      <EditProfileSheet
        error={editError}
        form={profileForm}
        isSaving={isSaving}
        onCancel={cancelEditing}
        onChange={updateProfileField}
        onSave={saveProfile}
        visible={isEditing}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F0E7",
  },
  scrollContent: {
    paddingBottom: 18,
  },
  header: {
    backgroundColor: "#FF6A3D",
    height: 222,
    overflow: "visible",
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  decorBubbleOne: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    height: 48,
    position: "absolute",
    right: 86,
    top: 54,
    width: 48,
  },
  decorBubbleTwo: {
    backgroundColor: "rgba(255,190,122,0.28)",
    borderRadius: 44,
    height: 88,
    position: "absolute",
    right: 38,
    top: 26,
    width: 88,
  },
  headerTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileLabel: {
    color: "#FFF8F3",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 24,
  },
  headerLower: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  avatarShell: {
    marginBottom: -58,
    position: "relative",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#17172B",
    borderColor: "#FFFFFF",
    borderRadius: 26,
    borderWidth: 4,
    height: 126,
    justifyContent: "center",
    width: 126,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  editButton: {
    alignItems: "center",
    backgroundColor: "#FF6A3D",
    borderColor: "rgba(255,255,255,0.55)",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: -16,
    minHeight: 54,
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 74,
  },
  name: {
    color: "#26233B",
    fontSize: 21,
    fontWeight: "900",
  },
  handle: {
    color: "#8C96A9",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },
  bio: {
    color: "#69758A",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  badge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeOrange: {
    backgroundColor: "#FFF1E8",
  },
  badgeMint: {
    backgroundColor: "#E7FBF2",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  badgeTextOrange: {
    color: "#F26A2E",
  },
  badgeTextMint: {
    color: "#12B981",
  },
  statsRow: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E9E1D9",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 22,
    overflow: "hidden",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 24,
  },
  statBoxDivider: {
    borderRightColor: "#EEE7E0",
    borderRightWidth: 1,
  },
  statNumber: {
    color: "#26233B",
    fontSize: 22,
    fontWeight: "900",
  },
  statLabel: {
    color: "#98A0B3",
    fontSize: 13,
    marginTop: 6,
  },
  tabRow: {
    backgroundColor: "#EEE6DE",
    borderRadius: 22,
    flexDirection: "row",
    marginTop: 22,
    padding: 5,
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 17,
    flex: 1,
    justifyContent: "center",
    minHeight: 50,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#271B14",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabText: {
    color: "#98A0B3",
    fontSize: 15,
    fontWeight: "800",
  },
  tabTextActive: {
    color: "#26233B",
  },
  tripList: {
    marginTop: 20,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  photoTile: {
    aspectRatio: 1,
    borderRadius: 16,
    width: "31.8%",
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#ECE3DA",
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
  },
  emptyText: {
    color: "#8B96A7",
    fontSize: 14,
    textAlign: "center",
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#F0E5DA",
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 8,
    minHeight: 52,
  },
  logoutText: {
    color: "#F26A2E",
    fontSize: 15,
    fontWeight: "900",
  },
  errorText: {
    color: "#C2410C",
    marginTop: 12,
    textAlign: "center",
  },
  footerSpacer: {
    height: 86,
  },
});
