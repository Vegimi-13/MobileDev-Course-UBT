import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { GetPublicTripsFilterInput } from "./trip.validation";

export const createTrip = (data: Prisma.TripCreateInput) => {
  return prisma.trip.create({ data });
};

export const findTripByPublicId = (publicId: string) => {
  return prisma.trip.findUnique({
    where: { publicId },
    include: {
      creator: true,
      participants: {
        include: { user: true },
      },
      photos: true,
      _count: {
        select: {
          participants: true,
          likes: true,
        },
      },
    },
  });
};

export const findTripForJoin = (publicId: string) => {
  return prisma.trip.findUnique({
    where: { publicId },
    include: {
      _count: {
        select: {
          participants: {
            where: {
              status: "ACCEPTED",
            },
          },
        },
      },
    },
  });
};

export const findTripParticipant = (tripId: string, userId: string) => {
  return prisma.tripParticipant.findUnique({
    where: {
      userId_tripId: {
        userId,
        tripId,
      },
    },
  });
};

export const createTripParticipant = (
  tripId: string,
  userId: string,
  status: "PENDING" | "ACCEPTED",
) => {
  return prisma.tripParticipant.create({
    data: {
      trip: {
        connect: {
          id: tripId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      role: "MEMBER",
      status,
    },
    include: {
      trip: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
    },
  });
};

export const findPendingTripParticipants = (tripId: string) => {
  return prisma.tripParticipant.findMany({
    where: {
      tripId,
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};

export const updateTripParticipantStatus = (
  tripId: string,
  userId: string,
  status: "ACCEPTED" | "DECLINED",
) => {
  return prisma.tripParticipant.update({
    where: {
      userId_tripId: {
        userId,
        tripId,
      },
    },
    data: {
      status,
    },
    include: {
      trip: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
    },
  });
};

export const findPublicTrips = (filters: GetPublicTripsFilterInput) => {
  const { categoryId, tags } = filters;

  return prisma.trip.findMany({
    where: {
      visibility: "PUBLIC",
      ...(categoryId ? { categoryId } : {}),
      ...(tags?.length
        ? {
            tags: {
              some: {
                tagId: {
                  in: tags,
                },
              },
            },
          }
        : {}),
    },
    include: {
      creator: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          participants: true,
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findTripsByUser = (userId: string) => {
  return prisma.trip.findMany({
    where: {
      OR: [
        {
          createdBy: userId,
        },
        {
          participants: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    include: {
      creator: true,
      participants: {
        where: {
          userId,
        },
      },
      _count: {
        select: {
          participants: true,
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
