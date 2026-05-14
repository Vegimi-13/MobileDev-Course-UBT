import { Request, Response } from "express";
import * as service from "./like.service";
import { LikeServiceError } from "./like.service";

export const likeTrip = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await service.likeTrip(req.user.id, req.params.publicId);
    res.status(201).json(result);
  } catch (err: any) {
    if (err instanceof LikeServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const unlikeTrip = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await service.unlikeTrip(req.user.id, req.params.publicId);
    res.json(result);
  } catch (err: any) {
    if (err instanceof LikeServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const likePhoto = async (
  req: Request<{ photoId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await service.likePhoto(req.user.id, req.params.photoId);
    res.status(201).json(result);
  } catch (err: any) {
    if (err instanceof LikeServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};

export const unlikePhoto = async (
  req: Request<{ photoId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await service.unlikePhoto(req.user.id, req.params.photoId);
    res.json(result);
  } catch (err: any) {
    if (err instanceof LikeServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};
