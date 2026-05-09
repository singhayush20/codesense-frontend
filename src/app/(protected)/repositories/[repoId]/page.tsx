"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RepositoryConfig } from "@/modules/github/components";
import { useGithub } from "@/modules/github/hooks/useGithub";
import type { GithubRepository } from "@/modules/github/types/github.types";

export default function RepositoryConfigPage() {
  const params = useParams();
  const router = useRouter();
  const repoId = params.repoId as string;

  const { repositories } = useGithub();
  const [repository, setRepository] = useState<GithubRepository | null>(null);

  useEffect(() => {
    // Find repository by ID from the loaded repositories
    const found = repositories.find((repo) => repo.id === repoId);
    setRepository(found || null);
  }, [repoId, repositories]);

  const handleCancel = () => {
    router.back();
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
