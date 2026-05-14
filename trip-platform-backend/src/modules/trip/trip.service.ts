import { Prisma } from "@prisma/client";
import * as tripRepo from "./trip.repository";
import { CreateTripInput, GetPublicTripsFilterInput } from "./trip.validation";
import { notify } from "../notification/notification.service";

export class TripServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export const createTrip = async (userId: string, data: CreateTripInput) => {
  const { categoryId, tags, ...tripData } = data;

  const createData: Prisma.TripCreateInput = {
    title: tripData.title,
    destination: tripData.destination,
    description: tripData.description ?? null,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    visibility: tripData.visibility,
    joinPolicy: tripData.joinPolicy,
    maxMembers: tripData.maxMembers ?? null,
    creator: {
      connect: {
        id: userId,
      },
    },
    participants: {
      create: {
        user: {
          connect: {
            id: userId,
          },
        },
        role: "OWNER",
        status: "ACCEPTED",
      },
    },
    ...(categoryId
      ? {
          category: {
            connect: {
              id: categoryId,
            },
          },
        }
      : {}),
    ...(tags?.length
      ? {
          tags: {
            create: tags.map((tagId) => ({
              tag: {
                connect: {
                  id: tagId,
                },
              },
            })),
          },
        }
      : {}),
  };

  return tripRepo.createTrip(createData);
};

export const getPublicTrips = (filters: GetPublicTripsFilterInput) => {
  return tripRepo.findPublicTrips(filters);
};

export const getTripByPublicId = (publicId: string) => {
  return tripRepo.findTripByPublicId(publicId);
};

export const getMyTrips = (userId: string) => {
  return tripRepo.findTripsByUser(userId);
};

export const joinTrip = async (userId: string, publicId: string) => {
  const trip = await tripRepo.findTripForJoin(publicId);

  if (!trip) {
    throw new TripServiceError("Trip not found", 404);
  }

  if (trip.createdBy === userId) {
    throw new TripServiceError("You already own this trip", 409);
  }

  const existingParticipant = await tripRepo.findTripParticipant(
    trip.id,
    userId,
  );

  if (existingParticipant) {
    throw new TripServiceError("You have already joined this trip", 409);
  }

  if (
    trip.maxMembers !== null &&
    trip._count.participants >= trip.maxMembers
  ) {
    throw new TripServiceError("Trip is full", 409);
  }

  const status = trip.joinPolicy === "OPEN" ? "ACCEPTED" : "PENDING";
  const participant = await tripRepo.createTripParticipant(trip.id, userId, status);

  await notify({
    type: "TRIP_JOIN",
    receiverId: trip.createdBy,
    senderId: userId,
    tripId: trip.id,
    message:
      status === "PENDING"
        ? "requested to join your trip"
        : "joined your trip",
  });

  return participant;
};

const getTripForOwnerAction = async (ownerId: string, publicId: string) => {
  const trip = await tripRepo.findTripForJoin(publicId);

  if (!trip) {
    throw new TripServiceError("Trip not found", 404);
  }

  if (trip.createdBy !== ownerId) {
    throw new TripServiceError("Only the trip owner can do this", 403);
  }

  return trip;
};

export const getPendingJoinRequests = async (
  ownerId: string,
  publicId: string,
) => {
  const trip = await getTripForOwnerAction(ownerId, publicId);

  return tripRepo.findPendingTripParticipants(trip.id);
};

export const approveJoinRequest = async (
  ownerId: string,
  publicId: string,
  participantUserId: string,
) => {
  const trip = await getTripForOwnerAction(ownerId, publicId);

  const participant = await tripRepo.findTripParticipant(
    trip.id,
    participantUserId,
  );

  if (!participant) {
    throw new TripServiceError("Join request not found", 404);
  }

  if (participant.role === "OWNER") {
    throw new TripServiceError("Trip owner is already accepted", 409);
  }

  if (participant.status === "ACCEPTED") {
    throw new TripServiceError("User is already accepted", 409);
  }

  if (
    trip.maxMembers !== null &&
    trip._count.participants >= trip.maxMembers
  ) {
    throw new TripServiceError("Trip is full", 409);
  }

  const updatedParticipant = await tripRepo.updateTripParticipantStatus(
    trip.id,
    participantUserId,
    "ACCEPTED",
  );

  await notify({
    type: "TRIP_JOIN",
    receiverId: participantUserId,
    senderId: ownerId,
    tripId: trip.id,
    message: "approved your trip join request",
  });

  return updatedParticipant;
};

export const declineJoinRequest = async (
  ownerId: string,
  publicId: string,
  participantUserId: string,
) => {
  const trip = await getTripForOwnerAction(ownerId, publicId);

  const participant = await tripRepo.findTripParticipant(
    trip.id,
    participantUserId,
  );

  if (!participant) {
    throw new TripServiceError("Join request not found", 404);
  }

  if (participant.role === "OWNER") {
    throw new TripServiceError("Trip owner cannot be declined", 409);
  }

  if (participant.status === "DECLINED") {
    throw new TripServiceError("User is already declined", 409);
  }

  return tripRepo.updateTripParticipantStatus(
    trip.id,
    participantUserId,
    "DECLINED",
  );
};
