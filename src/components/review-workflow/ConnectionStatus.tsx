"use client";

import { cn } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        connected
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-destructive/10 text-destructive",
      )}
    >
      {connected ? (
        <Wifi className="size-3" />
      ) : (
        <WifiOff className="size-3" />
      )}
      {connected ? "Live" : "Disconnected"}
    </div>
  );
}
