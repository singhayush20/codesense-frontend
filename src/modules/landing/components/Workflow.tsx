import { ArrowRightCircle, GitPullRequest, MessageCircle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const steps = [
  {
    title: "Push PR",
    description: "Open a pull request and let the architecture review begin.",
    icon: <GitPullRequest className="h-5 w-5 text-primary" />,
  },
  {
    title: "AI Analysis",
    description: "Specialized agents inspect design, dependencies, and intent.",
    icon: <MessageCircle className="h-5 w-5 text-[var(--color-accent-strong)]" />,
  },
  {
    title: "Auto Feedback",
    description: "Actionable guidance lands directly in review threads.",
    icon: <ArrowRightCircle className="h-5 w-5 text-[var(--color-success)]" />,
  },
  {
    title: "Final Approval",
    description: "Merge with confidence after architecture, security, and quality are validated.",
    icon: <ShieldCheck className="h-5 w-5 text-[var(--color-warning)]" />,
  },
];

export default function Workflow() {
  return (
    <SectionWrapper className="border-t border-border/70">
      <Container className="space-y-10">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">The process</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Architectural Workflow
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} className="space-y-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-muted ring-1 ring-border/70">
                {step.icon}
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-foreground">{step.title}</p>
                <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <span>Step {index + 1}</span>
                <span aria-hidden="true">-&gt;</span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
