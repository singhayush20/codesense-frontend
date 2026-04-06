import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export default function Cta() {
  return (
    <SectionWrapper className="border-t border-border/70">
      <Container>
        <div className="rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,var(--color-surface-elevated),var(--color-bg-secondary))] p-10 shadow-[var(--shadow-surface)]">
          <div className="space-y-4 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Ready to evolve your review workflow?</p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Join 40,000+ developers scaling their architecture vision.
            </h2>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
