import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  ChevronRight,
  Globe2,
  Heart,
  Lock,
  MapPin,
} from "lucide-react-native";
import type { Trip } from "../models/trip";

type ProfileTripRowProps = {
  trip: Trip;
  onOpenTrip?: (trip: Trip) => void;
};

const STATUS_STYLES = {
  Upcoming: {
    backgroundColor: "#FFF1E8",
    color: "#F26A2E",
  },
  Ongoing: {
    backgroundColor: "#EAF8EC",
    color: "#3F8F48",
  },
  Completed: {
    backgroundColor: "#F1EAFF",
    color: "#6A35C8",
  },
} as const;

const VISIBILITY_STYLES = {
  Public: {
    backgroundColor: "#E3FAF1",
    color: "#12B981",
    Icon: Globe2,
  },
  Private: {
    backgroundColor: "#F1EEE9",
    color: "#7D746D",
    Icon: Lock,
  },
} as const;

export default function ProfileTripRow({ trip, onOpenTrip }: ProfileTripRowProps) {
  const status = trip.status ?? "Upcoming";
  const visibility = trip.visibility ?? "Public";
  const visibilityConfig = VISIBILITY_STYLES[visibility];
  const statusConfig = STATUS_STYLES[status];
  const VisibilityIcon = visibilityConfig.Icon;

  return (
    <Pressable style={styles.card} onPress={() => onOpenTrip?.(trip)}>
      {trip.image ? (
        <Image source={{ uri: trip.image }} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.imageFallbackText}>{trip.category ?? "Trip"}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.title}>
              {trip.title}
            </Text>
            <View style={styles.locationRow}>
              <MapPin color="#A49BAE" size={13} strokeWidth={2} />
              <Text numberOfLines={1} style={styles.location}>
                {trip.location ?? trip.country ?? "Destination"}
              </Text>
            </View>
          </View>

          <View style={styles.likesWrap}>
            <Heart color="#FF6A3D" fill="#FF6A3D" size={14} strokeWidth={1.8} />
            <Text style={styles.likes}>{trip.likes ?? 0}</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.badgesRow}>
            <View
              style={[styles.badge, { backgroundColor: statusConfig.backgroundColor }]}
            >
              <Text style={[styles.badgeText, { color: statusConfig.color }]}>
                {status}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                { backgroundColor: visibilityConfig.backgroundColor },
              ]}
            >
              <VisibilityIcon
                color={visibilityConfig.color}
                size={12}
                strokeWidth={2}
              />
              <Text style={[styles.badgeText, { color: visibilityConfig.color }]}>
                {visibility}
              </Text>
            </View>
          </View>

          <ChevronRight color="#D3CED8" size={18} strokeWidth={2.2} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#ECE3DA",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 16,
    padding: 14,
  },
  image: {
    borderRadius: 18,
    height: 84,
    width: 84,
  },
  imageFallback: {
    alignItems: "center",
    backgroundColor: "#FFF0EA",
    borderRadius: 18,
    height: 84,
    justifyContent: "center",
    width: 84,
  },
  imageFallbackText: {
    color: "#FF6535",
    fontSize: 12,
    fontWeight: "900",
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleWrap: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: "#26233B",
    fontSize: 16,
    fontWeight: "900",
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  location: {
    color: "#8F97A8",
    fontSize: 13,
    fontWeight: "700",
  },
  likesWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 2,
  },
  likes: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "800",
  },
  bottomRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
});
