import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Bookmark,
  ChevronRight,
  Globe2,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Users,
} from "lucide-react-native";
import type { Trip } from "../models/trip";

type HomeTripFeatureCardProps = {
  trip: Trip;
  onFollowHost?: (trip: Trip) => void;
  onJoinTrip?: (trip: Trip) => void;
};

export default function HomeTripFeatureCard({
  trip,
  onFollowHost,
  onJoinTrip,
}: HomeTripFeatureCardProps) {
  return (
    <View style={styles.card}>
      {trip.image ? (
        <Image source={{ uri: trip.image }} style={styles.image} />
      ) : (
        <View style={styles.coverFallback}>
          <Text style={styles.coverFallbackText}>{trip.category ?? "Trip"}</Text>
        </View>
      )}
      <View style={styles.topBadges}>
        <View style={styles.publicBadge}>
          <Globe2 color="#FFFFFF" size={13} strokeWidth={2} />
          <Text style={styles.publicBadgeText}>{trip.visibility ?? "Public"}</Text>
        </View>
        <View style={styles.openBadge}>
          <Text style={styles.openBadgeText}>{trip.joinPolicy ?? "Open"}</Text>
        </View>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>{trip.status ?? "Upcoming"}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.hostAvatar}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=160&q=80",
            }}
            style={styles.hostImage}
          />
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{trip.category ?? "Adventure"}</Text>
        </View>
        <Text style={styles.hostLine}>
          <Text style={styles.hostStrong}>{trip.host}</Text> is hosting
        </Text>
        <Text style={styles.title}>{trip.title}</Text>
        <View style={styles.metaLine}>
          <MapPin color="#98A2B3" size={14} strokeWidth={2} />
          <Text style={styles.metaText}>{trip.location}</Text>
          <Text style={styles.metaDot}>.</Text>
          <Text style={styles.metaText}>{trip.date}</Text>
        </View>
        <Text numberOfLines={3} style={styles.summary}>
          {trip.summary}
        </Text>

        <View style={styles.tagsRow}>
          {(trip.tags ?? []).slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.joinRow}>
          <View style={styles.avatarStack}>
            {[0, 1, 2, 3].map((item) => (
              <View key={item} style={[styles.stackAvatar, { marginLeft: item ? -8 : 0 }]} />
            ))}
          </View>
          <Text style={styles.joinedText}>{trip.joined}</Text>
          <View style={styles.spotsWrap}>
            <Users color="#00C989" size={14} strokeWidth={2.2} />
            <Text style={styles.spotsText}>{trip.spotsLeft} spots left</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.actionRow}>
            <Heart color="#98A2B3" size={24} strokeWidth={2} />
            <Text style={styles.actionText}>{trip.likes ?? 0}</Text>
            <MessageCircle color="#98A2B3" size={23} strokeWidth={2} />
            <Text style={styles.actionText}>2</Text>
            <Share2 color="#98A2B3" size={23} strokeWidth={2} />
          </View>
          <View style={styles.footerRight}>
            <Bookmark color="#FFB000" fill="#FFB000" size={24} strokeWidth={2} />
            {trip.hostId && (
              <Pressable
                style={styles.followButton}
                onPress={() => onFollowHost?.(trip)}
              >
                <Text style={styles.followButtonText}>
                  {trip.isFollowingHost ? "Following" : "Follow"}
                </Text>
              </Pressable>
            )}
            <Pressable
              style={styles.viewButton}
              onPress={() => onJoinTrip?.(trip)}
              disabled={!trip.publicId}
            >
              <Text style={styles.viewButtonText}>Join</Text>
              <ChevronRight color="#FFFFFF" size={16} strokeWidth={2.4} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EDE4DB",
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#2C2117",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  image: {
    height: 286,
    width: "100%",
  },
  coverFallback: {
    alignItems: "center",
    backgroundColor: "#FFEEE5",
    height: 286,
    justifyContent: "center",
    width: "100%",
  },
  coverFallbackText: {
    color: "#FF6535",
    fontSize: 28,
    fontWeight: "900",
  },
  topBadges: {
    flexDirection: "row",
    gap: 8,
    left: 16,
    position: "absolute",
    top: 16,
  },
  publicBadge: {
    alignItems: "center",
    backgroundColor: "#12CFA0",
    borderRadius: 999,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  publicBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  openBadge: {
    backgroundColor: "#FF6535",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  openBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  statusBadge: {
    backgroundColor: "#FFF6EE",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    position: "absolute",
    right: 16,
    top: 16,
  },
  statusBadgeText: {
    color: "#F26A2E",
    fontSize: 13,
    fontWeight: "900",
  },
  content: {
    padding: 22,
  },
  hostAvatar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 23,
    height: 46,
    justifyContent: "center",
    marginTop: -46,
    padding: 3,
    width: 46,
  },
  hostImage: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  categoryBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#FFF1E8",
    borderRadius: 999,
    marginTop: -26,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryBadgeText: {
    color: "#F26A2E",
    fontSize: 13,
    fontWeight: "900",
  },
  hostLine: {
    color: "#98A2B3",
    fontSize: 15,
    marginTop: 20,
  },
  hostStrong: {
    color: "#17172B",
    fontWeight: "900",
  },
  title: {
    color: "#17172B",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 12,
  },
  metaLine: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 12,
  },
  metaText: {
    color: "#667085",
    fontSize: 14,
  },
  metaDot: {
    color: "#C3C8D2",
  },
  summary: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 22,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  tag: {
    backgroundColor: "#FFF0EA",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: "#FF6535",
    fontSize: 12,
    fontWeight: "800",
  },
  joinRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  avatarStack: {
    flexDirection: "row",
  },
  stackAvatar: {
    backgroundColor: "#BFD7ED",
    borderColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    width: 24,
  },
  joinedText: {
    color: "#667085",
    fontSize: 14,
    marginLeft: 10,
  },
  spotsWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginLeft: "auto",
  },
  spotsText: {
    color: "#00C989",
    fontSize: 14,
    fontWeight: "900",
  },
  footer: {
    alignItems: "center",
    borderTopColor: "#F0E7DF",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    paddingTop: 20,
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  actionText: {
    color: "#98A2B3",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 6,
  },
  footerRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
  },
  viewButton: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 18,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  followButton: {
    backgroundColor: "#FFF0EA",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  followButtonText: {
    color: "#FF6535",
    fontSize: 14,
    fontWeight: "900",
  },
});
