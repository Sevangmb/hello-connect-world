
import { useChallengeSubmission } from "./challenges/useChallengeSubmission";
import { useChallengeVoting } from "./challenges/useChallengeVoting";
import { ChallengeSubmissionData } from "./challenges/types";

export type { ChallengeSubmissionData };

export function useChallengeSubmit() {
  const { submitChallenge, isSubmitting } = useChallengeSubmission();
  const { voteSubmission } = useChallengeVoting();

  return {
    submitChallenge,
    voteSubmission,
    isSubmitting
  };
}
