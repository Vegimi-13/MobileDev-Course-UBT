import { useCallback, useEffect, useMemo, useState } from "react";
import { Trip } from "../models/trip";
import {
  fetchMyTrips,
  fetchTrips,
  joinTrip,
  likeTrip,
  unlikeTrip,
} from "../services/tripService";
import { fetchCurrentUser } from "../services/userService";
import type { User } from "../models/user";
import { followUser, unfollowUser } from "../services/followService";

type HomeStatusFilter = "All" | "Upcoming" | "Ongoing" | "Completed";

export function useHomeViewModel() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<HomeStatusFilter>("All");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // fetch trips and user in parallel; user fetch can fail if not authenticated
      const tripsPromise = fetchTrips();
      const myTripsPromise = fetchMyTrips().catch(() => []);
      const userPromise = fetchCurrentUser().catch(() => null);

      const [tripsData, myTripsData, userData] = await Promise.all([
        tripsPromise,
        myTripsPromise,
        userPromise,
      ]);

      const myTripIds = new Set(myTripsData.map((trip) => trip.id));
      const mergedTrips = [
        ...myTripsData,
        ...tripsData.filter((trip) => !myTripIds.has(trip.id)),
      ].map((trip) => ({
        ...trip,
        isOwner: Boolean(userData?.id && trip.hostId === userData.id),
        hasJoined:
          Boolean(userData?.id && trip.hostId === userData.id) || trip.hasJoined,
      }));

      setTrips(mergedTrips);
      setUser(userData as User | null);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load trips");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const sortedTrips = useMemo(
    () => [...trips].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)),
    [trips],
  );

  const featuredTrip = sortedTrips[0] ?? null;
  const upcomingTrips = sortedTrips.filter((trip) => trip.status === "Upcoming");
  const completedTrips = sortedTrips.filter(
    (trip) => trip.status === "Completed",
  ).length;
  const publicTrips = sortedTrips.filter((trip) => trip.visibility === "Public");

  const stats = useMemo(
    () => [
      {
        label: "Trips planned",
        value: String(sortedTrips.length),
      },
      {
        label: "Countries",
        value: String(new Set(sortedTrips.map((trip) => trip.country).filter(Boolean)).size),
      },
      {
        label: "Saved likes",
        value: String(
          sortedTrips.reduce((sum, trip) => sum + (trip.likes ?? 0), 0),
        ),
      },
    ],
    [sortedTrips],
  );

  const collections = useMemo(
    () => [
      {
        title: "Next departure",
        subtitle:
          upcomingTrips[0]?.date ??
          "Choose a destination and lock in your next route.",
        accent: "#F26A2E",
      },
      {
        title: "Public adventures",
        subtitle: `${publicTrips.length} trips open for the crew to follow along.`,
        accent: "#12B981",
      },
      {
        title: "Completed journals",
        subtitle: `${completedTrips} memory-packed trips ready to revisit.`,
        accent: "#6A35C8",
      },
    ],
    [completedTrips, publicTrips.length, upcomingTrips],
  );

  const displayName = user?.firstName ?? "traveler";
  const profileHandle =
    user?.username ??
    `${user?.firstName ?? "trip"}${user?.lastName ?? "friend"}`.toLowerCase();

  const statusFilters: HomeStatusFilter[] = [
    "All",
    "Upcoming",
    "Ongoing",
    "Completed",
  ];
  const myTrips = sortedTrips.slice(0, 4);
  const discoverTrips =
    activeStatusFilter === "All"
      ? sortedTrips
      : sortedTrips.filter((trip) => trip.status === activeStatusFilter);
  const profileStats = [
    {
      label: "My Trips",
      value: user?.tripsCount ?? sortedTrips.length,
      tone: "orange" as const,
    },
    {
      label: "Following",
      value: user?.followingCount ?? 234,
      tone: "mint" as const,
    },
    {
      label: "Followers",
      value: user?.followersCount ?? 891,
      tone: "blue" as const,
    },
  ];

  const toggleFollowHost = async (trip: Trip) => {
    if (!trip.hostId) return;

    setTrips((current) =>
      current.map((item) =>
        item.hostId === trip.hostId
          ? { ...item, isFollowingHost: !trip.isFollowingHost }
          : item,
      ),
    );

    try {
      if (trip.isFollowingHost) {
        await unfollowUser(trip.hostId);
      } else {
        await followUser(trip.hostId);
      }
    } catch {
      setTrips((current) =>
        current.map((item) =>
          item.hostId === trip.hostId
            ? { ...item, isFollowingHost: trip.isFollowingHost }
            : item,
        ),
      );
    }
  };

  const requestJoinTrip = async (trip: Trip) => {
    if (!trip.publicId) return;
    await joinTrip(trip.publicId);
    await load();
  };

  const toggleTripLike = async (trip: Trip) => {
    if (!trip.publicId) return;

    const nextLiked = !trip.liked;
    const delta = nextLiked ? 1 : -1;

    setTrips((current) =>
      current.map((item) =>
        item.id === trip.id
          ? {
              ...item,
              liked: nextLiked,
              likes: Math.max((item.likes ?? 0) + delta, 0),
            }
          : item,
      ),
    );

    try {
      if (nextLiked) {
        await likeTrip(trip.publicId);
      } else {
        await unlikeTrip(trip.publicId);
      }
    } catch {
      setTrips((current) =>
        current.map((item) =>
          item.id === trip.id
            ? {
                ...item,
                liked: trip.liked,
                likes: trip.likes ?? 0,
              }
            : item,
        ),
      );
    }
  };

  return {
    activeStatusFilter,
    discoverTrips,
    trips: sortedTrips,
    myTrips,
    user,
    greeting,
    displayName,
    profileHandle,
    featuredTrip,
    profileStats,
    requestJoinTrip,
    setActiveStatusFilter,
    statusFilters,
    stats,
    toggleFollowHost,
    toggleTripLike,
    collections,
    isLoading,
    error,
    refresh: load,
  } as const;
}
