"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { llmApi } from "@/modules/llm/api/llm.api";
import type {
  LLMProviderGroup,
  ProviderType,
} from "@/modules/llm/types/llm.types";

export function useLLM() {
  const { showSnackbar } = useAuth();
  const [providerGroups, setProviderGroups] = useState<LLMProviderGroup[]>([]);
  const [hasLoadedProviders, setHasLoadedProviders] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [isRemovingProvider, setIsRemovingProvider] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProviders = useCallback(async (): Promise<LLMProviderGroup[]> => {
    setIsLoadingProviders(true);
    setError(null);

    try {
      const providers = await llmApi.getProviders();
      setProviderGroups(providers);
      return providers;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "We could not load your LLM providers.";
      setError(message);
      showSnackbar(message);
      return [];
    } finally {
      setHasLoadedProviders(true);
      setIsLoadingProviders(false);
    }
  }, [showSnackbar]);

  const addProvider = useCallback(
    async (
      providerType: ProviderType,
      displayName: string,
      apiKey: string,
      baseUrl?: string,
    ): Promise<boolean> => {
      setIsAddingProvider(true);
      setError(null);

      try {
        // Step 1: Create provider
        const provider = await llmApi.createProvider({
          providerType,
          displayName,
        });

        // Step 2: Add credentials
        await llmApi.addCredentials(provider.id, apiKey, baseUrl);

        // Reload providers
        await loadProviders();
        showSnackbar("LLM provider added successfully.");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to add LLM provider. Please try again.";
        setError(message);
        showSnackbar(message);
        return false;
      } finally {
        setIsAddingProvider(false);
      }
    },
    [loadProviders, showSnackbar],
  );

  const removeProvider = useCallback(
    async (providerId: string): Promise<boolean> => {
      setIsRemovingProvider(true);
      setError(null);

      try {
        await llmApi.removeProvider(providerId);
        await loadProviders();
        showSnackbar("LLM provider removed successfully.");
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to remove LLM provider. Please try again.";
        setError(message);
        showSnackbar(message);
        return false;
      } finally {
        setIsRemovingProvider(false);
      }
    },
    [loadProviders, showSnackbar],
  );

  return {
    providerGroups,
    hasLoadedProviders,
    isLoadingProviders,
    isAddingProvider,
    isRemovingProvider,
    error,
    loadProviders,
    addProvider,
    removeProvider,
  };
}
