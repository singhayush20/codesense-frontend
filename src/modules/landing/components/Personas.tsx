import { CheckCircle2, User, Users2, Wand2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const personas = [
  {
    title: "The High-Pass Filter",
    subtitle: "For senior engineers",
    icon: <User className="h-5 w-5 text-primary" />,
    points: [
      "Eliminate repetitive feedback on basic code hygiene.",
      "Focus reviews on architecture and system design.",
      "Automate documentation and custom guardrails.",
    ],
  },
  {
    title: "The Private Mentor",
    subtitle: "For junior developers",
    icon: <Wand2 className="h-5 w-5 text-[var(--color-accent-strong)]" />,
    points: [
      "Receive real-time guidance without slowing the team.",
      "Turn feedback into learning moments for every PR.",
      "Support better code decisions before review.",
    ],
  },
  {
    title: "The Velocity Engine",
    subtitle: "For teams and orgs",
    icon: <Users2 className="h-5 w-5 text-[var(--color-success)]" />,
    points: [
      "Visualize PR bottlenecks and team-level quality trends.",
      "Ensure consistent architecture across services.",
      "Dramatically reduce time-to-merge.",
    ],
  },
];

export default function Personas() {
  return (
    <SectionWrapper className="border-t border-border/70">
      <Container className="space-y-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Designed for all teams</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            One Platform. Three Perspectives.
          </h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {personas.map((persona) => (
            <Card key={persona.title} className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 rounded-3xl bg-muted px-4 py-3 text-foreground">
                  {persona.icon}
                  <div>
                    <p className="font-semibold text-foreground">{persona.title}</p>
                    <p className="text-sm text-muted-foreground">{persona.subtitle}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {persona.points.map((point) => (
                  <div key={point} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
