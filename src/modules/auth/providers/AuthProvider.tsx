"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  logoutError: string | null;
  setAuthenticated: (value: boolean) => void;
  clearLogoutError: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  initialIsAuthenticated: boolean;
}

export function AuthProvider({
  children,
  initialIsAuthenticated,
}: AuthProviderProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(initialIsAuthenticated);
  }, [initialIsAuthenticated]);

  const clearLogoutError = useCallback(() => {
    setLogoutError(null);
  }, []);

  const logout = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setLogoutError(null);

    try {
      const response = await fetch(routes.auth.logout, {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      startTransition(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace(routes.public.login);
        router.refresh();
      });
    } catch {
      setLogoutError("We could not log you out. Please try again.");
      setIsLoading(false);
    }
  }, [isLoading, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      logoutError,
      setAuthenticated: setIsAuthenticated,
      clearLogoutError,
      logout,
    }),
    [clearLogoutError, isAuthenticated, isLoading, logout, logoutError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
