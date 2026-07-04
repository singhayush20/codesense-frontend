import { GitBranch, Shield, Sliders, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const steps = [
  {
    title: "1. Authenticate",
    description: "Sign in securely via Google OAuth and link your GitHub account to access your repositories.",
    icon: <Shield className="h-5 w-5 text-primary" />,
  },
  {
    title: "2. Configure LLMs",
    description: "Add your API credentials for Gemini, Ollama, AWS Bedrock, or Nvidia in the LLM settings.",
    icon: <Sliders className="h-5 w-5 text-[var(--color-accent-strong)]" />,
  },
  {
    title: "3. Choose Repositories",
    description: "Select which repositories to monitor, select the preferred AI model, and customize prompt guidelines.",
    icon: <GitBranch className="h-5 w-5 text-[var(--color-success)]" />,
  },
  {
    title: "4. Receive Reviews",
    description: "Open pull requests and get inline reviews, code suggestions, and severity ratings directly in the dashboard.",
    icon: <Sparkles className="h-5 w-5 text-[var(--color-warning)]" />,
  },
];

export default function Workflow() {
  return (
    <SectionWrapper id="how-it-works" className="border-t border-border/70 relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 bottom-0 h-80 w-80 rounded-full bg-[var(--color-accent-soft)] blur-3xl opacity-50" />
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">The Flow</p>
          <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Simple, Localized Setup
          </h2>
          <p className="text-muted-foreground text-lg">
            Follow four basic steps to configure your personal code review environment.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} className="flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/70">
                  {step.icon}
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <span>Step {index + 1} of 4</span>
                <span aria-hidden="true">-&gt;</span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
