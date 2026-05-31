import { prisma } from "../../prisma/client";

export const findUserById = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
};

export const findUserByUsername = (username: string) => {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
};

export const updateUser = (userId: string, data: any) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
};

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
};

export const searchUsers = (query: string, currentUserId: string) => {
  return prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
      OR: [
        {
          firstName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: {
      firstName: "asc",
    },
    take: 20,
  });
};
