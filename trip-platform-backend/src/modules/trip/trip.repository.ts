import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { GetPublicTripsFilterInput } from "./trip.validation";

export const createTrip = (data: Prisma.TripCreateInput) => {
  return prisma.trip.create({ data });
};

export const findTripByPublicId = (publicId: string, viewerId?: string) => {
  return prisma.trip.findUnique({
    where: { publicId },
    include: {
      creator: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      participants: {
        include: { user: true },
      },
      ...(viewerId
        ? {
            likes: {
              where: {
                userId: viewerId,
              },
              select: {
                id: true,
              },
            },
          }
        : {}),
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

export const findTripAccessRecord = (publicId: string) => {
  return prisma.trip.findUnique({
    where: { publicId },
    include: {
      participants: true,
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

export const findUserById = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      avatarUrl: true,
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
  status: "PENDING" | "ACCEPTED" | "DECLINED",
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

export const findTripPosts = (tripId: string) => {
  return prisma.tripPost.findMany({
    where: { tripId },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createTripPost = (
  tripId: string,
  authorId: string,
  data: { body: string; imageUrl?: string },
) => {
  return prisma.tripPost.create({
    data: {
      body: data.body,
      imageUrl: data.imageUrl ?? null,
      trip: { connect: { id: tripId } },
      author: { connect: { id: authorId } },
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
};

export const findPublicTrips = (
  filters: GetPublicTripsFilterInput,
  viewerId?: string,
) => {
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
      ...(viewerId
        ? {
            likes: {
              where: {
                userId: viewerId,
              },
              select: {
                id: true,
              },
            },
          }
        : {}),
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
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      participants: {
        where: {
          userId,
        },
      },
      likes: {
        where: {
          userId,
        },
        select: {
          id: true,
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
