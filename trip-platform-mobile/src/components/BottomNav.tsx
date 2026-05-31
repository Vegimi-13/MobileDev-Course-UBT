import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Home, Compass, PlusCircle, Bell, User } from "lucide-react-native";

type TabKey = "home" | "explore" | "add" | "alerts" | "profile";

type NavItem = {
  key: TabKey;
  icon: any;
  label: string;
  primary?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", icon: Home, label: "Home" },
  { key: "explore", icon: Compass, label: "Explore" },
  { key: "add", icon: PlusCircle, label: "Create", primary: true },
  { key: "alerts", icon: Bell, label: "Alerts" },
  { key: "profile", icon: User, label: "Profile" },
];

interface BottomNavProps {
  activeTab: TabKey;
  onSelect: (tab: TabKey) => void;
  unreadCount?: number;
}

export default function BottomNav({
  activeTab,
  onSelect,
  unreadCount = 0,
}: BottomNavProps) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.key;

        if (item.primary) {
          return (
            <Pressable
              key={item.key}
              onPress={() => onSelect(item.key)}
              style={styles.primaryWrapper}
            >
              <View style={styles.primaryButton}>
                <Icon size={26} color="#fff" strokeWidth={2.2} />
              </View>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            style={styles.item}
          >
            {item.key === "alerts" && unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}

            <Icon
              size={22}
              color={isActive ? "#FF6535" : "#9CA3AF"}
              strokeWidth={isActive ? 2.5 : 1.8}
            />

            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0EDE8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 15,
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    position: "relative",
  },

  label: {
    fontSize: 10,
    color: "#9CA3AF",
  },

  activeLabel: {
    color: "#FF6535",
    fontWeight: "600",
  },

  primaryWrapper: {
    marginTop: -35,
  },

  primaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6535",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 6,
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF6535",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
});