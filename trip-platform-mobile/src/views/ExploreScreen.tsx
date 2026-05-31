import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Globe2, Lock, Search } from "lucide-react-native";
import ExploreTripCard from "../components/ExploreTripCard";
import { useExploreViewModel } from "../viewmodels/useExploreViewModel";

type ExploreScreenProps = {
  onOpenTrip?: (publicId: string) => void;
};

export function ExploreScreen({ onOpenTrip }: ExploreScreenProps) {
  const {
    accessFilter,
    accessFilters,
    categoryFilter,
    categoryFilters,
    error,
    filteredTrips,
    isLoading,
    query,
    refresh,
    requestJoinTrip,
    setAccessFilter,
    setCategoryFilter,
    setQuery,
    toggleFollowHost,
    toggleTripLike,
  } = useExploreViewModel();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.content}
        refreshing={isLoading}
        onRefresh={refresh}
        renderItem={({ item }) => (
          <ExploreTripCard
            trip={item}
            onFollowHost={toggleFollowHost}
            onJoinTrip={requestJoinTrip}
            onOpenTrip={(trip) => trip.publicId && onOpenTrip?.(trip.publicId)}
            onToggleLike={toggleTripLike}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Explore</Text>
              <View style={styles.searchBox}>
                <Search color="#98A2B3" size={22} strokeWidth={2} />
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setQuery}
                  placeholder="Search trips, destinations..."
                  placeholderTextColor="#8F96A6"
                  style={styles.searchInput}
                  value={query}
                />
              </View>

              <View style={styles.accessRow}>
                {accessFilters.map((filter) => {
                  const isActive = accessFilter === filter;
                  return (
                    <Pressable
                      key={filter}
                      onPress={() => setAccessFilter(filter)}
                      style={[
                        styles.accessChip,
                        isActive && styles.accessChipActive,
                      ]}
                    >
                      {filter === "Open" && (
                        <Lock
                          color={isActive ? "#FFFFFF" : "#667085"}
                          size={14}
                          strokeWidth={2}
                        />
                      )}
                      {filter === "Public" && (
                        <Globe2
                          color={isActive ? "#FFFFFF" : "#667085"}
                          size={15}
                          strokeWidth={2}
                        />
                      )}
                      <Text
                        style={[
                          styles.accessChipText,
                          isActive && styles.accessChipTextActive,
                        ]}
                      >
                        {filter}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.filterBand}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
              >
                {categoryFilters.map((filter) => {
                  const isActive = categoryFilter === filter;
                  return (
                    <Pressable
                      key={filter}
                      onPress={() => setCategoryFilter(filter)}
                      style={[
                        styles.categoryChip,
                        isActive && styles.categoryChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isActive && styles.categoryChipTextActive,
                        ]}
                      >
                        {filter}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text style={styles.resultCount}>
                {filteredTrips.length} trips found
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {error ?? "No trips match this search."}
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
  content: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 36,
    paddingHorizontal: 18,
    paddingTop: 64,
  },
  title: {
    color: "#17172B",
    fontSize: 29,
    fontWeight: "900",
    marginBottom: 26,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "#F5F0EE",
    borderRadius: 22,
    flexDirection: "row",
    minHeight: 62,
    paddingHorizontal: 20,
  },
  searchInput: {
    color: "#17172B",
    flex: 1,
    fontSize: 17,
    marginLeft: 14,
  },
  accessRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  accessChip: {
    alignItems: "center",
    backgroundColor: "#F0ECE9",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  accessChipActive: {
    backgroundColor: "#17172B",
  },
  accessChipText: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "900",
  },
  accessChipTextActive: {
    color: "#FFFFFF",
  },
  filterBand: {
    backgroundColor: "#FBF4EC",
    borderTopColor: "#F0E7DF",
    borderTopWidth: 1,
    paddingBottom: 18,
    paddingTop: 24,
  },
  categoryRow: {
    gap: 12,
    paddingHorizontal: 18,
  },
  categoryChip: {
    backgroundColor: "#EEEAE6",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  categoryChipActive: {
    backgroundColor: "#FF6535",
  },
  categoryChipText: {
    color: "#667085",
    fontSize: 15,
    fontWeight: "900",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  resultCount: {
    color: "#98A2B3",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 28,
    paddingHorizontal: 18,
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginHorizontal: 18,
    marginTop: 20,
    padding: 24,
  },
  emptyText: {
    color: "#667085",
    fontSize: 15,
    textAlign: "center",
  },
});
