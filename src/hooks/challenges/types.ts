
import { ReactNode } from "react";

export interface ChallengeSubmissionData {
  challengeId: string;
  outfitId?: string;
  clothesIds?: string[];
  description?: string;
  additionalData?: Record<string, any>;
}

export interface SubmissionVoteData {
  submissionId: string;
  vote: number;
}

export interface ToastIconProps {
  icon?: ReactNode;
}
