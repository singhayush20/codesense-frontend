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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,var(--color-accent-soft),transparent_52%)]" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <Badge className="mb-6">Open & Customizable Code Reviews</Badge>
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span>GitHub Integration & Configurable Models</span>
                </div>
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  AI Code Reviews{" "}
                  <span className="bg-[linear-gradient(120deg,var(--color-accent),var(--color-accent-strong),var(--color-accent))] bg-clip-text text-transparent">
                    On Your Terms
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  CodeSense connects to your repositories and reviews pull requests using your own LLM API keys. Bring Gemini, Ollama, AWS Bedrock, or Nvidia, and configure custom prompts to match your standards.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href={routes.public.login} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full rounded-full bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] text-[var(--color-accent-foreground)] shadow-[var(--shadow-accent)] hover:brightness-105"
                  >
                    Get Started
                  </Button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full border-border bg-card/70 text-foreground hover:bg-muted"
                  >
                    Learn How It Works
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="max-w-full rounded-[2rem] border border-border/70 bg-card/75 p-1 shadow-[var(--shadow-surface)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.75rem] bg-[var(--color-bg-secondary)]">
                <div className="flex items-center gap-3 border-b border-border/70 bg-background/90 px-3 py-3 sm:px-5 sm:py-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="ml-auto text-xs uppercase tracking-[0.24em] text-muted-foreground">pull_request_diff.patch</span>
                </div>
                <div className="space-y-4 px-3 py-4 sm:px-5 sm:py-6">
                  <div className="rounded-3xl bg-background/80 p-3 sm:p-5 font-mono">
                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground font-sans">
                      <span>Git Diff View</span>
                      <span className="rounded-full bg-muted px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-foreground">API CLIENT</span>
                    </div>
                    <pre className="max-w-full overflow-x-auto text-xs leading-5 text-foreground">
                      <code className="text-red-500 block">{codeExample.split('\n')[0]}</code>
                      <code className="text-red-500 bg-red-500/10 block">{codeExample.split('\n')[1]}</code>
                      <code className="text-emerald-500 bg-emerald-500/10 block">{codeExample.split('\n')[2]}</code>
                      <code className="text-foreground block">{codeExample.split('\n')[3]}</code>
                    </pre>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-card/85 p-3 shadow-[var(--shadow-surface)] sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-sm font-semibold text-foreground">CodeSense AI (Gemini 2.5 Flash)</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Line 13 • Missing await keyword</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          Since <code className="rounded bg-muted px-1 py-0.5 text-xs">fetch</code> is an asynchronous function returning a Promise, you must await its resolution before parsing it as JSON.
                        </p>
                      </div>
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
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
