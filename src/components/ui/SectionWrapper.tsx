import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SectionWrapper({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-20 sm:py-24", className)} {...props} />
  );
}
