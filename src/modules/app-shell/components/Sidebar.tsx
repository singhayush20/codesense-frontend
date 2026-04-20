"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isSidebarOpen: boolean;
  isMobileViewport: boolean;
  isLoggingOut: boolean;
  logoutError: string | null;
  onCloseSidebar: () => void;
  onLogout: () => Promise<void>;
};

const navigationItems = [
  {
    label: "Dashboard",
    href: routes.app.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: routes.app.profile,
    icon: UserCircle2,
  },
] as const;

export function Sidebar({
  isSidebarOpen,
  isMobileViewport,
  isLoggingOut,
  logoutError,
  onCloseSidebar,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-30 bg-[var(--color-overlay)] backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseSidebar}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border/70 bg-[var(--color-bg-secondary)] pt-20 shadow-[var(--shadow-surface)] backdrop-blur-xl transition-all duration-300",
          isSidebarOpen ? "translate-x-0 lg:w-72" : "-translate-x-full lg:w-24 lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col px-3 py-6">
          <p
            className={cn(
              "px-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground transition-opacity duration-200",
              !isSidebarOpen && "lg:opacity-0",
            )}
          >
            Navigation
          </p>

          <nav className="mt-4 space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  onClick={() => {
                    if (isMobileViewport) {
                      onCloseSidebar();
                    }
                  }}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "border border-primary/15 bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:translate-x-1 hover:bg-muted hover:text-foreground",
                    !isSidebarOpen && "lg:justify-center lg:gap-0 lg:px-0",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />

                  <span
                    className={cn(
                      "truncate transition-[opacity,transform,width] duration-200",
                      !isSidebarOpen && "lg:w-0 lg:-translate-x-1 lg:opacity-0",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            {logoutError ? (
              <p
                role="alert"
                className={cn(
                  "px-3 text-xs text-destructive",
                  !isSidebarOpen && "lg:hidden",
                )}
              >
                {logoutError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => void onLogout()}
              disabled={isLoggingOut}
              title="Logout"
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-destructive transition-all duration-200 hover:translate-x-1 hover:bg-destructive/10 disabled:cursor-wait disabled:opacity-70",
                !isSidebarOpen && "lg:justify-center lg:gap-0 lg:px-0",
              )}
            >
              <LogOut className="h-5 w-5 shrink-0 text-destructive transition-colors duration-200" />
              <span
                className={cn(
                  "truncate transition-[opacity,transform,width] duration-200",
                  !isSidebarOpen && "lg:w-0 lg:-translate-x-1 lg:opacity-0",
                )}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
