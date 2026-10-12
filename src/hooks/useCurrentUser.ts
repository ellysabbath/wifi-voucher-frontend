// src/hooks/useCurrentUser.ts
import { useEffect, useState, useCallback } from "react";
import { authApi, tokenStore, type UserProfile } from "../lib/auth";

export interface CurrentUserState {
  user: UserProfile | null;
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
  update: (patch: Partial<UserProfile>) => Promise<UserProfile>;
}

export function useCurrentUser(): CurrentUserState {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    const token = tokenStore.getAccess();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const profile = await authApi.me();
      setUser(profile);
      setError("");
    } catch (err: any) {
      setError(err?.message ?? "Failed to load profile");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const update = async (patch: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await authApi.updateMe(patch);
    // strip the "detail" key, keep the rest as profile
    const { detail, ...profile } = res as any;
    setUser(profile as UserProfile);
    return profile as UserProfile;
  };

  return { user, loading, error, refetch, update };
}