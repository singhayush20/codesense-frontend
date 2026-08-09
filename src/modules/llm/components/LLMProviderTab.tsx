"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useLLM } from "@/modules/llm/hooks/useLLM";
import { AvailableProviders } from "@/modules/llm/components/AvailableProviders";
import { ConfiguredProviders } from "@/modules/llm/components/ConfiguredProviders";
import { AddKeyDialog } from "@/modules/llm/components/AddKeyDialog";
import type { ProviderType } from "@/modules/llm/types/llm.types";

const PROVIDER_NAMES: Record<ProviderType, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  gemini: "Gemini",
  bedrock: "AWS Bedrock",
  ollama: "Ollama",
  nvidia: "Nvidia",
};

export function LLMProviderTab() {
  const hasRequestedProviders = useRef(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(null);
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false);

  const {
    providerGroups,
    hasLoadedProviders,
    isLoadingProviders,
    isAddingProvider,
    isRemovingProvider,
    error,
    loadProviders,
    addProvider,
    removeProvider,
  } = useLLM();

  useEffect(() => {
    if (hasRequestedProviders.current) {
      return;
    }

    hasRequestedProviders.current = true;
    void loadProviders();
  }, [loadProviders]);

  const handleAddKey = () => {
    if (selectedProvider) {
      setIsAddKeyDialogOpen(true);
    }
  };

  const handleAddKeySubmit = async (displayName: string, apiKey: string, baseUrl?: string, region?: string) => {
    if (!selectedProvider) return;

    const success = await addProvider(selectedProvider, displayName, apiKey, baseUrl, region);

    if (success) {
      setSelectedProvider(null);
    }
  };

  const handleRemoveProvider = async (providerId: string) => {
    await removeProvider(providerId);
  };

  if (!hasLoadedProviders || isLoadingProviders) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="space-y-4">
          <div className="h-40 w-full animate-pulse rounded-[2rem] border border-border/70 bg-card/70" />
          <div className="h-60 w-full animate-pulse rounded-[2rem] border border-border/70 bg-card/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {error && (
        <Card className="rounded-2xl p-4 text-sm text-muted-foreground hover:translate-y-0">
          {error}
        </Card>
      )}

      {/* Available Providers Section */}
      <Card className="rounded-2xl hover:translate-y-0">
        <AvailableProviders
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
          onAddKey={handleAddKey}
          isLoading={isAddingProvider}
        />
      </Card>

      {/* Configured Providers Section */}
      <Card className="rounded-2xl hover:translate-y-0">
        <ConfiguredProviders
          providerGroups={providerGroups}
          onRemove={handleRemoveProvider}
          isRemoving={isRemovingProvider}
        />
      </Card>

      {/* Add Key Dialog */}
      <AddKeyDialog
        isOpen={isAddKeyDialogOpen}
        onClose={() => setIsAddKeyDialogOpen(false)}
        onSubmit={handleAddKeySubmit}
        providerName={selectedProvider ? PROVIDER_NAMES[selectedProvider] : ""}
        providerType={selectedProvider || undefined}
        isLoading={isAddingProvider}
      />
    </div>
  );
}
