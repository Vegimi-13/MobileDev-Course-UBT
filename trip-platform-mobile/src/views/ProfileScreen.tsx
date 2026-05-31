import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useProfileViewModel } from "../viewmodels/useProfileViewModel";

type ProfileScreenProps = {
  onLogout: () => void;
};

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const { user, isLoading, error, refresh } = useProfileViewModel();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: "https://i.pravatar.cc/120" }}
                style={styles.avatar}
              />
            </View>
            <Pressable style={styles.editButton} onPress={() => {}}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>

          <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : "—"}</Text>
          <Text style={styles.handle}>@{user?.username ?? "username"}</Text>
          <Text style={styles.bio}>Explorer. Coffee addict. Always planning the next trip ✈️</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>891</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>234</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Pressable style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Sign out</Text>
          </Pressable>
          {error ? <Text style={{ color: "#c0392b", marginTop: 8 }}>{error}</Text> : null}
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff7ef" },
  header: {
    backgroundColor: "#ff7a45",
    paddingBottom: 18,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarWrap: {
    backgroundColor: "#fff",
    borderRadius: 48,
    padding: 4,
  },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editButtonText: { color: "#fff", fontWeight: "700" },
  name: { color: "#fff", fontSize: 20, fontWeight: "900", marginTop: 12 },
  handle: { color: "#fff8f4", marginTop: 6 },
  bio: { color: "#fff8f4", marginTop: 8, maxWidth: 320 },
  statsRow: { flexDirection: "row", marginTop: 12 },
  statBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 88,
    alignItems: "center",
  },
  statNumber: { fontSize: 18, fontWeight: "800", color: "#2c201b" },
  statLabel: { color: "#8b7163", fontSize: 12 },
  logoutButton: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: { color: "#ff4b2b", fontWeight: "800" },
});
