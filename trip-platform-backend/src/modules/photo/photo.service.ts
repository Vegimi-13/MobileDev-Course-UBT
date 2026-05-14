import * as photoRepo from "./photo.repository";
import { CreatePhotoInput } from "./photo.validation";

export class PhotoServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const ensureTripAccess = async (publicId: string, userId: string) => {
  const trip = await photoRepo.findTripByPublicId(publicId);

  if (!trip) {
    throw new PhotoServiceError("Trip not found", 404);
  }

  if (trip.createdBy === userId) {
    return trip;
  }

  const participant = await photoRepo.findAcceptedParticipant(trip.id, userId);

  if (!participant) {
    throw new PhotoServiceError("You do not have access to this trip", 403);
  }

  return trip;
};

export const createPhoto = async (
  userId: string,
  publicId: string,
  data: CreatePhotoInput,
) => {
  const trip = await ensureTripAccess(publicId, userId);

  return photoRepo.createPhoto(trip.id, userId, data);
};

export const getTripPhotos = async (userId: string, publicId: string) => {
  const trip = await ensureTripAccess(publicId, userId);

  return photoRepo.findPhotosByTripId(trip.id);
};

export const deletePhoto = async (userId: string, photoId: string) => {
  const photo = await photoRepo.findPhotoById(photoId);

  if (!photo) {
    throw new PhotoServiceError("Photo not found", 404);
  }

  const canDelete = photo.uploadedBy === userId || photo.trip.createdBy === userId;

  if (!canDelete) {
    throw new PhotoServiceError("You cannot delete this photo", 403);
  }

  return photoRepo.deletePhoto(photoId);
};
