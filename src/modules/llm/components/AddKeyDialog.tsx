"use client";

import { Eye, EyeOff, Plus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { ProviderType } from "@/modules/llm/types/llm.types";

interface AddKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (displayName: string, apiKey: string) => Promise<void>;
  providerName: string;
  isLoading: boolean;
}

export function AddKeyDialog({
  isOpen,
  onClose,
  onSubmit,
  providerName,
  isLoading,
}: AddKeyDialogProps) {
  const [step, setStep] = useState<"name" | "key">("name");
  const [displayName, setDisplayName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step === "name" && displayName.trim()) {
      setStep("key");
    }
  };

  const handleSubmit = async () => {
    if (!apiKey.trim() || !displayName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(displayName, apiKey);
      setDisplayName("");
      setApiKey("");
      setShowKey(false);
      setStep("name");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep("name");
  };

  const handleClose = () => {
    setDisplayName("");
    setApiKey("");
    setShowKey(false);
    setStep("name");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-border/70 bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {step === "name" 
                ? `Add ${providerName} API Key`
                : `Configure ${providerName}`
              }
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "name"
                ? "Give this configuration a memorable name"
                : "Enter your API key"}
            </p>
          </div>

          {/* Step 1: Display Name */}
          {step === "name" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Configuration Name</label>
                <Input
                  type="text"
                  placeholder={`e.g., Production API Key, Testing Key`}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && displayName.trim()) {
                      handleNext();
                    }
                  }}
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use a clear name to identify this API key in your list.
              </p>
            </div>
          )}

          {/* Step 2: API Key */}
          {step === "key" && (
            <>
              {/* Security Notice */}
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-xs font-medium text-destructive">
                  ⚠️ Your API key will be encrypted and stored securely. Once added, it cannot be viewed again for security reasons.
                </p>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">API Key</label>
                <div className="relative">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="Paste your API key here"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && apiKey.trim()) {
                        handleSubmit();
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {showKey ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {step === "key" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {step === "name" ? "Cancel" : "Close"}
            </Button>
            <Button
              type="button"
              onClick={step === "name" ? handleNext : handleSubmit}
              disabled={
                step === "name"
                  ? !displayName.trim() || isLoading
                  : !apiKey.trim() || isLoading || isSubmitting
              }
            >
              {step === "name" 
                ? "Next" 
                : isSubmitting 
                ? "Adding..." 
                : "Add Configuration"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
