import { Code2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const codeExample = `// pull request review
const review = await analyzeRepository({
  repo: "codesense-ai/codex",
  branch: "main",
});

if (review.issues.length > 0) {
  review.comments.forEach((comment) => {
    console.log(comment.suggestion);
  });
}
`;

export default function Hero() {
  return (
    <SectionWrapper className="relative overflow-hidden pb-6 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,var(--color-accent-soft),transparent_52%)]" />
      <Container className="relative">
        <div className="grid min-w-0 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl min-w-0">
            <Badge className="mb-6">Two intelligent GPT-4o agents</Badge>
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span>AI-powered code review</span>
                </div>
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  The Digital{" "}
                  <span className="bg-[linear-gradient(120deg,var(--color-accent),var(--color-accent-strong),var(--color-accent))] bg-clip-text text-transparent">
                    Architect
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  Precision-engineered AI-assisted code review built for architecture-first teams. Ship clean, scalable systems with confidence and lower review overhead.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] text-[var(--color-accent-foreground)] shadow-[var(--shadow-accent)] hover:brightness-105 sm:w-auto"
                >
                  Start Free with GitHub
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full border-border bg-card/70 text-foreground hover:bg-muted sm:w-auto"
                >
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="max-w-full rounded-[2rem] border border-border/70 bg-card/75 p-1 shadow-[var(--shadow-surface)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.75rem] bg-[var(--color-bg-secondary)]">
                <div className="flex items-center gap-3 border-b border-border/70 bg-background/90 px-3 py-3 sm:px-5 sm:py-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-warning)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
                  <span className="ml-auto text-xs uppercase tracking-[0.24em] text-muted-foreground">architect.ts</span>
                </div>
                <div className="space-y-4 px-3 py-4 sm:px-5 sm:py-6">
                  <div className="rounded-3xl bg-background/80 p-3 sm:p-5">
                    <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span>Code editor</span>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-[0.28em] text-foreground">Live</span>
                    </div>
                    <pre className="max-w-full overflow-x-auto text-sm leading-7 text-foreground">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-card/85 p-3 shadow-[var(--shadow-surface)] sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">AI architectural insight</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Refactor this module for clearer dependency flow and fewer global side effects.
                        </p>
                      </div>
                      <Code2 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-8 top-10 hidden h-40 w-40 rounded-full bg-[var(--color-accent-soft)] blur-3xl lg:block" />
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
