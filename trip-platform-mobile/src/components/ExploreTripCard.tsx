import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Globe2, Heart, Lock, MapPin, Users } from "lucide-react-native";
import type { Trip } from "../models/trip";

type ExploreTripCardProps = {
  trip: Trip;
  compact?: boolean;
  onFollowHost?: (trip: Trip) => void;
  onJoinTrip?: (trip: Trip) => void;
};

const CATEGORY_ICON = {
  Beach: "Palm",
  Mountains: "Peak",
  City: "City",
  Adventure: "Wild",
} as const;

export default function ExploreTripCard({
  trip,
  compact = false,
  onFollowHost,
  onJoinTrip,
}: ExploreTripCardProps) {
  const VisibilityIcon = trip.visibility === "Private" ? Lock : Globe2;
  const joined = trip.membersJoined ?? Number(trip.joined?.split("/")[0]) ?? 0;
  const maxMembers = trip.maxMembers ?? Number(trip.joined?.split("/")[1]?.split(" ")[0]) ?? 0;

  return (
    <Pressable style={[styles.card, compact && styles.compactCard]}>
      {trip.image ? (
        <Image source={{ uri: trip.image }} style={styles.image} />
      ) : (
        <View style={styles.coverFallback}>
          <Text style={styles.coverFallbackText}>{trip.category ?? "Trip"}</Text>
        </View>
      )}
      <View style={styles.overlay} />

      <View style={styles.topBadges}>
        <View
          style={[
            styles.iconBadge,
            trip.visibility === "Private" && styles.privateBadge,
          ]}
        >
          <VisibilityIcon color="#FFFFFF" size={12} strokeWidth={2.1} />
        </View>
        {trip.joinPolicy === "Open" && (
          <View style={styles.openBadge}>
            <Text style={styles.openBadgeText}>Open</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {CATEGORY_ICON[trip.category ?? "Adventure"]} {trip.title}
        </Text>
        <View style={styles.locationRow}>
          <MapPin color="#FFFFFF" size={12} strokeWidth={2} />
          <Text numberOfLines={1} style={styles.location}>
            {trip.location ?? trip.country ?? "Destination"}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Heart color="#FFFFFF" fill="#FFFFFF" size={12} strokeWidth={1.5} />
            <Text style={styles.metaText}>{trip.likes ?? 0}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users color="#FFFFFF" size={12} strokeWidth={2} />
            <Text style={styles.metaText}>{joined}/{maxMembers}</Text>
          </View>
        </View>
        {!compact && (
          <View style={styles.actionsRow}>
            {trip.hostId && (
              <Pressable
                onPress={() => onFollowHost?.(trip)}
                style={styles.smallAction}
              >
                <Text style={styles.smallActionText}>
                  {trip.isFollowingHost ? "Following" : "Follow"}
                </Text>
              </Pressable>
            )}
            {trip.publicId && (
              <Pressable
                onPress={() => onJoinTrip?.(trip)}
                style={styles.primaryAction}
              >
                <Text style={styles.primaryActionText}>Join</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    height: 238,
    overflow: "hidden",
    width: "48%",
  },
  compactCard: {
    height: 240,
    width: 188,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  coverFallback: {
    alignItems: "center",
    backgroundColor: "#FFEEE5",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  coverFallbackText: {
    color: "#FF6535",
    fontSize: 18,
    fontWeight: "900",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 10, 20, 0.2)",
  },
  topBadges: {
    flexDirection: "row",
    gap: 7,
    left: 12,
    position: "absolute",
    top: 12,
  },
  iconBadge: {
    alignItems: "center",
    backgroundColor: "#12CFA0",
    borderRadius: 999,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  privateBadge: {
    backgroundColor: "#30275C",
  },
  openBadge: {
    backgroundColor: "#FF6535",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  openBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  content: {
    bottom: 12,
    left: 12,
    position: "absolute",
    right: 12,
  },
  title: {
    color: "#FFFFFF",
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
    color: "#F2F4F7",
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  metaItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  metaText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  smallAction: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallActionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  primaryAction: {
    backgroundColor: "#FF6535",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
});
