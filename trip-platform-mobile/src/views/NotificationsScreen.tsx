import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Bell, Check, LogOut } from "lucide-react-native";
import NotificationItem from "../components/NotificationItem";
import { useNotificationsViewModel } from "../viewmodels/useNotificationsViewModel";

type NotificationsScreenProps = {
  onLogout: () => void;
};

export function NotificationsScreen({ onLogout }: NotificationsScreenProps) {
  const {
    earlierNotifications,
    acceptInvite,
    declineInvite,
    error,
    isLoading,
    markAllRead,
    newNotifications,
    refresh,
    summaryText,
    unreadCount,
  } = useNotificationsViewModel();

  const data = [
    ...newNotifications.map((item) => ({ ...item, section: "new" as const })),
    ...earlierNotifications.map((item) => ({
      ...item,
      section: "earlier" as const,
    })),
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshing={isLoading}
        onRefresh={refresh}
        renderItem={({ item, index }) => {
          const showNewHeader = item.section === "new" && index === 0;
          const firstEarlierIndex = data.findIndex(
            (notification) => notification.section === "earlier",
          );
          const showEarlierHeader =
            item.section === "earlier" && index === firstEarlierIndex;

          return (
            <>
              {showNewHeader && <Text style={styles.sectionLabel}>NEW</Text>}
              {showEarlierHeader && (
                <Text style={styles.sectionLabel}>EARLIER</Text>
              )}
              <NotificationItem
                notification={item}
                onAccept={acceptInvite}
                onDecline={declineInvite}
              />
            </>
          );
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Notifications</Text>
              <Pressable style={styles.markReadButton} onPress={markAllRead}>
                <Check color="#00C989" size={16} strokeWidth={2.4} />
                <Text style={styles.markReadText}>Mark all read</Text>
              </Pressable>
            </View>

            <View style={styles.summaryPill}>
              <Bell color="#FF6535" size={16} strokeWidth={2.1} />
              <Text style={styles.summaryText}>{summaryText}</Text>
            </View>

            <Pressable style={styles.logoutButton} onPress={onLogout}>
              <LogOut color="#FF6535" size={17} strokeWidth={2.2} />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {error ?? "No notifications yet."}
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
  title: {
    color: "#17172B",
    fontSize: 29,
    fontWeight: "900",
  },
  markReadButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  markReadText: {
    color: "#00C989",
    fontSize: 15,
    fontWeight: "900",
  },
  summaryPill: {
    alignItems: "center",
    backgroundColor: "#FFF0EA",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    minHeight: 48,
    paddingHorizontal: 18,
  },
  summaryText: {
    color: "#FF6535",
    fontSize: 16,
    fontWeight: "900",
  },
  logoutButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "#FFD8C9",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  logoutText: {
    color: "#FF6535",
    fontSize: 13,
    fontWeight: "900",
  },
  sectionLabel: {
    color: "#9AA2B2",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 26,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginTop: 20,
    padding: 24,
  },
  emptyText: {
    color: "#667085",
    fontSize: 15,
    textAlign: "center",
  },
});
