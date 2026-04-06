"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const SIDEBAR_STORAGE_KEY = "codesense.sidebar.open";
const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

function getIsMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

function getInitialSidebarState(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
    return false;
  }

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
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);

      if (event.matches) {
        setIsSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, isSidebarOpen ? "open" : "closed");
  }, [isSidebarOpen]);

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
    <div className="min-h-screen bg-[#09111f] text-slate-100">
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
