"use client";

import { Package, Brain, Cloud, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AvailableProviderInfo, ProviderType } from "@/modules/llm/types/llm.types";

interface AvailableProvidersProps {
  selectedProvider: ProviderType | null;
  onSelectProvider: (providerType: ProviderType | null) => void;
  onAddKey: () => void;
  isLoading: boolean;
}

const AVAILABLE_PROVIDERS: AvailableProviderInfo[] = [
  {
    id: ProviderType.OLLAMA,
    name: "Ollama",
    description: "Run powerful large language models locally with a simple, unified interface.",
    icon: "🏠",
    category: "LOCAL ENGINE",
  },
  {
    id: ProviderType.GEMINI,
    name: "Gemini",
    description: "Google's most capable AI model for highly complex multi-modal tasks.",
    icon: "✨",
    category: "CLOUD API",
  },
  {
    id: ProviderType.BEDROCK,
    name: "AWS Bedrock",
    description: "Build generative AI applications on AWS with foundational models via API.",
    icon: "📦",
    category: "ENTERPRISE",
  },
  {
    id: ProviderType.NVIDIA,
    name: "Nvidia",
    description: "Optimized LLM inference endpoints utilizing Nvidia's massive GPU clusters.",
    icon: "⚡",
    category: "GPU NATIVE",
  },
];

export function AvailableProviders({
  selectedProvider,
  onSelectProvider,
  onAddKey,
  isLoading,
}: AvailableProvidersProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Available Providers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a provider to add a new configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AVAILABLE_PROVIDERS.map((provider) => {
          const isSelected = selectedProvider === provider.id;
          return (
            <button
              key={provider.id}
              onClick={() => onSelectProvider(isSelected ? null : provider.id as ProviderType)}
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border/70 bg-card/50 hover:border-border hover:bg-card/70"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-3xl mb-2">{provider.icon}</div>
                    <h3 className="font-semibold text-foreground">{provider.name}</h3>
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                      {provider.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    {provider.category}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-0 right-0 size-1 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {selectedProvider && (
        <div className="flex justify-end pt-2">
          <Button onClick={onAddKey} disabled={isLoading} className="gap-2">
            Add Key
          </Button>
        </div>
      )}
    </div>
  );
}
