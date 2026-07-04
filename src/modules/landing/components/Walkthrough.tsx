"use client";

import { useState } from "react";
import { CheckCircle2, Eye, GitBranch, Lock, Sliders, Sparkles, Terminal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

type TabId = "repos" | "prompts" | "diffs";

export default function Walkthrough() {
  const [activeTab, setActiveTab] = useState<TabId>("repos");

  return (
    <SectionWrapper id="how-it-works" className="border-t border-border/70 relative overflow-hidden bg-background">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_right,var(--color-accent-soft),transparent_70%)] opacity-60" />
      <div className="pointer-events-none absolute left-0 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_left,var(--color-accent-soft),transparent_70%)] opacity-40" />

      <Container className="space-y-16">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">How It Works</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Inside the CodeSense Cockpit
          </h2>
          <p className="text-muted-foreground text-lg sm:text-xl">
            Take a tour of CodeSense. Configure repositories, write rules, and review PRs using a clean, developer-first dashboard.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-col items-center space-y-8">
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-full border border-border/70 bg-card/60 p-1.5 backdrop-blur-xl shadow-lg w-full max-w-2xl">
            <button
              onClick={() => setActiveTab("repos")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "repos"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <GitBranch className="h-4 w-4" />
              <span>1. Repository Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("prompts")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "prompts"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>2. Prompt Customizer</span>
            </button>
            <button
              onClick={() => setActiveTab("diffs")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "diffs"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>3. Diff Inspector</span>
            </button>
          </div>

          {/* Interactive Screen Display */}
          <div className="w-full max-w-5xl rounded-3xl border border-border/70 bg-card/60 p-2 shadow-2xl backdrop-blur-xl">
            <div className="overflow-hidden rounded-2xl bg-[var(--color-bg-secondary)] border border-border/40 min-h-[380px] flex flex-col md:flex-row">
              {/* Left Explainer */}
              <div className="p-8 md:w-1/3 flex flex-col justify-center space-y-4 border-b md:border-b-0 md:border-r border-border/40 bg-card/30">
                {activeTab === "repos" && (
                  <>
                    <h3 className="text-2xl font-bold text-foreground">Sync & Monitor</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Connect your GitHub account. Instantly browse your repositories and select which ones you want to enable for review. CodeSense tracks incoming pull requests automatically.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Direct GitHub API sync</span>
                    </div>
                  </>
                )}
                {activeTab === "prompts" && (
                  <>
                    <h3 className="text-2xl font-bold text-foreground">Write the Rules</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      No two projects are alike. Set custom system instructions per repository to ensure the AI focuses on what matters—be it Clean Architecture, React hooks optimization, or strict API security.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Model-agnostic tuning</span>
                    </div>
                  </>
                )}
                {activeTab === "diffs" && (
                  <>
                    <h3 className="text-2xl font-bold text-foreground">Sleek Diff Reviews</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      View code changes alongside detailed AI recommendations. Comments show exact suggestions, line annotations, and code blocks you can copy and apply directly.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Inline suggestions</span>
                    </div>
                  </>
                )}
              </div>

              {/* Right Interface Mockup */}
              <div className="p-6 md:w-2/3 flex items-center justify-center bg-background/50 font-mono text-xs">
                {activeTab === "repos" && (
                  <div className="w-full space-y-4 font-sans">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="font-semibold text-sm text-foreground">Your Repositories</span>
                      <span className="text-xs text-muted-foreground">3 synchronized</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "myorg/api-service", model: "Gemini 2.5 Pro", active: true },
                        { name: "myorg/nextjs-frontend", model: "Ollama (Llama 3)", active: true },
                        { name: "personal/blog-template", model: "Not Selected", active: false },
                      ].map((repo) => (
                        <div
                          key={repo.name}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card/65"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">{repo.name}</p>
                            <p className="text-xs text-muted-foreground">Model: {repo.model}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${repo.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                            />
                            <span className="text-xs font-medium text-foreground">
                              {repo.active ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "prompts" && (
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 font-sans">
                      <span className="font-semibold text-sm text-foreground">Configure Rules (myorg/api-service)</span>
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-foreground">YAML</span>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4 text-xs font-mono text-muted-foreground space-y-1.5 leading-5 overflow-x-auto">
                      <p><span className="text-blue-500">review_guidelines:</span></p>
                      <p>&nbsp;&nbsp;<span className="text-blue-500">- focus_areas:</span> [architecture, security, performances]</p>
                      <p>&nbsp;&nbsp;<span className="text-blue-500">system_instructions:</span> |</p>
                      <p className="text-foreground/80">&nbsp;&nbsp;&nbsp;&nbsp;Ensure all HTTP endpoints implement rate-limiting.</p>
                      <p className="text-foreground/80">&nbsp;&nbsp;&nbsp;&nbsp;Check that SQL queries are parameterized to prevent injection.</p>
                      <p className="text-foreground/80">&nbsp;&nbsp;&nbsp;&nbsp;Recommend async/await optimizations for DB queries.</p>
                    </div>
                  </div>
                )}

                {activeTab === "diffs" && (
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 font-sans">
                      <span className="font-semibold text-sm text-foreground">File Diff: user.service.ts</span>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500">
                        +12 / -4
                      </span>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-3 font-mono space-y-2">
                      <div className="space-y-0.5 leading-relaxed text-[11px]">
                        <p className="text-red-500/80 bg-red-500/5">- const hash = md5(password);</p>
                        <p className="text-emerald-500 bg-emerald-500/10 font-bold font-mono">+ const hash = await bcrypt.hash(password, 10);</p>
                      </div>
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 font-sans space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-yellow-500">Warning (Security Audit)</span>
                          <span className="text-[10px] text-muted-foreground">Line 44</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          MD5 is cryptographically broken and vulnerable to collision attacks. Switching to bcrypt provides standard secure password hashing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Why CodeSense Value Props */}
      <Container id="why-codesense" className="border-t border-border/70 pt-20 sm:pt-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Value Proposition</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Why Developers Choose CodeSense
          </h2>
          <p className="text-muted-foreground text-lg">
            A developer-centric review workflow that respects your privacy, your wallet, and your git log.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card 1 */}
          <Card className="flex gap-5 items-start p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/70">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Strict Code Privacy</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your code is sent directly from your environment/GitHub to your selected LLM API endpoint. Your secrets remain yours. We never store, cache, or train models on your proprietary source code.
              </p>
            </div>
          </Card>

          {/* Card 2 */}
          <Card className="flex gap-5 items-start p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/70">
              <Sliders className="h-5 w-5 text-[var(--color-accent-strong)]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">100% Model Flexibility</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Don&apos;t get locked into a single AI provider. Swap LLMs in seconds—switch from Google Gemini in the cloud to a completely local Ollama instance running Llama 3 when reviewing sensitive datasets.
              </p>
            </div>
          </Card>

          {/* Card 3 */}
          <Card className="flex gap-5 items-start p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/70">
              <Terminal className="h-5 w-5 text-[var(--color-success)]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Zero PR Comment Bloat</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Review code changes within our purpose-built diff dashboard. Get comprehensive, high-density feedback in private without spamming your colleagues&apos; GitHub email notifications with hundreds of automated bot comments.
              </p>
            </div>
          </Card>

          {/* Card 4 */}
          <Card className="flex gap-5 items-start p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted ring-1 ring-border/70">
              <Eye className="h-5 w-5 text-[var(--color-warning)]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Context-Aware Guidelines</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Define separate review rules per repository. Enforce SOLID principles in backend repositories, performance optimizations in your frontend code, and secure sanitation on public-facing APIs.
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </SectionWrapper>
  );
}
