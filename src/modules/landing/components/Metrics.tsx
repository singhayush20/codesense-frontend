import { Activity, Brain, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const metrics = [
  {
    title: "Rapid Triage",
    description: "Instantly surface architecture risks, syntax issues, and logic gaps before they reach your team.",
    icon: <Activity className="h-5 w-5 text-primary" />,
  },
  {
    title: "Semantic Depth",
    description: "Beyond surface fixes - analyze intent, architectural integrity, and long-term maintainability.",
    icon: <Brain className="h-5 w-5 text-[var(--color-accent-strong)]" />,
  },
  {
    title: "Zero-Day Security",
    description: "Automated vulnerability scanning that understands context, reduces false positives, and enforces safety.",
    icon: <ShieldCheck className="h-5 w-5 text-[var(--color-success)]" />,
  },
];

export default function Metrics() {
  return (
    <SectionWrapper className="border-t border-border/70">
      <Container className="space-y-12">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">The impact</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Elite Efficiency. Lower Cognitive Load.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            CodeSense reduces review friction by combining architectural analysis with semantic understanding so teams can move faster without sacrificing quality.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.title} className="space-y-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-muted ring-1 ring-border/70">
                {metric.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{metric.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{metric.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/70 p-8 text-center shadow-[var(--shadow-surface)]">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Highlight</p>
          <p className="mt-4 text-4xl font-semibold text-foreground sm:text-5xl">60-70% reduction in review time</p>
        </div>
      </Container>
    </SectionWrapper>
  );
}
