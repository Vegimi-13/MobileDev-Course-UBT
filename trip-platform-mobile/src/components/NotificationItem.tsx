import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Heart,
  MessageCircle,
  Star,
  UserPlus,
  Users,
} from "lucide-react-native";
import type { AppNotification, NotificationKind } from "../models/notification";

type NotificationItemProps = {
  notification: AppNotification;
};

const TYPE_CONFIG: Record<
  NotificationKind,
  {
    Icon: typeof UserPlus;
    color: string;
    backgroundColor: string;
  }
> = {
  FOLLOW: {
    Icon: UserPlus,
    color: "#10B981",
    backgroundColor: "#E7FBF2",
  },
  TRIP_INVITE: {
    Icon: UserPlus,
    color: "#FF6535",
    backgroundColor: "#FFF0EA",
  },
  TRIP_JOIN: {
    Icon: Users,
    color: "#10B981",
    backgroundColor: "#E7FBF2",
  },
  LIKE: {
    Icon: Heart,
    color: "#FF7A59",
    backgroundColor: "#FFF0EA",
  },
  COMMENT: {
    Icon: MessageCircle,
    color: "#34B7D5",
    backgroundColor: "#EAF9FD",
  },
  REVIEW: {
    Icon: Star,
    color: "#F4AA13",
    backgroundColor: "#FFF6D9",
  },
};

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.Icon;

  return (
    <View style={[styles.card, !notification.isRead && styles.unreadCard]}>
      {!notification.isRead && <View style={styles.unreadRail} />}
      <View
        style={[
          styles.iconBubble,
          { backgroundColor: config.backgroundColor },
        ]}
      >
        <Icon color={config.color} size={18} strokeWidth={2.1} />
      </View>
      <Image source={{ uri: notification.avatarUrl }} style={styles.avatar} />

      <View style={styles.body}>
        <Text style={styles.message}>
          <Text style={styles.actor}>{notification.actorName}</Text>{" "}
          {notification.message}
          {notification.tripTitle ? (
            <Text style={styles.trip}> {notification.tripTitle}</Text>
          ) : null}
        </Text>
        <Text style={styles.time}>{notification.createdAtLabel}</Text>
      </View>

      {notification.actionable && (
        <View style={styles.actions}>
          <Pressable style={styles.acceptButton}>
            <Text style={styles.acceptText}>Accept</Text>
          </Pressable>
          <Pressable style={styles.declineButton}>
            <Text style={styles.declineText}>Decline</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEE5DC",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 96,
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  unreadCard: {
    borderColor: "#F2DED1",
  },
  unreadRail: {
    backgroundColor: "#FF6535",
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
    width: 4,
  },
  iconBubble: {
    alignItems: "center",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  avatar: {
    borderColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 2,
    height: 40,
    marginLeft: -12,
    width: 40,
  },
  body: {
    flex: 1,
    marginLeft: 12,
  },
  message: {
    color: "#687083",
    fontSize: 16,
    lineHeight: 23,
  },
  actor: {
    color: "#202037",
    fontWeight: "900",
  },
  trip: {
    color: "#FF6535",
    fontWeight: "900",
  },
  time: {
    color: "#A0A8B8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
  },
  actions: {
    gap: 8,
    marginLeft: 10,
  },
  acceptButton: {
    alignItems: "center",
    backgroundColor: "#FF6535",
    borderRadius: 12,
    minWidth: 86,
    paddingVertical: 10,
  },
  acceptText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  declineButton: {
    alignItems: "center",
    backgroundColor: "#EEECE9",
    borderRadius: 12,
    minWidth: 86,
    paddingVertical: 10,
  },
  declineText: {
    color: "#A0A8B8",
    fontSize: 13,
    fontWeight: "900",
  },
});
