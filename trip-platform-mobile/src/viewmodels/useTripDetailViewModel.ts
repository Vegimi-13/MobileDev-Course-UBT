import { useCallback, useEffect, useMemo, useState } from "react";
import type { Trip, TripPost } from "../models/trip";
import type { User } from "../models/user";
import {
  createTripPost,
  fetchTrip,
  fetchTripPosts,
  inviteUserToTrip,
  joinTrip,
  likeTrip,
  unlikeTrip,
} from "../services/tripService";
import { fetchCurrentUser, searchUsers } from "../services/userService";

export function useTripDetailViewModel(publicId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [posts, setPosts] = useState<TripPost[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [inviteUsers, setInviteUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [postBody, setPostBody] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decorateTrip = useCallback((item: Trip, user: User | null) => {
    const isOwner = Boolean(user?.id && item.hostId === user.id);
    return {
      ...item,
      isOwner,
      hasJoined: isOwner || item.hasJoined,
    };
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userData, tripData, postData] = await Promise.all([
        fetchCurrentUser().catch(() => null),
        fetchTrip(publicId),
        fetchTripPosts(publicId),
      ]);
      setCurrentUser(userData);
      setTrip(decorateTrip(tripData, userData));
      setPosts(postData);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load trip");
    } finally {
      setIsLoading(false);
    }
  }, [decorateTrip, publicId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isInviteOpen) return;

    const timer = setTimeout(() => {
      searchUsers(query)
        .then(setInviteUsers)
        .catch(() => setInviteUsers([]));
    }, 200);

    return () => clearTimeout(timer);
  }, [isInviteOpen, query]);

  const canJoin = Boolean(trip?.publicId && !trip.isOwner && !trip.hasJoined);
  const canPost = Boolean(trip?.isOwner || trip?.hasJoined);

  const toggleLike = async () => {
    if (!trip?.publicId) return;

    const nextLiked = !trip.liked;
    const previous = trip;
    setTrip({
      ...trip,
      liked: nextLiked,
      likes: Math.max((trip.likes ?? 0) + (nextLiked ? 1 : -1), 0),
    });

    try {
      if (nextLiked) {
        await likeTrip(trip.publicId);
      } else {
        await unlikeTrip(trip.publicId);
      }
    } catch {
      setTrip(previous);
    }
  };

  const requestJoin = async () => {
    if (!trip?.publicId) return;
    const nextStatus = trip.joinPolicy === "Approval" ? "PENDING" : "ACCEPTED";
    setTrip({
      ...trip,
      membershipStatus: nextStatus,
      hasJoined: nextStatus === "ACCEPTED",
      hasRequested: nextStatus === "PENDING",
      membersJoined:
        nextStatus === "ACCEPTED"
          ? (trip.membersJoined ?? 0) + 1
          : trip.membersJoined,
      joined:
        nextStatus === "ACCEPTED"
          ? `${(trip.membersJoined ?? 0) + 1}/${trip.maxMembers ?? "-"} joined`
          : trip.joined,
      spotsLeft:
        nextStatus === "ACCEPTED" && typeof trip.spotsLeft === "number"
          ? Math.max(trip.spotsLeft - 1, 0)
          : trip.spotsLeft,
    });
    await joinTrip(trip.publicId);
    await load();
  };

  const submitPost = async () => {
    if (!trip?.publicId || !postBody.trim()) return;

    const created = await createTripPost(trip.publicId, {
      body: postBody.trim(),
    });
    setPosts((current) => [created, ...current]);
    setPostBody("");
  };

  const inviteUser = async (userId: string) => {
    if (!trip?.publicId) return;
    await inviteUserToTrip(trip.publicId, userId);
    setInviteUsers((current) => current.filter((user) => user.id !== userId));
  };

  const stats = useMemo(
    () => [
      { label: "Dates", value: trip?.date ?? "-" },
      { label: "Members", value: trip?.joined ?? "-" },
      { label: "Likes", value: String(trip?.likes ?? 0) },
    ],
    [trip],
  );

  return {
    canJoin,
    canPost,
    currentUser,
    error,
    inviteUser,
    inviteUsers,
    isInviteOpen,
    isLoading,
    postBody,
    posts,
    query,
    refresh: load,
    requestJoin,
    setIsInviteOpen,
    setPostBody,
    setQuery,
    stats,
    submitPost,
    toggleLike,
    trip,
  } as const;
}
