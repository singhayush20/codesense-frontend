import type {
  ReviewWorkflowStep as GithubReviewWorkflowStep,
  ReviewWorkflowRun as GithubReviewWorkflowRun,
  ReviewWorkflowResponse as GithubReviewWorkflowResponse,
} from "@/modules/github/types/github.types";
import {
  ReviewWorkflowStepStatus,
  PullRequestReviewStatus,
} from "@/modules/github/types/github.types";

export { ReviewWorkflowStepStatus, PullRequestReviewStatus };
export type ReviewWorkflowStep = GithubReviewWorkflowStep;
export type ReviewWorkflowRun = GithubReviewWorkflowRun;
export type ReviewWorkflowResponse = GithubReviewWorkflowResponse;

export const WORKFLOW_STEP_ORDER = [
  "initializing",
  "fetching_pull_request",
  "building_review_context",
  "generating_review",
  "saving_results",
  "completed",
] as const;

export type ReviewWorkflowStepName = typeof WORKFLOW_STEP_ORDER[number];

export const STEP_LABELS: Record<string, string> = {
  initializing: "Initializing",
  fetching_pull_request: "Fetching Pull Request",
  building_review_context: "Building Review Context",
  generating_review: "Generating Review",
  saving_results: "Saving Results",
  completed: "Completed",
};

export interface SSEEvent {
  type: string;
  data: Record<string, unknown>;
}
