"use client";

import { Menu, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const ToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isSidebarOpen}
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-card/80 text-foreground transition hover:border-[var(--color-border-strong)] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Menu className="h-5 w-5 lg:hidden" />
            <ToggleIcon className="hidden h-5 w-5 lg:block" />
          </button>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Workspace</p>
              <h1 className="text-sm font-semibold text-foreground sm:text-base">CodeSense</h1>
            </div>
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
