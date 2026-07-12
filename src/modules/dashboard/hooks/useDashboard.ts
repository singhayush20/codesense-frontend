"use client";

import { useCallback, useState } from "react";
import { dashboardApi, type DashboardStats } from "@/modules/dashboard/api/dashboard.api";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async (): Promise<DashboardStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await dashboardApi.getStats();
      setStats(data);
      return data;
    } catch {
      const message = "We could not load your dashboard statistics.";
      setError(message);
      return null;
    } finally {
      setHasLoaded(true);
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    error,
    isLoading,
    hasLoaded,
    loadStats,
  };
}
