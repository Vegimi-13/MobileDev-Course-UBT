import { Request, Response } from "express";
import * as service from "./notification.service";
import { NotificationServiceError } from "./notification.service";
import { z } from "zod";

const pushTokenSchema = z.object({
  token: z.string().min(1),
});

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notifications = await service.getMyNotifications(req.user.id);
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (
  req: Request<{ notificationId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notification = await service.markAsRead(
      req.user.id,
      req.params.notificationId,
    );
    res.json(notification);
  } catch (err: any) {
    if (err instanceof NotificationServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await service.markAllAsRead(req.user.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const registerPushToken = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { token } = pushTokenSchema.parse(req.body);
    const result = await service.registerExpoPushToken(req.user.id, token);
    res.status(201).json(result);
  } catch (err: any) {
    if (err instanceof NotificationServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(400).json({ message: err.message });
  }
};

export const unregisterPushToken = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { token } = pushTokenSchema.parse(req.body);
    const result = await service.unregisterExpoPushToken(req.user.id, token);
    res.json(result);
  } catch (err: any) {
    if (err instanceof NotificationServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(400).json({ message: err.message });
  }
};
