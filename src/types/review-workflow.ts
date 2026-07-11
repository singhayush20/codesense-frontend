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
  "INITIALIZING",
  "FETCHING_PULL_REQUEST",
  "BUILDING_REVIEW_CONTEXT",
  "GENERATING_REVIEW",
  "SAVING_RESULTS",
  "COMPLETED",
] as const;

export type ReviewWorkflowStepName = typeof WORKFLOW_STEP_ORDER[number];

export const STEP_LABELS: Record<string, string> = {
  INITIALIZING: "Initializing",
  FETCHING_PULL_REQUEST: "Fetching Pull Request",
  BUILDING_REVIEW_CONTEXT: "Building Review Context",
  GENERATING_REVIEW: "Generating Review",
  SAVING_RESULTS: "Saving Results",
  COMPLETED: "Completed",
};

export interface SSEEvent {
  type: string;
  data: Record<string, unknown>;
}
