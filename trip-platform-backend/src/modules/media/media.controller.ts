import { Request, Response } from "express";
import { createCloudinarySignatureSchema } from "./media.validation";
import * as service from "./media.service";
import { MediaServiceError } from "./media.service";

export const createCloudinarySignature = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = createCloudinarySignatureSchema.parse(req.body);
    const signature = service.createCloudinarySignature(payload, req.user.id);

    res.json(signature);
  } catch (err: any) {
    if (err instanceof MediaServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(400).json({ message: err.message });
  }
};
