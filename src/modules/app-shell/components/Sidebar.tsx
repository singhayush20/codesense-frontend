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
          "fixed inset-0 z-30 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseSidebar}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-slate-950/92 pt-20 shadow-[0_30px_80px_-45px_rgba(2,6,23,0.95)] backdrop-blur-xl transition-all duration-300",
          isSidebarOpen ? "translate-x-0 lg:w-72" : "-translate-x-full lg:w-24 lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col px-3 py-6">
          <p
            className={cn(
              "px-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 transition-opacity duration-200",
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
                      ? "bg-sky-400/12 text-sky-200"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-50 hover:translate-x-1",
                    !isSidebarOpen && "lg:justify-center lg:px-0",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive ? "text-sky-300" : "text-slate-500 group-hover:text-slate-100",
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
                  "px-3 text-xs text-red-200",
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
                "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-200 transition-all duration-200 hover:bg-red-500/10 hover:translate-x-1 disabled:cursor-wait disabled:opacity-70",
                !isSidebarOpen && "lg:justify-center lg:px-0",
              )}
            >
              <LogOut className="h-5 w-5 shrink-0 text-red-300 transition-colors duration-200 group-hover:text-red-200" />
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
