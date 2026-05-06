import Link from "next/link";
import { GitBranch, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { routes } from "@/config/routes";

export function EmptyDashboard() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-[var(--shadow-surface)] backdrop-blur-xl">
        <div className="grid size-14 place-items-center rounded-2xl bg-muted text-primary">
          <Lightbulb className="size-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground">
          Choose Repositories
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Connect repos to begin.
        </p>
        <Button asChild className="mt-6 gap-2">
          <Link href={routes.app.repositories}>
            <GitBranch className="size-4" aria-hidden="true" />
            Choose repositories
          </Link>
        </Button>
      </div>
    </section>
  );
}
