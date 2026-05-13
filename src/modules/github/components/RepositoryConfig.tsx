"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Loader2, Edit2, X, PlusCircle, ArrowLeft } from "lucide-react";
import type { GithubRepository } from "../types/github.types";
import type { LLMProviderGroup } from "@/modules/llm/types/llm.types";
import { llmApi } from "@/modules/llm/api/llm.api";
import { DeleteConfigConfirmDialog } from "./DeleteConfigConfirmDialog";
import { RepositoryPullRequests } from "./RepositoryPullRequests";

interface RepositoryLLMConfig {
  repoId: string;
  providerId: string;
  providerType: string;
  displayName: string;
  model: string;
  isActive: boolean;
  isValid: boolean;
}

interface RepositoryConfigProps {
  repository: GithubRepository;
  onCancel?: () => void;
}

type TabType = "overview" | "pull-requests" | "settings";

export function RepositoryConfig({
  repository,
  onCancel,
}: RepositoryConfigProps) {
  const [activeTab, setActiveTab] = useState<TabType>("settings");
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Current config state
  const [currentConfig, setCurrentConfig] = useState<RepositoryLLMConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  // Available providers
  const [providers, setProviders] = useState<LLMProviderGroup[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [providersError, setProvidersError] = useState<string | null>(null);

  // Edit form state
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelNameError, setModelNameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch available providers
  useEffect(() => {
    const loadProviders = async () => {
      setIsLoadingProviders(true);
      setProvidersError(null);
      try {
        const data = await llmApi.getProviders();
        console.log("Providers loaded successfully:", data);
        setProviders(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load providers";
        console.error("Error loading providers:", message);
        setProvidersError(message);
        setProviders([]);
      } finally {
        setIsLoadingProviders(false);
      }
    };

    loadProviders();
  }, []);

  // Fetch current config for this repository
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoadingConfig(true);
      setConfigError(null);
      try {
        const data = await llmApi.getRepositoryLLMConfig(repository.id);
        console.log("Repository LLM config loaded:", data);
        setCurrentConfig(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load configuration";
        console.error("Error loading config:", message);
        setConfigError(message);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    loadConfig();
  }, [repository.id]);

  // Initialize edit form with current config
  useEffect(() => {
    if (isEditMode && currentConfig) {
      setSelectedProviderId(currentConfig.providerId);
      setModelName(currentConfig.model);
    } else if (isEditMode && !currentConfig) {
      setSelectedProviderId("");
      setModelName("");
    }
  }, [isEditMode, currentConfig]);

  const handleModelNameChange = (value: string) => {
    setModelName(value);
    if (value.trim()) {
      setModelNameError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!modelName.trim()) {
      setModelNameError("Model name is required");
      return false;
    }
    if (!selectedProviderId) {
      setModelNameError("Provider is required");
      return false;
    }
    setModelNameError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const savedConfig = await llmApi.saveRepositoryLLMConfig(repository.id, {
        providerId: selectedProviderId,
        model: modelName,
      });
      console.log("Configuration saved successfully:", savedConfig);
      setCurrentConfig(savedConfig);
      setIsEditMode(false);
      // Show success message here if you have a toast notification system
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save configuration";
      console.error("Error saving config:", message);
      setModelNameError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await llmApi.deleteRepositoryLLMConfig(repository.id);
      console.log("Configuration deleted successfully");
      setCurrentConfig(null);
      setIsEditMode(false);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete configuration";
      console.error("Error deleting config:", message);
      // You could set an error state here to show to the user
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setModelNameError(null);
    } else {
      onCancel?.();
    }
  };

  const handleChangeClick = () => {
    setIsEditMode(true);
  };

  const formatProviderType = (type?: string) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Check if form values have changed
  const hasChanges =
    isEditMode &&
    (selectedProviderId !== (currentConfig?.providerId ?? "") ||
      modelName !== (currentConfig?.model ?? ""));

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "pull-requests", label: "Pull Requests" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border/70 bg-card/40 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="size-10 rounded-full transition-colors hover:bg-muted"
              title="Go back"
            >
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {repository.name}
            </h1>
            <p className="text-sm text-muted-foreground">{repository.fullName}</p>
          </div>
          <div className="ml-auto">
            <Badge
              className={cn(
                "uppercase",
                repository.isPrivate
                  ? "border-red-500/30 bg-red-500/15 text-red-600 dark:text-red-400"
                  : "border-green-500/30 bg-green-500/15 text-green-600 dark:text-green-400"
              )}
            >
              {repository.isPrivate ? "Private" : "Public"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-border/70 bg-card/20">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 border-b-2 px-6 py-4 text-center font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Overview content will be displayed here.
            </p>
          </div>
        )}

        {activeTab === "pull-requests" && (
          <RepositoryPullRequests repositoryId={repository.id} />
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            {isLoadingConfig ? (
              <Card className="flex h-48 items-center justify-center border-0 bg-muted/30 shadow-none">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading configuration...
                  </p>
                </div>
              </Card>
            ) : configError ? (
              <Card className="border-0 border-red-500/30 bg-red-500/10 p-6 shadow-none">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {configError}
                </p>
              </Card>
            ) : !isEditMode && currentConfig?.providerId ? (
              // Display Mode - Show current config
              <Card className="space-y-4 border-0 bg-muted/30 p-6 shadow-none">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      LLM Provider
                    </label>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {currentConfig.displayName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatProviderType(currentConfig.providerType)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Model
                    </label>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {currentConfig.model}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentConfig.isValid && (
                      <Badge className="border-green-500/30 bg-green-500/15 text-green-600 dark:text-green-400 text-xs">
                        Valid
                      </Badge>
                    )}
                    {currentConfig.isActive && (
                      <Badge className="bg-primary/20 text-primary text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleChangeClick}
                    className="gap-2"
                  >
                    <Edit2 className="size-4" />
                    Change Configuration
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting}
                    className="gap-2 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                  >
                    <X className="size-4" />
                    Delete Configuration
                  </Button>
                </div>
              </Card>
            ) : !isEditMode ? (
              // No config - Show setup view
              <Card className="flex flex-col items-center justify-center gap-4 border-0 bg-muted/30 py-12 text-center shadow-none">
                <div className="rounded-full bg-primary/10 p-4 text-primary">
                  <PlusCircle className="size-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Add LLM provider for the repository
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Select a language model provider and specify a model to enable
                    automated code reviews and AI features for this repository.
                  </p>
                </div>
                <Button
                  variant="default"
                  onClick={handleChangeClick}
                  className="mt-2 gap-2"
                >
                  <PlusCircle className="size-4" />
                  Configure LLM
                </Button>
              </Card>
            ) : (
              // Edit Mode
              <Card className="space-y-4 border-0 bg-muted/30 p-6 shadow-none">
                {providersError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {providersError}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-foreground">
                    LLM Provider
                  </label>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Select the primary language model engine used for automated code
                    review and generation within this repository.
                  </p>
                  <select
                    value={selectedProviderId}
                    onChange={(e) => setSelectedProviderId(e.target.value)}
                    disabled={isLoadingProviders || providersError !== null}
                    className={cn(
                      "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
                      "cursor-pointer"
                    )}
                  >
                    <option value="">
                      {isLoadingProviders
                        ? "Loading providers..."
                        : providersError
                          ? "Error loading providers"
                          : "Select a provider"}
                    </option>
                    {providers.map((group) => (
                      <optgroup
                        key={group.providerType}
                        label={formatProviderType(group.providerType)}
                      >
                        {group.providers.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.displayName}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground">
                    Model Name
                  </label>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Enter the specific model name for the selected provider.
                  </p>
                  <Input
                    type="text"
                    value={modelName}
                    onChange={(e) => handleModelNameChange(e.target.value)}
                    placeholder="e.g., gpt-4, claude-3-opus, deepseek-v4-pro"
                    aria-invalid={modelNameError ? "true" : "false"}
                    className={modelNameError ? "border-red-500/50" : ""}
                  />
                  {modelNameError && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {modelNameError}
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions - Only show in edit mode with changes */}
      {activeTab === "settings" && isEditMode && (
        <div className="border-t border-border/70 bg-card/40 p-6 backdrop-blur-xl">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="gap-2"
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <DeleteConfigConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
