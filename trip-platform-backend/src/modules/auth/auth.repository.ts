import { prisma } from "../../prisma/client";

export const createUser = (data: any) => {
  return prisma.user.create({ data });
};

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const saveRefreshToken = (data: any) => {
  return prisma.refreshToken.create({ data });
};

export const findRefreshToken = (token: string) => {
  return prisma.refreshToken.findUnique({ where: { token } });
};

export const revokeRefreshToken = (token: string) => {
  return prisma.refreshToken.update({
    where: { token },
    data: { revoked: true },
  });
};