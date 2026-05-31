import { useCallback, useEffect, useMemo, useState } from "react";
import type { Trip } from "../models/trip";
import { fetchTrips, joinTrip, likeTrip, unlikeTrip } from "../services/tripService";
import { followUser, unfollowUser } from "../services/followService";
import { fetchCurrentUser } from "../services/userService";

type ExploreAccessFilter = "All Trips" | "Open" | "Public";
type ExploreCategoryFilter = "All" | "Beach" | "Mountains" | "City" | "Adventure";

export function useExploreViewModel() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [accessFilter, setAccessFilter] =
    useState<ExploreAccessFilter>("All Trips");
  const [categoryFilter, setCategoryFilter] =
    useState<ExploreCategoryFilter>("All");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tripsData, userData] = await Promise.all([
        fetchTrips(),
        fetchCurrentUser().catch(() => null),
      ]);
      setTrips(
        tripsData.map((trip) => ({
          ...trip,
          isOwner: Boolean(userData?.id && trip.hostId === userData.id),
          hasJoined:
            Boolean(userData?.id && trip.hostId === userData.id) ||
            trip.hasJoined,
        })),
      );
    } catch (err: any) {
      setError(err?.message ?? "Failed to load explore trips");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const accessFilters: ExploreAccessFilter[] = ["All Trips", "Open", "Public"];
  const categoryFilters: ExploreCategoryFilter[] = [
    "All",
    "Beach",
    "Mountains",
    "City",
    "Adventure",
  ];

  const filteredTrips = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return trips.filter((trip) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [trip.title, trip.location, trip.country, trip.category]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery));

      const matchesAccess =
        accessFilter === "All Trips" ||
        (accessFilter === "Open" && trip.joinPolicy === "Open") ||
        (accessFilter === "Public" && trip.visibility === "Public");

      const matchesCategory =
        categoryFilter === "All" || trip.category === categoryFilter;

      return matchesQuery && matchesAccess && matchesCategory;
    });
  }, [accessFilter, categoryFilter, query, trips]);

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
    accessFilter,
    accessFilters,
    categoryFilter,
    categoryFilters,
    error,
    filteredTrips,
    isLoading,
    query,
    refresh: load,
    requestJoinTrip,
    setAccessFilter,
    setCategoryFilter,
    setQuery,
    toggleFollowHost,
    toggleTripLike,
  } as const;
}
