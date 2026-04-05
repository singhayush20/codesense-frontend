import { Container } from "@/components/ui/container";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export default function CTA() {
  return (
    <SectionWrapper className="border-t border-white/10">
      <Container>
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 p-10 shadow-2xl shadow-slate-950/40">
          <div className="space-y-4 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Ready to evolve your review workflow?</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Join 40,000+ developers scaling their architecture vision.
            </h2>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
