
/**
 * Module de défis - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés aux défis
 */

// Composants principaux
export { ChallengesList } from '@/components/challenges/ChallengesList';
export { CreateChallenge } from '@/components/challenges/CreateChallenge';
export { ChallengeActions } from '@/components/challenges/ChallengeActions';
export { ChallengeHeader } from '@/components/challenges/ChallengeHeader';
export { ChallengeMetadata } from '@/components/challenges/ChallengeMetadata';
export { JoinChallengeDialog } from '@/components/challenges/JoinChallengeDialog';
export { ParticipantsList } from '@/components/challenges/ParticipantsList';
export { VotingDialog } from '@/components/challenges/VotingDialog';

// Formulaires
export { ChallengeBasicInfo } from '@/components/challenges/forms/ChallengeBasicInfo';
export { ChallengeDates } from '@/components/challenges/forms/ChallengeDates';
export { ChallengeParticipationSettings } from '@/components/challenges/forms/ChallengeParticipationSettings';

// Hooks
export { useChallengeSubmit } from '@/hooks/useChallengeSubmit';
export { useChallengeSubmission } from '@/hooks/challenges/useChallengeSubmission';
export { useChallengeVoting } from '@/hooks/challenges/useChallengeVoting';

// Types
export * from '@/components/challenges/types';
export * from '@/hooks/challenges/types';
