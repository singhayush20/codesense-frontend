import { Activity, Brain, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const metrics = [
  {
    title: "Rapid Triage",
    description: "Instantly surface architecture risks, syntax issues, and logic gaps before they reach your team.",
    icon: <Activity className="h-5 w-5 text-violet-300" />,
  },
  {
    title: "Semantic Depth",
    description: "Beyond surface fixes — analyze intent, architectural integrity, and long-term maintainability.",
    icon: <Brain className="h-5 w-5 text-sky-300" />,
  },
  {
    title: "Zero-Day Security",
    description: "Automated vulnerability scanning that understands context, reduces false positives, and enforces safety.",
    icon: <ShieldCheck className="h-5 w-5 text-emerald-300" />,
  },
];

export default function Metrics() {
  return (
    <SectionWrapper className="border-t border-white/10">
      <Container className="space-y-12">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">The impact</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Elite Efficiency. Lower Cognitive Load.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            CodeSense reduces review friction by combining architectural analysis with semantic understanding so teams can move faster without sacrificing quality.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.title} className="space-y-5 bg-slate-950/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/80 ring-1 ring-white/10">
                {metric.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">{metric.title}</h3>
                <p className="text-sm leading-6 text-slate-400">{metric.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Highlight</p>
          <p className="mt-4 text-4xl font-semibold text-white sm:text-5xl">60–70% reduction in review time</p>
        </div>
      </Container>
    </SectionWrapper>
  );
}
