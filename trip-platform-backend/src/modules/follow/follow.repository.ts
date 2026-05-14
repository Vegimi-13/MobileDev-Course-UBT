import { prisma } from "../../prisma/client";

const basicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  username: true,
  createdAt: true,
} as const;

export const findUserById = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: basicUserSelect,
  });
};

export const findFollowRelation = (followerId: string, followingId: string) => {
  return prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
    select: {
      id: true,
    },
  });
};

export const createFollow = (followerId: string, followingId: string) => {
  return prisma.follow.create({
    data: {
      follower: {
        connect: { id: followerId },
      },
      following: {
        connect: { id: followingId },
      },
    },
  });
};

export const deleteFollow = (followerId: string, followingId: string) => {
  return prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
};

export const findFollowers = (userId: string) => {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: basicUserSelect,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findFollowing = (userId: string) => {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: basicUserSelect,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
