import bcrypt from "bcrypt";
import * as repo from "./auth.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export const register = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const existing = await repo.findUserByEmail(data.email);
  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await repo.createUser({
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
  });

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await repo.saveRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const refresh = async (token: string) => {
  const stored = await repo.findRefreshToken(token);

  if (!stored || stored.revoked) {
    throw new Error("Invalid refresh token");
  }

  if (stored.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  const decoded = verifyRefreshToken(token);

  const newAccessToken = generateAccessToken(decoded.userId);

  return { accessToken: newAccessToken };
};

export const logout = async (token: string) => {
  const stored = await repo.findRefreshToken(token);

  if (!stored) {
    throw new Error("Refresh token not found");
  }

  await repo.revokeRefreshToken(token);
};
