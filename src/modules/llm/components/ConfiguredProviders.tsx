"use client";

import { ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { LLMProviderGroup, ProviderType } from "@/modules/llm/types/llm.types";

interface ConfiguredProvidersProps {
  providerGroups: LLMProviderGroup[];
  onRemove: (providerId: string) => Promise<void>;
  isRemoving: boolean;
}

const PROVIDER_NAMES: Record<ProviderType, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  gemini: "Gemini",
  bedrock: "AWS Bedrock",
  ollama: "Ollama",
  nvidia: "Nvidia",
};

export function ConfiguredProviders({
  providerGroups,
  onRemove,
  isRemoving,
}: ConfiguredProvidersProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<ProviderType>>(
    new Set(providerGroups.map((g) => g.providerType))
  );

  const toggleGroup = (providerType: ProviderType) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(providerType)) {
      newExpanded.delete(providerType);
    } else {
      newExpanded.add(providerType);
    }
    setExpandedGroups(newExpanded);
  };

  if (providerGroups.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Configured Providers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            No LLM providers configured yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Configured Providers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {providerGroups.reduce((acc, g) => acc + g.providers.length, 0)} provider
          {providerGroups.reduce((acc, g) => acc + g.providers.length, 0) !== 1 ? "s" : ""} connected.
        </p>
      </div>

      <div className="space-y-3">
        {providerGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.providerType);
          const providerCount = group.providers.length;

          return (
            <div
              key={group.providerType}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card/50 hover:bg-card/70 transition-colors"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.providerType)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {PROVIDER_NAMES[group.providerType]}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {providerCount} instance{providerCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`size-5 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Group Content */}
              {isExpanded && (
                <div className="border-t border-border/50 bg-muted/20 p-4 space-y-3">
                  {group.providers.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/70 p-4 hover:bg-card transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground truncate">
                            {provider.displayName}
                          </p>
                          {provider.isValid && (
                            <Badge className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 border-0">
                              Valid
                            </Badge>
                          )}
                          {!provider.isValid && (
                            <Badge className="text-xs bg-red-500/20 text-red-600 dark:text-red-400 border-0">
                              Invalid
                            </Badge>
                          )}
                          {provider.isActive && (
                            <Badge className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 border-0">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          ID: <code className="font-mono">{provider.id}</code>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Key Hash: <code className="font-mono">***{provider.keyFingerprint}</code>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(provider.id)}
                        disabled={isRemoving}
                        className="shrink-0"
                      >
                        <Trash2 className="size-4 text-destructive" />
                        <span className="sr-only">Remove provider</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
