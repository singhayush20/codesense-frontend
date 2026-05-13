"use client";

import { useParams } from "next/navigation";
import { RepositoryPullRequestDetails } from "@/modules/github/components/RepositoryPullRequestDetails";

export default function PullRequestDetailsPage() {
  const params = useParams();
  const repositoryId = params.repoId as string;
  const pullRequestId = params.pullRequestId as string;

  return (
    <RepositoryPullRequestDetails
      repositoryId={repositoryId}
      pullRequestId={pullRequestId}
    />
  );
}
