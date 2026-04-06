"use client";

import { Menu, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const ToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="flex h-20 w-full items-center justify-start gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isSidebarOpen}
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-slate-100 transition hover:border-sky-400/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
          >
            <Menu className="h-5 w-5 lg:hidden" />
            <ToggleIcon className="hidden h-5 w-5 lg:block" />
          </button>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl text-sky-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Workspace</p>
              <h1 className="text-sm font-semibold text-slate-50 sm:text-base">CodeSense</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

