"use client";

import { useCallback, useMemo, useState } from "react";
import { GitBranch, Loader2, Search, Unplug, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import type { GithubRepository } from "@/modules/github/types/github.types";

interface RepoSelectionTableProps {
  repositories: GithubRepository[];
  selectedRepoIds: string[];
  isSaving: boolean;
  isSyncing: boolean;
  isReadOnly?: boolean;
  lockedRepoIds?: string[];
  selectedOnly?: boolean;
  showDisconnectAction?: boolean;
  onSave?: (repoIds: string[]) => Promise<void>;
  onUnselect?: (repoIds: string[]) => Promise<void>;
  onSelectedRepoIdsChange: (repoIds: string[]) => void;
  onSync?: () => Promise<void>;
}

export function RepoSelectionTable({
  repositories,
  selectedRepoIds,
  isSaving,
  isSyncing,
  isReadOnly = false,
  lockedRepoIds = [],
  selectedOnly = false,
  showDisconnectAction = false,
  onSave,
  onUnselect,
  onSelectedRepoIdsChange,
  onSync,
}: RepoSelectionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUnlinkMode, setIsUnlinkMode] = useState(false);
  const [tempUnselectIds, setTempUnselectIds] = useState<string[]>([]);

  const selectedSet = useMemo(() => new Set(selectedRepoIds), [selectedRepoIds]);
  const lockedSet = useMemo(() => new Set(lockedRepoIds), [lockedRepoIds]);
  const unselectSet = useMemo(() => new Set(tempUnselectIds), [tempUnselectIds]);

  const visibleRepositories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return repositories.filter((repository) => {
      const matchesSearch =
        !normalizedSearch ||
        repository.name.toLowerCase().includes(normalizedSearch) ||
        repository.fullName.toLowerCase().includes(normalizedSearch);
      const matchesSelection = !selectedOnly || selectedSet.has(repository.repoId);

      return matchesSearch && matchesSelection;
    });
  }, [repositories, searchTerm, selectedOnly, selectedSet]);

  const allVisibleSelected =
    visibleRepositories.length > 0 &&
    visibleRepositories.every((repository) => selectedSet.has(repository.repoId));

  const updateSelection = useCallback(
    (repoId: string, checked: boolean) => {
      if (isUnlinkMode) {
        const nextUnselect = new Set(tempUnselectIds);
        if (checked) {
          nextUnselect.add(repoId);
        } else {
          nextUnselect.delete(repoId);
        }
        setTempUnselectIds(Array.from(nextUnselect));
        return;
      }

      if (lockedSet.has(repoId)) {
        return;
      }

      const nextSelection = new Set(selectedRepoIds);

      if (checked) {
        nextSelection.add(repoId);
      } else {
        nextSelection.delete(repoId);
      }

      onSelectedRepoIdsChange(Array.from(nextSelection));
    },
    [isUnlinkMode, tempUnselectIds, lockedSet, selectedRepoIds, onSelectedRepoIdsChange],
  );

  const selectAllVisible = useCallback(() => {
    if (isUnlinkMode) {
      const nextUnselect = new Set(tempUnselectIds);
      visibleRepositories.forEach((repository) => nextUnselect.add(repository.repoId));
      setTempUnselectIds(Array.from(nextUnselect));
      return;
    }

    const nextSelection = new Set(selectedRepoIds);
    visibleRepositories.forEach((repository) => nextSelection.add(repository.repoId));
    onSelectedRepoIdsChange(Array.from(nextSelection));
  }, [isUnlinkMode, tempUnselectIds, visibleRepositories, selectedRepoIds, onSelectedRepoIdsChange]);

  const clearSelection = useCallback(() => {
    if (isUnlinkMode) {
      setTempUnselectIds([]);
      return;
    }
    onSelectedRepoIdsChange(selectedRepoIds.filter((repoId) => lockedSet.has(repoId)));
  }, [isUnlinkMode, lockedSet, onSelectedRepoIdsChange, selectedRepoIds]);

  const handleUnselect = async () => {
    if (onUnselect && tempUnselectIds.length > 0) {
      await onUnselect(tempUnselectIds);
      setIsUnlinkMode(false);
      setTempUnselectIds([]);
    }
  };

  const toggleUnlinkMode = () => {
    setIsUnlinkMode(!isUnlinkMode);
    setTempUnselectIds([]);
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[var(--shadow-surface)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {selectedOnly ? "Selected Repositories" : "Select Repositories"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedOnly
              ? `${repositories.length} persisted repositories`
              : `${repositories.length} repositories available - ${selectedRepoIds.length} selected`}
          </p>
        </div>

        {!isReadOnly || (selectedOnly && showDisconnectAction) ? (
          <div className="flex flex-wrap gap-2">
            {selectedOnly && showDisconnectAction && !isUnlinkMode && repositories.length > 0 ? (
              <Button type="button" variant="outline" onClick={toggleUnlinkMode} className="gap-2">
                <Unplug className="size-4" aria-hidden="true" />
                Unlink
              </Button>
            ) : null}

            {onSync && !isUnlinkMode ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void onSync()}
                disabled={isSyncing}
                className="gap-2"
              >
                {isSyncing ? <Loader2 className="size-4 animate-spin" /> : null}
                {isSyncing ? "Syncing..." : "Sync repositories"}
              </Button>
            ) : null}

            {onSave && !isUnlinkMode ? (
              <Button
                type="button"
                onClick={() => void onSave(selectedRepoIds)}
                disabled={isSaving || selectedRepoIds.length === 0}
                className="gap-2"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
                {isSaving ? "Saving..." : "Save & Continue"}
              </Button>
            ) : null}

            {isUnlinkMode ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleUnlinkMode}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <X className="size-4" aria-hidden="true" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleUnselect}
                  disabled={isSaving || tempUnselectIds.length === 0}
                  className="gap-2"
                >
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isSaving ? "Removing..." : "Unlink Selected"}
                </Button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-[var(--shadow-surface)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search repositories..."
              className="pl-9"
              aria-label="Search repositories"
            />
          </div>

          {!isReadOnly || isUnlinkMode ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={selectAllVisible}
                disabled={visibleRepositories.length === 0 || (isUnlinkMode ? tempUnselectIds.length === visibleRepositories.length : allVisibleSelected)}
              >
                Select all
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={clearSelection}
                disabled={isUnlinkMode ? tempUnselectIds.length === 0 : selectedRepoIds.length === 0}
              >
                Clear
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-4 min-h-96 overflow-hidden rounded-xl border border-border/60 bg-background/70">
          {visibleRepositories.length === 0 ? (
            <div className="grid min-h-96 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-primary">
                  <GitBranch className="size-6" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  {selectedOnly && selectedRepoIds.length === 0
                    ? "No selected repositories yet"
                    : repositories.length === 0
                      ? "No repositories found"
                      : "No repositories match"}
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {selectedOnly && selectedRepoIds.length === 0
                    ? "Use the Repositories tab to choose which repositories CodeSense should analyze."
                    : repositories.length === 0
                      ? "Sync repositories after connecting GitHub to populate this table."
                      : "Try a different search or clear the selected-only filter."}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {!isReadOnly || isUnlinkMode ? (
                    <TableHead className="w-12">
                      <span className="sr-only">Select</span>
                    </TableHead>
                  ) : null}
                  <TableHead>Repository</TableHead>
                  <TableHead className="hidden lg:table-cell">Full name</TableHead>
                  <TableHead className="w-36 text-right">Visibility</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRepositories.map((repository) => {
                  const isSelected = selectedSet.has(repository.repoId);
                  const isLocked = lockedSet.has(repository.repoId);
                  const isChecked = isUnlinkMode ? unselectSet.has(repository.repoId) : isSelected;

                  return (
                    <TableRow
                      key={repository.id}
                      className={cn((isSelected || isChecked) && "bg-primary/5 hover:bg-primary/10")}
                    >
                      {!isReadOnly || isUnlinkMode ? (
                        <TableCell>
                          <Checkbox
                            aria-label={`Select ${repository.fullName}`}
                            checked={isChecked}
                            disabled={!isUnlinkMode && isLocked}
                            onChange={(event) =>
                              updateSelection(repository.repoId, event.target.checked)
                            }
                          />
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <p className="font-semibold text-foreground">{repository.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground lg:hidden">
                          {repository.fullName}
                        </p>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {repository.fullName}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={cn(
                            "tracking-[0.14em]",
                            repository.isPrivate
                              ? "border-destructive/20 bg-destructive/10 text-destructive"
                              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
                          )}
                        >
                          {repository.isPrivate ? "Private" : "Public"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {visibleRepositories.length} of {repositories.length}
          </span>
          <span>{selectedRepoIds.length} selected</span>
        </div>
      </div>
    </section>
  );
}
