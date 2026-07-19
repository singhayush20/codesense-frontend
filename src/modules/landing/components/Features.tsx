"use client";

import { Cpu, GitBranch, MessageSquareCode, Sliders } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "GitHub Repository Sync",
    description: "Securely link your GitHub account to import repositories and track open pull requests in a clean interface.",
    icon: <GitBranch className="h-5 w-5 text-primary" />,
  },
  {
    title: "Bring Your Own Keys",
    description: "Configure Gemini, Ollama, AWS Bedrock, or Nvidia NIM credentials. Your keys stay secure and local to your session.",
    icon: <Cpu className="h-5 w-5 text-[var(--color-accent-strong)]" />,
  },
  {
    title: "Custom Review Prompts",
    description: "Fine-tune system instructions, guidelines, and review focus areas individually for each repository.",
    icon: <Sliders className="h-5 w-5 text-[var(--color-success)]" />,
  },
  {
    title: "Rich Diff Reviews",
    description: "Scan code diffs, view inline AI suggestions, and analyze refactoring recommendations inside the app.",
    icon: <MessageSquareCode className="h-5 w-5 text-[var(--color-warning)]" />,
  },
];

export default function Features() {
  const { ref, isVisible } = useInView();

  return (
    <SectionWrapper id="features" className="border-t border-border/70 relative">
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[var(--color-accent-soft)] blur-3xl opacity-30 animate-glow-pulse" />
      <Container className="space-y-10" ref={ref}>
        <div className={cn(
          "grid gap-8 lg:grid-cols-2 lg:items-end transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Core Capabilities</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Powering your pull request workflows
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              CodeSense offers a clean, custom dashboard to manage your repository reviews without complex third-party platforms.
            </p>
          </div>
          <div className="text-left lg:text-right text-sm text-muted-foreground sm:text-base max-w-md">
            <p>
              Get precise AI feedback tailored to your exact coding guidelines, using the models you choose, running where you want.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={cn(
                "group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_-16px_var(--color-accent-soft)] hover:border-[var(--color-border-strong)]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: isVisible ? `${300 + index * 150}ms` : "0ms" }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-strong),var(--color-success))] opacity-80 transition-all duration-500 group-hover:h-1.5" />
              <div className="relative space-y-5 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted shadow-[var(--shadow-surface)] transition-all duration-300 group-hover:shadow-[0_0_20px_-8px_var(--color-accent-soft)] group-hover:bg-accent">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
