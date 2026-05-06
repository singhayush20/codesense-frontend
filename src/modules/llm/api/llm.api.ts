"use client";

import { apiFetch } from "@/lib/api";
import type {
  AddLLMProviderRequest,
  AddLLMProviderResponse,
  LLMProviderGroup,
} from "@/modules/llm/types/llm.types";

const LLM_API_BASE = "/api/v1/llm";

class LLMApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "LLMApiError";
  }
}

async function parseJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message
        : fallbackMessage;

    throw new LLMApiError(message, response.status);
  }

  return body as T;
}

export const llmApi = {
  async getProviders(): Promise<LLMProviderGroup[]> {
    const response = await apiFetch(`${LLM_API_BASE}/providers`);
    const data = await parseJsonResponse<LLMProviderGroup | LLMProviderGroup[]>(
      response,
      "Unable to load LLM providers.",
    );

    // Handle both single object and array responses
    const providers = Array.isArray(data) ? data : [data];
    return providers;
  },

  async createProvider(request: Omit<AddLLMProviderRequest, "apiKey">): Promise<AddLLMProviderResponse> {
    const response = await apiFetch(`${LLM_API_BASE}/providers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    return parseJsonResponse<AddLLMProviderResponse>(
      response,
      "Failed to create LLM provider. Please try again.",
    );
  },

  async addCredentials(providerId: string, apiKey: string): Promise<{ success: boolean }> {
    const response = await apiFetch(`${LLM_API_BASE}/providers/${providerId}/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        config: {
          apiKey,
        },
      }),
    });

    return parseJsonResponse<{ success: boolean }>(
      response,
      "Failed to add API key. Please check your key and try again.",
    );
  },

  async removeProvider(providerId: string): Promise<{ success: boolean }> {
    const response = await apiFetch(`${LLM_API_BASE}/providers/${providerId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new LLMApiError("Failed to remove LLM provider.", response.status);
    }

    return parseJsonResponse<{ success: boolean }>(
      response,
      "Failed to remove provider.",
    );
  },
};
