import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "../models/user";
import {
  fetchCurrentUser,
  updateCurrentUser,
  type UpdateCurrentUserPayload,
} from "../services/userService";
import { fetchMyTrips } from "../services/tripService";
import { fetchFollowers, fetchFollowing } from "../services/followService";
import type { Trip } from "../models/trip";

type ProfileTab = "trips" | "photos" | "reviews";
export type ProfileForm = Required<
  Pick<User, "firstName" | "lastName" | "username" | "bio" | "avatarUrl">
>;

const toProfileForm = (user: User): ProfileForm => ({
  firstName: user.firstName ?? "",
  lastName: user.lastName ?? "",
  username: user.username ?? "",
  bio: user.bio ?? "",
  avatarUrl: user.avatarUrl ?? "",
});

export function useProfileViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("trips");
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    avatarUrl: "",
  });

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userData, tripsData] = await Promise.all([
        fetchCurrentUser(),
        fetchMyTrips(),
      ]);
      const [followers, following] = await Promise.all([
        fetchFollowers(userData.id).catch(() => []),
        fetchFollowing(userData.id).catch(() => []),
      ]);
      setProfileForm(toProfileForm(userData));
      setTrips(tripsData);
      setUser({
        ...userData,
        followersCount: followers.length,
        followingCount: following.length,
        tripsCount: tripsData.length,
      });
    } catch (err: any) {
      setError(err?.message ?? "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Trip traveler";
  const handle =
    user?.username ??
    `${user?.firstName ?? "trip"}${user?.lastName ?? "platform"}`.toLowerCase();

  const badgeItems = useMemo(
    () => [
      {
        label: `${trips.length} Trips`,
        tone: "softOrange" as const,
      },
      {
        label: "Top Reviewer",
        tone: "softGold" as const,
      },
      {
        label: trips.some((trip) => trip.visibility === "Public")
          ? "Adventurer"
          : "Private Planner",
        tone: "softMint" as const,
      },
    ],
    [trips],
  );

  const stats = useMemo(
    () => [
      {
        label: "Trips",
        value: user?.tripsCount ?? trips.length,
      },
      {
        label: "Followers",
        value: user?.followersCount ?? 891,
      },
      {
        label: "Following",
        value: user?.followingCount ?? 234,
      },
    ],
    [trips.length, user?.followersCount, user?.followingCount, user?.tripsCount],
  );

  const tabItems = [
    { key: "trips" as const, label: "Trips" },
    { key: "photos" as const, label: "Photos" },
    { key: "reviews" as const, label: "Reviews" },
  ];

  const visibleTrips =
    activeTab === "trips"
      ? trips
      : activeTab === "photos"
        ? trips.slice(0, 3)
        : [...trips].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)).slice(0, 2);

  const emptyStateText =
    activeTab === "photos"
      ? "Photo memories will show up here next."
      : activeTab === "reviews"
        ? "Reviews are coming soon."
        : "No trips yet.";

  const startEditing = () => {
    if (user) {
      setProfileForm(toProfileForm(user));
    }
    setEditError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditError(null);
    setIsEditing(false);
    if (user) {
      setProfileForm(toProfileForm(user));
    }
  };

  const updateProfileField = (key: keyof ProfileForm, value: string) => {
    setProfileForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setEditError(null);
    try {
      const payload: UpdateCurrentUserPayload = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        username: profileForm.username.trim() || undefined,
        bio: profileForm.bio.trim() || undefined,
        avatarUrl: profileForm.avatarUrl.trim() || undefined,
      };
      const updated = await updateCurrentUser(payload);
      const nextUser = {
        ...updated,
        followersCount: user?.followersCount ?? updated.followersCount,
        followingCount: user?.followingCount ?? updated.followingCount,
        tripsCount: user?.tripsCount ?? trips.length,
      };
      setUser(nextUser);
      setProfileForm(toProfileForm(nextUser));
      setIsEditing(false);
    } catch (err: any) {
      setEditError(err?.message ?? "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    fullName,
    handle,
    trips: visibleTrips,
    allTrips: trips,
    badgeItems,
    stats,
    tabItems,
    activeTab,
    cancelEditing,
    editError,
    setActiveTab,
    isEditing,
    emptyStateText,
    isSaving,
    profileForm,
    saveProfile,
    startEditing,
    updateProfileField,
    isLoading,
    error,
    refresh: load,
  } as const;
}
