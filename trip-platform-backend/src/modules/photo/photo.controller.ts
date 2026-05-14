import { Request, Response } from "express";
import * as service from "./photo.service";
import { createPhotoSchema } from "./photo.validation";
import { PhotoServiceError } from "./photo.service";

export const createPhoto = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = createPhotoSchema.parse(req.body);
    const photo = await service.createPhoto(req.user.id, req.params.publicId, data);

    res.status(201).json(photo);
  } catch (err: any) {
    if (err instanceof PhotoServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(400).json({ message: err.message });
  }
};

export const getTripPhotos = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const photos = await service.getTripPhotos(req.user.id, req.params.publicId);

    res.json(photos);
  } catch (err: any) {
    if (err instanceof PhotoServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const deletePhoto = async (
  req: Request<{ photoId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await service.deletePhoto(req.user.id, req.params.photoId);

    res.json(deleted);
  } catch (err: any) {
    if (err instanceof PhotoServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};
