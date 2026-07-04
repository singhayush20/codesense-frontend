import { Brain, Cloud, Cpu, Terminal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const providers = [
  {
    name: "Google Gemini",
    description: "Connect Gemini 2.5 Flash or Pro via Google Gemini API for cutting-edge code comprehension and speedy suggestions.",
    icon: <Brain className="h-6 w-6 text-blue-500" />,
    gradient: "from-blue-500/10 to-indigo-500/10",
    badge: "Cloud API",
  },
  {
    name: "Ollama",
    description: "Run code reviews 100% locally on your machine. Support for Llama 3, Mistral, and other local models.",
    icon: <Terminal className="h-6 w-6 text-amber-500" />,
    gradient: "from-amber-500/10 to-orange-500/10",
    badge: "Local / Offline",
  },
  {
    name: "AWS Bedrock",
    description: "Enterprise-grade access to hosted models like Claude and Llama with robust security controls.",
    icon: <Cloud className="h-6 w-6 text-sky-500" />,
    gradient: "from-sky-500/10 to-blue-500/10",
    badge: "Enterprise API",
  },
  {
    name: "Nvidia API",
    description: "Tap into high-speed GPU-accelerated LLM inference directly through the Nvidia NIM API.",
    icon: <Cpu className="h-6 w-6 text-emerald-500" />,
    gradient: "from-emerald-500/10 to-teal-500/10",
    badge: "High-Performance NIM",
  },
];

export default function Providers() {
  return (
    <SectionWrapper id="providers" className="border-t border-border/70 relative">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-96 bg-[radial-gradient(circle_at_right,var(--color-accent-soft),transparent_60%)]" />
      <Container className="space-y-12">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Integration & Choice</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Supported LLM Providers
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            CodeSense is model-agnostic. Configure custom prompts, choose different models per repository, and bring your own keys for your favorite providers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((provider) => (
            <Card key={provider.name} className="relative flex flex-col justify-between h-full space-y-6 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${provider.gradient} opacity-0 group-hover:opacity-100 transition duration-500`} />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/50">
                    {provider.icon}
                  </div>
                  <span className="rounded-full bg-muted/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {provider.badge}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{provider.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{provider.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
