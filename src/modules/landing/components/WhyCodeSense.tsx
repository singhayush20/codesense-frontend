"use client";

import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import {
  Ban,
  Lock,
  Pencil,
  Eye,
  Cpu,
  Globe,
} from "lucide-react";

const reasons = [
  {
    title: "Your Keys, Your Models",
    description:
      "Bring your own API keys from any provider. No vendor lock-in, no per-seat fees, no monthly subscriptions. You pay only for the inference you use.",
    icon: <Cpu className="h-5 w-5 text-primary" />,
  },
  {
    title: "Zero Data Retention",
    description:
      "Code never leaves your configured environment. Reviews happen in real time and no snippets, diffs, or credentials are stored on our servers.",
    icon: <Lock className="h-5 w-5 text-[var(--color-accent-strong)]" />,
  },
  {
    title: "Per-Repository Prompts",
    description:
      "Different teams have different standards. Define custom system prompts, review guidelines, and focus areas independently for every repository you monitor.",
    icon: <Pencil className="h-5 w-5 text-[var(--color-success)]" />,
  },
  {
    title: "Inline Diff Reviews",
    description:
      "Suggestions appear directly in the diff view, contextualized by line and file. No more jumping between tabs or deciphering generic comments.",
    icon: <Eye className="h-5 w-5 text-[var(--color-warning)]" />,
  },
  {
    title: "Architecture-Aware Analysis",
    description:
      "CodeSense understands intent, not just syntax. It catches logic errors, security vulnerabilities, and design issues that linters miss entirely.",
    icon: <Ban className="h-5 w-5 text-[var(--color-danger)]" />,
  },
  {
    title: "Self-Hostable & Open",
    description:
      "Deploy on your own infrastructure for full control. CodeSense works with any OpenAI-compatible API, giving you complete freedom over your review pipeline.",
    icon: <Globe className="h-5 w-5 text-primary" />,
  },
];

export default function WhyCodeSense() {
  const { ref, isVisible } = useInView();

  return (
    <SectionWrapper id="why-codesense" className="border-t border-border/70 relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[var(--color-accent-soft)] blur-3xl opacity-30 animate-glow-pulse" style={{ animationDelay: "2s" }} />
      <Container className="space-y-12" ref={ref}>
        <div className={cn(
          "max-w-3xl transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Why CodeSense</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Built for teams that care about quality
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            No gimmicks, no locked-in tiers. CodeSense gives you practical, architecture-aware code review without compromising on privacy or cost.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={cn(
                "group rounded-3xl border border-border/70 bg-card/75 p-6 shadow-[var(--shadow-surface)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:bg-card/95 hover:shadow-[0_0_40px_-16px_var(--color-accent-soft)]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: isVisible ? `${200 + index * 100}ms` : "0ms" }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/70 transition-all duration-300 group-hover:ring-[var(--color-accent-soft)] group-hover:shadow-[0_0_20px_-8px_var(--color-accent-soft)]">
                {reason.icon}
              </div>
              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
