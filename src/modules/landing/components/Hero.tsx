import { Code2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionWrapper } from "@/components/ui/section-wrapper";

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
    <SectionWrapper className="relative overflow-hidden pt-10 pb-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_50%)]" />
      <Container className="relative">
        <div className="grid min-w-0 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl min-w-0">
            <Badge className="mb-6">Two intelligent GPT-4o agents</Badge>
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-violet-300">
                  <Sparkles className="h-5 w-5" />
                  <span>AI-powered code review</span>
                </div>
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                  The Digital <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">Architect</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  Precision-engineered AI-assisted code review built for architecture-first teams. Ship clean, scalable systems with confidence and lower review overhead.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button size="lg" className="w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 sm:w-auto">
                  Start Free with GitHub
                </Button>
                <Button variant="outline" size="lg" className="w-full rounded-full border-white/10 text-slate-100 hover:bg-slate-800/80 sm:w-auto">
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="max-w-full rounded-[2rem] border border-white/10 bg-slate-950/75 p-1 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.75rem] bg-slate-950">
                <div className="flex items-center gap-3 border-b border-white/10 bg-slate-900 px-3 py-3 sm:px-5 sm:py-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-auto text-xs uppercase tracking-[0.24em] text-slate-500">architect.ts</span>
                </div>
                <div className="space-y-4 px-3 py-4 sm:px-5 sm:py-6">
                  <div className="rounded-3xl bg-slate-900/95 p-3 sm:p-5">
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
                      <span>Code editor</span>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">Live</span>
                    </div>
                    <pre className="max-w-full overflow-x-auto text-sm leading-7 text-slate-100">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/95 p-3 sm:p-5 shadow-inner shadow-slate-950/30">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">AI architectural insight</p>
                        <p className="mt-1 text-sm text-slate-400">Refactor this module for clearer dependency flow and fewer global side effects.</p>
                      </div>
                      <Code2 className="h-5 w-5 text-violet-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-8 top-10 hidden h-40 w-40 rounded-full bg-violet-500/20 blur-3xl lg:block" />
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
