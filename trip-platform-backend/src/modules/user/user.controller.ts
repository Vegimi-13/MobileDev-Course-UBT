import { Request, Response } from "express";
import { updateProfileSchema } from "./user.validation";
import * as service from "./user.service";
import { UpdateProfileBody, UserDetailResponse } from "./user.types";

export const getProfile = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const user = await service.getUserById(userId);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const getProfileByUsername = async (
  req: Request<{ username: string }>,
  res: Response,
) => {
  try {
    const { username } = req.params;
    const user = await service.getUserByUsername(username);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const updateProfile = async (
  req: Request<{ userId: string }, {}, UpdateProfileBody>,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    // Verify user is updating their own profile
    if (req.user?.id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = updateProfileSchema.parse(req.body);
    const updated = await service.updateProfile(userId, data);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCurrentUserProfile = async (
  req: Request<{}, {}, UpdateProfileBody>,
  res: Response,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = updateProfileSchema.parse(req.body);
    const updated = await service.updateProfile(req.user.id, data);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await service.getCurrentUser(req.user.id);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const query = typeof req.query.q === "string" ? req.query.q : "";
    const users = await service.searchUsers(req.user.id, query);
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
