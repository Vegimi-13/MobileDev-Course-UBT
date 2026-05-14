import crypto from "crypto";
import { CreateCloudinarySignatureInput } from "./media.validation";

export class MediaServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export const createCloudinarySignature = (
  input: CreateCloudinarySignatureInput,
  userId: string,
) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new MediaServiceError("Cloudinary is not configured", 500);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = input.folder ?? "trip-platform/uploads";

  // Add a stable public_id prefix to group assets per user.
  const publicId = `${userId}-${Date.now()}`;
  const signatureBase = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureBase)
    .digest("hex");

  return {
    cloudName,
    apiKey,
    timestamp,
    folder,
    publicId,
    signature,
  };
};
