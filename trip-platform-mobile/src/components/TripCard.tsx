import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Trip } from "../models/trip";

type TripCardProps = {
  trip: Trip;
};

export default function TripCard({ trip }: TripCardProps) {
  const { image, host, title, location, date, tags = [], likes = 0, joined, spotsLeft } = trip;
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.95}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.host}>{host} is hosting</Text>
        <Text style={styles.title}>{title}</Text>
        {location ? (
          <Text style={styles.meta}>{location} · {date}</Text>
        ) : null}

        <View style={styles.tagsRow}>
          {tags.slice(0, 3).map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>#{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.likes}>❤️ {likes}</Text>
          <Text style={styles.joined}>{joined}</Text>
          {typeof spotsLeft === "number" ? (
            <Text style={styles.spots}>{spotsLeft} spots left</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 18,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 190,
  },
  content: {
    padding: 14,
  },
  host: {
    color: "#6b5950",
    fontSize: 13,
    marginBottom: 6,
  },
  title: {
    color: "#2c201b",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  meta: {
    color: "#8b7163",
    fontSize: 12,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#fff0ea",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: "#b85f2b",
    fontSize: 12,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likes: {
    color: "#b85f2b",
    fontWeight: "700",
  },
  joined: {
    color: "#8b7163",
    fontSize: 12,
  },
  spots: {
    color: "#2d9f6f",
    fontWeight: "700",
  },
});
