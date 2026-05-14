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
      createdAt: true,
    },
  });
};
