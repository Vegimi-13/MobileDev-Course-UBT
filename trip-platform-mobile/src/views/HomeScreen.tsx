import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Text,
} from "react-native";
import TripCard from "../components/TripCard";
import { useHomeViewModel } from "../viewmodels/useHomeViewModel";

type HomeScreenProps = {
  apiUrl: string;
  onLogout: () => void;
};

export function HomeScreen({ apiUrl, onLogout }: HomeScreenProps) {
  const { trips, isLoading, refresh, error } = useHomeViewModel();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning 🌞</Text>
        <Text style={styles.name}>Hey, Sofia! 👋</Text>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={refresh}
        renderItem={({ item }) => <TripCard trip={item} />}
        ListEmptyComponent={() =>
          !isLoading ? (
            <View style={{ padding: 20 }}>
              <Text style={{ textAlign: "center", color: "#8b7163" }}>
                {error ? error : "No trips available."}
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
    backgroundColor: "#fff7ef",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
  },
  greeting: {
    color: "#8b7163",
    fontSize: 13,
  },
  name: {
    color: "#2c201b",
    fontSize: 22,
    fontWeight: "900",
  },
  list: {
    paddingVertical: 10,
  },
});
