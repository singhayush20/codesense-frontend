import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export default function CTA() {
  return (
    <SectionWrapper className="border-t border-white/10">
      <Container>
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 p-10 shadow-2xl shadow-slate-950/40">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Ready to evolve your review workflow?</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Join 40,000+ developers scaling their architecture vision.
              </h2>
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              <Button size="lg" className="w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 lg:w-auto">
                Start Free with GitHub
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
