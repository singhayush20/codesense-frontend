import { ArrowRightCircle, GitPullRequest, MessageCircle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const steps = [
  {
    title: "Push PR",
    description: "Open a pull request and let the architecture review begin.",
    icon: <GitPullRequest className="h-5 w-5 text-violet-300" />,
  },
  {
    title: "AI Analysis",
    description: "Specialized agents inspect design, dependencies, and intent.",
    icon: <MessageCircle className="h-5 w-5 text-sky-300" />,
  },
  {
    title: "Auto Feedback",
    description: "Actionable guidance lands directly in review threads.",
    icon: <ArrowRightCircle className="h-5 w-5 text-emerald-300" />,
  },
  {
    title: "Final Approval",
    description: "Merge with confidence after architecture, security, and quality are validated.",
    icon: <ShieldCheck className="h-5 w-5 text-fuchsia-300" />,
  },
];

export default function Workflow() {
  return (
    <SectionWrapper className="border-t border-white/10">
      <Container className="space-y-10">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">The process</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Architectural Workflow
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} className="space-y-5 bg-slate-950/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/80 text-white ring-1 ring-white/10">
                {step.icon}
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-white">{step.title}</p>
                <p className="text-sm leading-6 text-slate-400">{step.description}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-violet-300">
                <span>Step {index + 1}</span>
                <span aria-hidden="true">→</span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
