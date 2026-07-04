import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { routes } from "@/config/routes";

export default function Cta() {
  return (
    <SectionWrapper className="border-t border-border/70">
      <Container>
        <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,var(--color-surface-elevated),var(--color-bg-secondary))] p-8 md:p-12 shadow-[var(--shadow-surface)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-4 max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Ready to get started?</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Take control of your code reviews today
              </h2>
              <p className="text-muted-foreground text-base">
                Connect CodeSense to your GitHub repositories and start receiving instant, configurable AI code feedback with Gemini, Ollama, AWS Bedrock, or Nvidia NIM.
              </p>
            </div>
            <div className="shrink-0">
              <Link href={routes.public.login}>
                <Button
                  size="lg"
                  className="rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] px-8 py-6 text-[var(--color-accent-foreground)] shadow-[var(--shadow-accent)] hover:brightness-105"
                >
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
