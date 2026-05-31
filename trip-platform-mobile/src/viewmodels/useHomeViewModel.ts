import { useCallback, useEffect, useState } from "react";
import { Trip } from "../models/trip";
import { fetchTrips } from "../services/tripService";

export function useHomeViewModel() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load trips");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    trips,
    isLoading,
    error,
    refresh: load,
  } as const;
}
