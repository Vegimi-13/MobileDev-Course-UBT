import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Bell, Search } from "lucide-react-native";
import ExploreTripCard from "../components/ExploreTripCard";
import HomeTripFeatureCard from "../components/HomeTripFeatureCard";
import { useHomeViewModel } from "../viewmodels/useHomeViewModel";

type HomeScreenProps = {
  apiUrl: string;
  onOpenTrip?: (publicId: string) => void;
  onOpenAlerts?: () => void;
  unreadCount?: number;
};

export function HomeScreen({
  apiUrl,
  onOpenAlerts,
  onOpenTrip,
  unreadCount = 0,
}: HomeScreenProps) {
  const {
    activeStatusFilter,
    discoverTrips,
    error,
    greeting,
    isLoading,
    myTrips,
    profileStats,
    refresh,
    requestJoinTrip,
    setActiveStatusFilter,
    statusFilters,
    toggleTripLike,
    user,
  } = useHomeViewModel();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={discoverTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={refresh}
        renderItem={({ item }) => (
          <HomeTripFeatureCard
            trip={item}
            onJoinTrip={requestJoinTrip}
            onOpenTrip={(trip) => trip.publicId && onOpenTrip?.(trip.publicId)}
            onToggleLike={toggleTripLike}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <View>
                  <Text style={styles.greeting}>{greeting}</Text>
                  <Text style={styles.name}>Hey, {user?.firstName ?? "traveler"}!</Text>
                </View>
                <View style={styles.iconRow}>
                  <Pressable style={styles.headerIconButton}>
                    <Search color="#17172B" size={23} strokeWidth={2.2} />
                  </Pressable>
                  <Pressable
                    style={styles.headerIconButton}
                    onPress={onOpenAlerts}
                  >
                    <Bell color="#17172B" size={23} strokeWidth={2.2} />
                    {unreadCount > 0 && (
                      <View style={styles.alertBadge}>
                        <Text style={styles.alertBadgeText}>
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>

              <View style={styles.statsRow}>
                {profileStats.map((stat) => (
                  <View
                    key={stat.label}
                    style={[
                      styles.statCard,
                      stat.tone === "orange" && styles.statOrange,
                      stat.tone === "mint" && styles.statMint,
                      stat.tone === "blue" && styles.statBlue,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statValue,
                        stat.tone === "orange" && styles.statValueOrange,
                        stat.tone === "mint" && styles.statValueMint,
                        stat.tone === "blue" && styles.statValueBlue,
                      ]}
                    >
                      {stat.value}
                    </Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>My Trips</Text>
                <Pressable>
                  <Text style={styles.seeAllText}>See all</Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.myTripsRow}
              >
                {myTrips.map((trip) => (
                  <ExploreTripCard
                    key={trip.id}
                    trip={trip}
                    compact
                    onJoinTrip={requestJoinTrip}
                    onOpenTrip={(trip) => trip.publicId && onOpenTrip?.(trip.publicId)}
                    onToggleLike={toggleTripLike}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discover Trips</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {statusFilters.map((filter) => {
                  const isActive = filter === activeStatusFilter;
                  return (
                    <Pressable
                      key={filter}
                      onPress={() => setActiveStatusFilter(filter)}
                      style={[
                        styles.filterChip,
                        isActive && styles.filterChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          isActive && styles.filterChipTextActive,
                        ]}
                      >
                        {filter}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text style={styles.apiText}>Connected to {apiUrl}</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {error ?? "No trips available yet."}
              </Text>
            </View>
          ) : null
        }
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBF4EC",
  },
  list: {
    paddingBottom: 120,
    paddingHorizontal: 18,
  },
  header: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: -18,
    paddingBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 64,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greeting: {
    color: "#98A2B3",
    fontSize: 16,
    fontWeight: "700",
  },
  name: {
    color: "#17172B",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 6,
  },
  iconRow: {
    flexDirection: "row",
    gap: 14,
  },
  headerIconButton: {
    alignItems: "center",
    backgroundColor: "#F8F3F0",
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    position: "relative",
    width: 52,
  },
  alertBadge: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 9,
    height: 18,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 6,
    width: 18,
  },
  alertBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 28,
  },
  statCard: {
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    minHeight: 82,
    justifyContent: "center",
  },
  statOrange: {
    backgroundColor: "#FFF0EA",
  },
  statMint: {
    backgroundColor: "#E7FBF2",
  },
  statBlue: {
    backgroundColor: "#EAF8FD",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  statValueOrange: {
    color: "#FF6535",
  },
  statValueMint: {
    color: "#12CFA0",
  },
  statValueBlue: {
    color: "#45C7DA",
  },
  statLabel: {
    color: "#667085",
    fontSize: 14,
    marginTop: 6,
  },
  section: {
    marginTop: 34,
  },
  sectionTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#17172B",
    fontSize: 22,
    fontWeight: "900",
  },
  seeAllText: {
    color: "#FF6535",
    fontSize: 15,
    fontWeight: "900",
  },
  myTripsRow: {
    gap: 16,
    marginTop: 18,
    paddingRight: 18,
  },
  filterRow: {
    gap: 12,
    marginTop: 18,
    paddingRight: 18,
  },
  filterChip: {
    backgroundColor: "#EEEAE6",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  filterChipActive: {
    backgroundColor: "#FF6535",
  },
  filterChipText: {
    color: "#667085",
    fontSize: 15,
    fontWeight: "900",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  apiText: {
    color: "#A0A8B8",
    fontSize: 12,
    marginTop: 12,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginTop: 18,
    padding: 24,
  },
  emptyText: {
    color: "#667085",
    fontSize: 15,
    textAlign: "center",
  },
});
