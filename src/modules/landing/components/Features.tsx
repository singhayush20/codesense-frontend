import { Box, Cpu, GitBranch, Shield } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const features = [
  {
    title: "Automated High-Cognition Reviews",
    description: "Receive architecture-aware feedback that prioritizes system design and long-term maintainability.",
    icon: <Box className="h-5 w-5 text-primary" />,
  },
  {
    title: "Multi-LLM Orchestration",
    description: "Orchestrate specialist agents for code quality, security, and architectural consistency.",
    icon: <Cpu className="h-5 w-5 text-[var(--color-accent-strong)]" />,
  },
  {
    title: "Native GitHub Sync",
    description: "Deep integration with pull requests, branches, and review workflows for seamless onboarding.",
    icon: <GitBranch className="h-5 w-5 text-[var(--color-success)]" />,
  },
  {
    title: "Architectural Guardrails",
    description: "Enforce team standards automatically with rules that catch drift before merge.",
    icon: <Shield className="h-5 w-5 text-[var(--color-warning)]" />,
  },
];

export default function Features() {
  return (
    <SectionWrapper id="features" className="border-t border-border/70">
      <Container className="space-y-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Engineered for Complexity</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Engineered for complexity, trusted by modern teams.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Built to keep architecture coherent across fast-moving engineering teams with deep code context and actionable guidance.
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground sm:text-base">
            <p>
              Every review is tuned for architecture, security, and developer velocity - so teams can ship faster without sacrificing long-term health.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="group relative overflow-hidden transition">
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-strong),var(--color-success))] opacity-80" />
              <div className="relative space-y-5 pt-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-muted shadow-[var(--shadow-surface)]">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
