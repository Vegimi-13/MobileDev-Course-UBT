import * as likeRepo from "./like.repository";
import { notify } from "../notification/notification.service";

export class LikeServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const ensureTripLikeAccess = async (tripId: string, userId: string) => {
  const participant = await likeRepo.findAcceptedParticipant(tripId, userId);

  if (!participant) {
    throw new LikeServiceError("You do not have access to this trip", 403);
  }
};

const ensureCanAccessTrip = async (
  trip: { id: string; createdBy: string; visibility: "PUBLIC" | "PRIVATE" },
  userId: string,
) => {
  if (trip.visibility === "PUBLIC" || trip.createdBy === userId) {
    return;
  }

  await ensureTripLikeAccess(trip.id, userId);
};

export const likeTrip = async (userId: string, publicId: string) => {
  const trip = await likeRepo.findTripByPublicId(publicId);

  if (!trip) {
    throw new LikeServiceError("Trip not found", 404);
  }

  await ensureCanAccessTrip(trip, userId);

  const existingLike = await likeRepo.findTripLike(trip.id, userId);
  if (existingLike) {
    throw new LikeServiceError("Trip already liked", 409);
  }

  await likeRepo.createTripLike(trip.id, userId);
  await notify({
    type: "LIKE",
    receiverId: trip.createdBy,
    senderId: userId,
    tripId: trip.id,
    message: "liked your trip",
  });

  return { liked: true };
};

export const unlikeTrip = async (userId: string, publicId: string) => {
  const trip = await likeRepo.findTripByPublicId(publicId);

  if (!trip) {
    throw new LikeServiceError("Trip not found", 404);
  }

  const existingLike = await likeRepo.findTripLike(trip.id, userId);
  if (!existingLike) {
    throw new LikeServiceError("Trip like not found", 404);
  }

  await likeRepo.deleteLikeById(existingLike.id);

  return { liked: false };
};

export const likePhoto = async (userId: string, photoId: string) => {
  const photo = await likeRepo.findPhotoById(photoId);

  if (!photo) {
    throw new LikeServiceError("Photo not found", 404);
  }

  await ensureCanAccessTrip(photo.trip, userId);

  const existingLike = await likeRepo.findPhotoLike(photo.id, userId);
  if (existingLike) {
    throw new LikeServiceError("Photo already liked", 409);
  }

  await likeRepo.createPhotoLike(photo.id, userId);
  await notify({
    type: "LIKE",
    receiverId: photo.uploadedBy,
    senderId: userId,
    tripId: photo.trip.id,
    message: "liked your photo",
  });

  return { liked: true };
};

export const unlikePhoto = async (userId: string, photoId: string) => {
  const photo = await likeRepo.findPhotoById(photoId);

  if (!photo) {
    throw new LikeServiceError("Photo not found", 404);
  }

  const existingLike = await likeRepo.findPhotoLike(photo.id, userId);
  if (!existingLike) {
    throw new LikeServiceError("Photo like not found", 404);
  }

  await likeRepo.deleteLikeById(existingLike.id);

  return { liked: false };
};
