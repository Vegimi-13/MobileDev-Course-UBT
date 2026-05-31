import { useCallback, useEffect, useMemo, useState } from "react";
import type { Trip } from "../models/trip";
import { fetchTrips } from "../services/tripService";

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
      setTrips(await fetchTrips());
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
    setAccessFilter,
    setCategoryFilter,
    setQuery,
  } as const;
}
