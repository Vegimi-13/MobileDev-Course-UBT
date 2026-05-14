import { prisma } from "../../prisma/client";
import { CreatePhotoInput } from "./photo.validation";

export const findTripByPublicId = (publicId: string) => {
  return prisma.trip.findUnique({
    where: { publicId },
    select: {
      id: true,
      publicId: true,
      createdBy: true,
      visibility: true,
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

export const createPhoto = (
  tripId: string,
  uploadedBy: string,
  data: CreatePhotoInput,
) => {
  return prisma.photo.create({
    data: {
      imageUrl: data.imageUrl,
      caption: data.caption ?? null,
      trip: {
        connect: {
          id: tripId,
        },
      },
      user: {
        connect: {
          id: uploadedBy,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
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

export const findPhotosByTripId = (tripId: string) => {
  return prisma.photo.findMany({
    where: { tripId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findPhotoById = (photoId: string) => {
  return prisma.photo.findUnique({
    where: { id: photoId },
    include: {
      trip: {
        select: {
          id: true,
          createdBy: true,
        },
      },
    },
  });
};

export const deletePhoto = (photoId: string) => {
  return prisma.photo.delete({
    where: {
      id: photoId,
    },
  });
};
