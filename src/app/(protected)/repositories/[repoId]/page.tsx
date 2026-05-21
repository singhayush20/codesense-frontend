"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { RepositoryConfig } from "@/modules/github/components";
import { useGithub } from "@/modules/github/hooks/useGithub";

export default function RepositoryConfigPage() {
  const params = useParams();
  const router = useRouter();
  const repoId = params.repoId as string;

  const { repositories } = useGithub();
  const repository = useMemo(
    () => repositories.find((repo) => repo.id === repoId) ?? null,
    [repoId, repositories],
  );

  const handleCancel = () => {
    router.replace("/repositories?view=selected");
  };

  if (!repository) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Repository not found</p>
      </div>
    );
  }

  return (
    <RepositoryConfig
      repository={repository}
      onCancel={handleCancel}
    />
  );
}
