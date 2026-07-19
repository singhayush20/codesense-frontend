"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { routes } from "@/config/routes";

const codeExample = `@@ -12,5 +12,5 @@ export async function fetchUserData(userId: string) {
-  const response = fetch(\`/api/users/\${userId}\`);
+  const response = await fetch(\`/api/users/\${userId}\`);
   return response.json();
 }`;

export default function Hero() {
  return (
    <SectionWrapper className="relative overflow-hidden pb-6 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,var(--color-accent-soft),transparent_52%)] animate-glow-pulse" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up">
              <Badge className="mb-6">Open & Customizable Code Reviews</Badge>
            </div>
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="animate-fade-in-up animate-delay-100 flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span>GitHub Integration & Configurable Models</span>
                </div>
                <h1 className="animate-fade-in-up animate-delay-200 max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  AI Code Reviews{" "}
                  <span className="animate-gradient bg-[linear-gradient(120deg,var(--color-accent),var(--color-accent-strong),var(--color-accent),var(--color-accent-strong))] bg-clip-text text-transparent">
                    On Your Terms
                  </span>
                </h1>
                <p className="animate-fade-in-up animate-delay-300 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  CodeSense connects to your repositories and reviews pull requests using your own LLM API keys. Bring Gemini, Ollama, AWS Bedrock, or Nvidia, and configure custom prompts to match your standards.
                </p>
              </div>

              <div className="animate-fade-in-up animate-delay-400 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href={routes.public.login} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group w-full rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] text-[var(--color-accent-foreground)] shadow-[var(--shadow-accent)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_40px_-12px_var(--color-accent-strong)] active:scale-95"
                  >
                    <span className="inline-flex items-center gap-2">
                      Get Started
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </Button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full border-border bg-card/70 text-foreground transition-all duration-300 hover:bg-muted hover:border-[var(--color-border-strong)] active:scale-95"
                  >
                    Learn How It Works
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-500 relative hidden lg:block">
            <div className="animate-border-glow max-w-full rounded-[2rem] border border-border/70 bg-card/75 p-1 shadow-[var(--shadow-surface)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_60px_-24px_var(--color-accent-strong)]">
              <div className="overflow-hidden rounded-[1.75rem] bg-[var(--color-bg-secondary)]">
                <div className="flex items-center gap-3 border-b border-border/70 bg-background/90 px-3 py-3 sm:px-5 sm:py-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="ml-auto text-xs uppercase tracking-[0.24em] text-muted-foreground">pull_request_diff.patch</span>
                </div>
                <div className="space-y-4 px-3 py-4 sm:px-5 sm:py-6">
                  <div className="rounded-3xl bg-background/80 p-3 sm:p-5 font-mono transition-all duration-300 hover:bg-background/95">
                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground font-sans">
                      <span>Git Diff View</span>
                      <span className="rounded-full bg-muted px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-foreground">API CLIENT</span>
                    </div>
                    <pre className="max-w-full overflow-x-auto text-xs leading-5 text-foreground">
                      <code className="animate-fade-in text-red-500 block" style={{ animationDelay: '700ms' }}>{codeExample.split('\n')[0]}</code>
                      <code className="animate-fade-in text-red-500 bg-red-500/10 block" style={{ animationDelay: '800ms' }}>{codeExample.split('\n')[1]}</code>
                      <code className="animate-fade-in text-emerald-500 bg-emerald-500/10 block" style={{ animationDelay: '900ms' }}>{codeExample.split('\n')[2]}</code>
                      <code className="animate-fade-in text-foreground block" style={{ animationDelay: '1000ms' }}>{codeExample.split('\n')[3]}</code>
                    </pre>
                  </div>
                  <div className="group rounded-3xl border border-border/70 bg-card/85 p-3 shadow-[var(--shadow-surface)] sm:p-5 transition-all duration-300 hover:border-[var(--color-accent-soft)] hover:bg-card/95 hover:shadow-[0_0_30px_-16px_var(--color-accent-soft)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">CodeSense AI (Gemini 2.5 Flash)</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Line 13 • Missing await keyword</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          Since <code className="rounded bg-muted px-1 py-0.5 text-xs">fetch</code> is an asynchronous function returning a Promise, you must await its resolution before parsing it as JSON.
                        </p>
                      </div>
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5 animate-spin-slow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-8 top-10 hidden h-40 w-40 rounded-full bg-[var(--color-accent-soft)] blur-3xl lg:block animate-float" />
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
