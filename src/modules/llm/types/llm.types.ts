export enum ProviderType {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  GEMINI = "gemini",
  BEDROCK = "bedrock",
  OLLAMA = "ollama",
  NVIDIA = "nvidia",
}

export interface LLMProvider {
  id: string;
  providerType: ProviderType;
  displayName: string;
  isActive: boolean;
  isValid: boolean;
  keyFingerprint: string;
}

export interface LLMProviderGroup {
  providerType: ProviderType;
  providers: LLMProvider[];
}

export interface LLMProvidersResponse {
  providerType: ProviderType;
  providers: LLMProvider[];
}

export interface AddLLMProviderRequest {
  providerType: ProviderType;
  displayName: string;
  apiKey: string;
  baseUrl?: string;
}

export interface AddLLMProviderResponse {
  id: string;
  providerType: ProviderType;
  displayName: string;
  isActive: boolean;
  isValid: boolean;
  keyFingerprint: string;
}

export interface AvailableProviderInfo {
  id: ProviderType;
  name: string;
  description: string;
  icon: string;
  category: string;
}
