"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeleteConfigConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteConfigConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfigConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-border/70 bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Delete Configuration
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Are you sure you want to delete the LLM configuration for this repository? This action will remove the provider and model settings.
              </p>
              <p className="font-medium text-foreground">
                You will need to re-configure the LLM before you can use automated reviews for this repository again.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={onConfirm}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete Configuration"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
