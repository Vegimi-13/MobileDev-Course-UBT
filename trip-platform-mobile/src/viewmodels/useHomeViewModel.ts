import { useCallback, useEffect, useMemo, useState } from "react";
import { Trip } from "../models/trip";
import { fetchTrips } from "../services/tripService";
import { fetchCurrentUser } from "../services/userService";
import type { User } from "../models/user";

export function useHomeViewModel() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // fetch trips and user in parallel; user fetch can fail if not authenticated
      const tripsPromise = fetchTrips();
      const userPromise = fetchCurrentUser().catch(() => null);

      const [tripsData, userData] = await Promise.all([
        tripsPromise,
        userPromise,
      ]);

      setTrips(tripsData);
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

  return {
    trips,
    user,
    greeting,
    isLoading,
    error,
    refresh: load,
  } as const;
}
