import { NotificationType } from "@prisma/client";
import { prisma } from "../../prisma/client";

export const createNotification = (data: {
  type: NotificationType;
  message: string;
  receiverId: string;
  senderId?: string;
  tripId?: string;
}) => {
  return prisma.notification.create({
    data: {
      type: data.type,
      message: data.message,
      receiver: {
        connect: { id: data.receiverId },
      },
      ...(data.senderId
        ? {
            sender: {
              connect: { id: data.senderId },
            },
          }
        : {}),
      ...(data.tripId
        ? {
            trip: {
              connect: { id: data.tripId },
            },
          }
        : {}),
    },
  });
};

export const findNotificationsForUser = (userId: string) => {
  return prisma.notification.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
      trip: {
        select: {
          id: true,
          publicId: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findNotificationById = (id: string) => {
  return prisma.notification.findUnique({
    where: { id },
  });
};

export const markNotificationRead = (id: string) => {
  return prisma.notification.update({
    where: { id },
    data: {
      isRead: true,
    },
  });
};

export const markAllNotificationsRead = (receiverId: string) => {
  return prisma.notification.updateMany({
    where: {
      receiverId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

export const upsertExpoPushToken = (userId: string, token: string) => {
  return prisma.expoPushToken.upsert({
    where: { token },
    create: {
      token,
      user: {
        connect: { id: userId },
      },
    },
    update: {
      userId,
    },
  });
};

export const deleteExpoPushToken = (userId: string, token: string) => {
  return prisma.expoPushToken.deleteMany({
    where: {
      userId,
      token,
    },
  });
};

export const findExpoPushTokensByUserId = (userId: string) => {
  return prisma.expoPushToken.findMany({
    where: {
      userId,
    },
    select: {
      token: true,
    },
  });
};
