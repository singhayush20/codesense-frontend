"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const SIDEBAR_STORAGE_KEY = "codesense.sidebar.open";
const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

function getDesktopSidebarState(): boolean {
  const savedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);

  if (savedValue === "open") {
    return true;
  }

  if (savedValue === "closed") {
    return false;
  }

  return true;
}

interface ProtectedLayoutShellProps {
  children: React.ReactNode;
}

export function ProtectedLayoutShell({ children }: ProtectedLayoutShellProps) {
  const pathname = usePathname();
  const { clearLogoutError, isAuthenticated, isLoading, logout, logoutError } = useAuth();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasSyncedSidebarState, setHasSyncedSidebarState] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const syncSidebarState = (matches: boolean) => {
      setIsMobileViewport(matches);
      setIsSidebarOpen(matches ? false : getDesktopSidebarState());
      setHasSyncedSidebarState(true);
    };

    syncSidebarState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncSidebarState(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!hasSyncedSidebarState || isMobileViewport) {
      return;
    }

    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, isSidebarOpen ? "open" : "closed");
  }, [hasSyncedSidebarState, isMobileViewport, isSidebarOpen]);

  useEffect(() => {
    clearLogoutError();
  }, [clearLogoutError, pathname]);

  useEffect(() => {
    if (!isMobileViewport || !isSidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileViewport, isSidebarOpen]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileViewport={isMobileViewport}
        isLoggingOut={isLoading}
        logoutError={logoutError}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onLogout={logout}
      />

      <div
        className={cn(
          "min-h-screen pt-20 transition-[padding-left] duration-300 ease-out",
          isSidebarOpen ? "lg:pl-72" : "lg:pl-24",
        )}
      >
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
