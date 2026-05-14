import { NotificationType } from "@prisma/client";
import * as notificationRepo from "./notification.repository";
import {
  sendExpoPushNotifications,
  validateExpoPushToken,
} from "./push.service";

export class NotificationServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export const notify = async (data: {
  type: NotificationType;
  message: string;
  receiverId: string;
  senderId?: string;
  tripId?: string;
}) => {
  if (data.senderId && data.senderId === data.receiverId) {
    return null;
  }

  const created = await notificationRepo.createNotification(data);
  const tokens = await notificationRepo.findExpoPushTokensByUserId(data.receiverId);

  await sendExpoPushNotifications(
    tokens.map((entry) => ({
      to: entry.token,
      title: "Trip Platform",
      body: created.message,
      data: {
        notificationId: created.id,
        type: created.type,
      },
    })),
  );

  return created;
};

export const getMyNotifications = (userId: string) => {
  return notificationRepo.findNotificationsForUser(userId);
};

export const markAsRead = async (userId: string, notificationId: string) => {
  const notification = await notificationRepo.findNotificationById(notificationId);

  if (!notification) {
    throw new NotificationServiceError("Notification not found", 404);
  }

  if (notification.receiverId !== userId) {
    throw new NotificationServiceError("You cannot update this notification", 403);
  }

  return notificationRepo.markNotificationRead(notificationId);
};

export const markAllAsRead = async (userId: string) => {
  const result = await notificationRepo.markAllNotificationsRead(userId);
  return { updated: result.count };
};

export const registerExpoPushToken = async (userId: string, token: string) => {
  if (!validateExpoPushToken(token)) {
    throw new NotificationServiceError("Invalid Expo push token", 400);
  }

  await notificationRepo.upsertExpoPushToken(userId, token);
  return { registered: true };
};

export const unregisterExpoPushToken = async (userId: string, token: string) => {
  await notificationRepo.deleteExpoPushToken(userId, token);
  return { registered: false };
};
