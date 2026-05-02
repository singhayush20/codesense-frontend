import * as React from "react";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-4 cursor-pointer appearance-none rounded border border-border bg-background shadow-sm outline-none transition-colors checked:border-primary checked:bg-primary focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
        "after:block after:size-full after:scale-0 after:bg-[linear-gradient(45deg,transparent_40%,var(--primary-foreground)_40%,var(--primary-foreground)_58%,transparent_58%),linear-gradient(-45deg,transparent_52%,var(--primary-foreground)_52%,var(--primary-foreground)_70%,transparent_70%)] after:transition-transform checked:after:scale-100",
        className,
      )}
      {...props}
    />
  );
}

export { Checkbox };
