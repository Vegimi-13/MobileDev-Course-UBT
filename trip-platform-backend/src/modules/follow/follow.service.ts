import * as followRepo from "./follow.repository";
import { notify } from "../notification/notification.service";

export class FollowServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new FollowServiceError("You cannot follow yourself", 400);
  }

  const targetUser = await followRepo.findUserById(followingId);
  if (!targetUser) {
    throw new FollowServiceError("User not found", 404);
  }

  const existing = await followRepo.findFollowRelation(followerId, followingId);
  if (existing) {
    throw new FollowServiceError("Already following this user", 409);
  }

  await followRepo.createFollow(followerId, followingId);
  await notify({
    type: "FOLLOW",
    receiverId: followingId,
    senderId: followerId,
    message: "started following you",
  });

  return { following: true };
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const existing = await followRepo.findFollowRelation(followerId, followingId);
  if (!existing) {
    throw new FollowServiceError("Follow relation not found", 404);
  }

  await followRepo.deleteFollow(followerId, followingId);

  return { following: false };
};

export const getFollowers = async (userId: string) => {
  const user = await followRepo.findUserById(userId);
  if (!user) {
    throw new FollowServiceError("User not found", 404);
  }

  const relations = await followRepo.findFollowers(userId);
  return relations.map((relation) => relation.follower);
};

export const getFollowing = async (userId: string) => {
  const user = await followRepo.findUserById(userId);
  if (!user) {
    throw new FollowServiceError("User not found", 404);
  }

  const relations = await followRepo.findFollowing(userId);
  return relations.map((relation) => relation.following);
};
