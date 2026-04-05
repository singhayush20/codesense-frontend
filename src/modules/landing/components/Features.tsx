import { Box, Cpu, GitBranch, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const features = [
  {
    title: "Automated High-Cognition Reviews",
    description: "Receive architecture-aware feedback that prioritizes system design and long-term maintainability.",
    icon: <Box className="h-5 w-5 text-violet-300" />,
  },
  {
    title: "Multi-LLM Orchestration",
    description: "Orchestrate specialist agents for code quality, security, and architectural consistency.",
    icon: <Cpu className="h-5 w-5 text-sky-300" />,
  },
  {
    title: "Native GitHub Sync",
    description: "Deep integration with pull requests, branches, and review workflows for seamless onboarding.",
    icon: <GitBranch className="h-5 w-5 text-emerald-300" />,
  },
  {
    title: "Architectural Guardrails",
    description: "Enforce team standards automatically with rules that catch drift before merge.",
    icon: <Shield className="h-5 w-5 text-fuchsia-300" />,
  },
];

export default function Features() {
  return (
    <SectionWrapper id="features" className="border-t border-white/10">
      <Container className="space-y-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Engineered for Complexity</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Engineered for complexity, trusted by modern teams.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-400">
              Built to keep architecture coherent across fast-moving engineering teams with deep code context and actionable guidance.
            </p>
          </div>
          <div className="text-right text-sm text-slate-400 sm:text-base">
            <p>Every review is tuned for architecture, security, and developer velocity — so teams can ship faster without sacrificing long-term health.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="group relative overflow-hidden bg-slate-950/80 transition hover:bg-slate-900/95">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 opacity-70" />
              <div className="relative space-y-5 pt-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/80 text-white shadow-xl shadow-slate-950/40">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-6 text-slate-400">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
