import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const metrics = [
  {
    label: "Protected Layout",
    value: "Persistent",
    description: "Header and sidebar stay mounted while you move between protected routes.",
  },
  {
    label: "Navigation",
    value: "Client-side",
    description: "Protected links use Next.js navigation, so the page does not full reload.",
  },
  {
    label: "Session",
    value: "Cookie-backed",
    description: "The JWT remains in an HttpOnly cookie and is checked by the route guard.",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,var(--color-accent-soft),transparent_24%),linear-gradient(135deg,var(--color-surface-elevated),var(--color-bg-secondary))] p-8 shadow-[var(--shadow-accent)]">
        <Badge>Authenticated Area</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Your workspace shell is now persistent.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          Navigate between Dashboard and Profile to confirm the header and collapsible sidebar stay mounted. The sidebar state lives in the protected layout, not in individual pages.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="min-h-[220px]">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{metric.label}</p>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">{metric.value}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{metric.description}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
