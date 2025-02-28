
import { useChallengeSubmission } from "./challenges/useChallengeSubmission";
import { useChallengeVoting } from "./challenges/useChallengeVoting";
import { ChallengeSubmissionData } from "./challenges/types";

export type { ChallengeSubmissionData };

export function useChallengeSubmit() {
  const { submitChallenge } = useChallengeSubmission();
  const { voteForParticipant } = useChallengeVoting();

  return {
    submitChallenge,
    voteForParticipant,
    isSubmitting: submitChallenge.isPending
  };
}
