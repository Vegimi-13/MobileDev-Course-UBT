import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "../models/user";
import { fetchCurrentUser } from "../services/userService";
import { fetchTrips } from "../services/tripService";
import type { Trip } from "../models/trip";

type ProfileTab = "trips" | "photos" | "reviews";

export function useProfileViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("trips");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userData, tripsData] = await Promise.all([
        fetchCurrentUser(),
        fetchTrips(),
      ]);
      setUser(userData);
      setTrips(tripsData);
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
    setActiveTab,
    emptyStateText,
    isLoading,
    error,
    refresh: load,
  } as const;
}
