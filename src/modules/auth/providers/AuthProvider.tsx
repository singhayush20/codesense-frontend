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
import { AuthSnackbar } from "@/modules/auth/components/AuthSnackbar";
import { AUTH_SESSION_EXPIRED_EVENT } from "@/modules/auth/events";
import { AUTH_SNACKBAR_DURATION_MS, getAuthNoticeMessage } from "@/modules/auth/utils";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  logoutError: string | null;
  setAuthenticated: (value: boolean) => void;
  clearLogoutError: () => void;
  showSnackbar: (message: string) => void;
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
  const sessionExpiredMessage =
    getAuthNoticeMessage("session_expired") ?? "Your session expired. Please log in again.";
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(initialIsAuthenticated);
  }, [initialIsAuthenticated]);

  useEffect(() => {
    if (!snackbarMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSnackbarMessage(null);
    }, AUTH_SNACKBAR_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [snackbarMessage]);

  const clearLogoutError = useCallback(() => {
    setLogoutError(null);
  }, []);

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
  }, []);

  const completeLogout = useCallback(
    (message?: string) => {
      setLogoutError(null);
      setIsLoading(false);

      if (message) {
        setSnackbarMessage(message);
      }

      startTransition(() => {
        setIsAuthenticated(false);
        router.replace(routes.public.login);
        router.refresh();
      });
    },
    [router],
  );

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const message =
        event instanceof CustomEvent && typeof event.detail?.message === "string"
          ? event.detail.message
          : sessionExpiredMessage;

      completeLogout(message);
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [completeLogout, sessionExpiredMessage]);

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
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      completeLogout();
    } catch {
      setLogoutError("We could not log you out. Please try again.");
      setIsLoading(false);
    }
  }, [completeLogout, isLoading]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      logoutError,
      setAuthenticated: setIsAuthenticated,
      clearLogoutError,
      showSnackbar,
      logout,
    }),
    [clearLogoutError, isAuthenticated, isLoading, logout, logoutError, showSnackbar],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthSnackbar message={snackbarMessage} />
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
