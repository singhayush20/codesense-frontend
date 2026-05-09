import type { LLMProviderGroup } from "@/modules/llm/types/llm.types";

interface RepositoryLLMConfig {
  repoId: string;
  providerId: string;
  providerType: string;
  displayName: string;
  model: string;
  isActive: boolean;
  isValid: boolean;
}

interface SaveLLMConfigRequest {
  providerId: string;
  model: string;
}

/**
 * Fetch all available LLM providers grouped by provider type
 */
export async function fetchLLMProviders(): Promise<LLMProviderGroup[]> {
  try {
    const response = await fetch("/api/v1/llm/providers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch providers: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Fetched providers:", data);

    // Handle both array and single object responses
    if (Array.isArray(data)) {
      return data;
    }

    // If it's a single object, wrap it in an array
    if (data && typeof data === "object" && data.providerType && data.providers) {
      return [data];
    }

    console.warn("Unexpected providers response format:", data);
    return [];
  } catch (error) {
    console.error("Error fetching LLM providers:", error);
    throw error;
  }
}

/**
 * Fetch the current LLM configuration for a repository
 */
export async function fetchRepositoryLLMConfig(
  repoId: string
): Promise<RepositoryLLMConfig | null> {
  try {
    const response = await fetch(`/api/v1/repos/${repoId}/llm-config`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle 404 - no config exists yet
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch config: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Fetched repository LLM config:", data);
    return data;
  } catch (error) {
    console.error("Error fetching repository LLM config:", error);
    throw error;
  }
}

/**
 * Save LLM configuration for a repository
 */
export async function saveRepositoryLLMConfig(
  repoId: string,
  config: SaveLLMConfigRequest
): Promise<RepositoryLLMConfig> {
  try {
    const response = await fetch(`/api/v1/repos/${repoId}/llm-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to save config: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Saved repository LLM config:", data);
    return data;
  } catch (error) {
    console.error("Error saving repository LLM config:", error);
    throw error;
  }
}
