import { Request, Response } from "express";
import * as service from "./follow.service";
import { FollowServiceError } from "./follow.service";

export const followUser = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await service.followUser(req.user.id, req.params.userId);
    res.status(201).json(result);
  } catch (err: any) {
    if (err instanceof FollowServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const unfollowUser = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await service.unfollowUser(req.user.id, req.params.userId);
    res.json(result);
  } catch (err: any) {
    if (err instanceof FollowServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getFollowers = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const followers = await service.getFollowers(req.params.userId);
    res.json(followers);
  } catch (err: any) {
    if (err instanceof FollowServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getFollowing = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  try {
    const following = await service.getFollowing(req.params.userId);
    res.json(following);
  } catch (err: any) {
    if (err instanceof FollowServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};
