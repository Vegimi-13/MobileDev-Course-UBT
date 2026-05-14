import { prisma } from "../../prisma/client";

export const findTripByPublicId = (publicId: string) => {
  return prisma.trip.findUnique({
    where: { publicId },
    select: {
      id: true,
      publicId: true,
      createdBy: true,
      visibility: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
};

export const findAcceptedParticipant = (tripId: string, userId: string) => {
  return prisma.tripParticipant.findFirst({
    where: {
      tripId,
      userId,
      status: "ACCEPTED",
    },
    select: {
      id: true,
    },
  });
};

export const findPhotoById = (photoId: string) => {
  return prisma.photo.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      uploadedBy: true,
      tripId: true,
      trip: {
        select: {
          id: true,
          createdBy: true,
          visibility: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
};

export const findTripLike = (tripId: string, userId: string) => {
  return prisma.like.findFirst({
    where: {
      tripId,
      userId,
    },
    select: {
      id: true,
    },
  });
};

export const findPhotoLike = (photoId: string, userId: string) => {
  return prisma.like.findFirst({
    where: {
      photoId,
      userId,
    },
    select: {
      id: true,
    },
  });
};

export const createTripLike = (tripId: string, userId: string) => {
  return prisma.like.create({
    data: {
      user: {
        connect: { id: userId },
      },
      trip: {
        connect: { id: tripId },
      },
    },
  });
};

export const createPhotoLike = (photoId: string, userId: string) => {
  return prisma.like.create({
    data: {
      user: {
        connect: { id: userId },
      },
      photo: {
        connect: { id: photoId },
      },
    },
  });
};

export const deleteLikeById = (id: string) => {
  return prisma.like.delete({
    where: { id },
  });
};
