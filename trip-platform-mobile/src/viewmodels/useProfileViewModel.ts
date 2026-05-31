import { useCallback, useEffect, useState } from "react";
import type { User } from "../models/user";
import { fetchCurrentUser } from "../services/userService";

export function useProfileViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentUser();
      setUser(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { user, isLoading, error, refresh: load } as const;
}
