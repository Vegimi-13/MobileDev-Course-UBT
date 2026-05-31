import * as repo from "./user.repository";
import { UpdateProfileBody } from "./user.types";

export const getUserById = async (userId: string) => {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getUserByUsername = async (username: string) => {
  const user = await repo.findUserByUsername(username);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileBody,
) => {
  // Check if trying to update username
  if (data.username) {
    const existing = await repo.findUserByUsername(data.username);
    if (existing && existing.id !== userId) {
      throw new Error("Username already taken");
    }
  }

  const updated = await repo.updateUser(userId, data);
  if (!updated) {
    throw new Error("Failed to update profile");
  }
  return updated;
};

export const getCurrentUser = async (userId: string) => {
  const user = await repo.findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const searchUsers = (currentUserId: string, query = "") => {
  return repo.searchUsers(query.trim(), currentUserId);
};
