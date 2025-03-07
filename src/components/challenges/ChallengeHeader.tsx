
import { Trophy, Vote } from "lucide-react";
import { JoinChallengeDialog } from "./JoinChallengeDialog";
import { VotingDialog } from "./VotingDialog";
import { Challenge } from "./types";
import { useState } from "react";

type ChallengeHeaderProps = {
  challenge: Challenge;
  onJoin: (outfitId: string, comment: string) => Promise<void>;
  onVote: (participantId: string) => Promise<void>;
};

export const ChallengeHeader = ({ challenge, onJoin, onVote }: ChallengeHeaderProps) => {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const creatorUsername = challenge.profiles[0]?.username || "Utilisateur inconnu";
  
  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-facebook-primary" />
          {challenge.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Créé par {creatorUsername}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/80 transition-colors"
          onClick={() => setIsJoinDialogOpen(true)}
        >
          <Trophy className="h-4 w-4" />
          Participer
        </button>
        
        <JoinChallengeDialog 
          challengeId={challenge.id}
          onJoin={onJoin}
          isOpen={isJoinDialogOpen}
          onClose={() => setIsJoinDialogOpen(false)}
        />
        
        <button
          className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
          onClick={() => setIsVotingOpen(true)}
        >
          <Vote className="h-4 w-4" />
          Voter
        </button>
        
        <VotingDialog
          isOpen={isVotingOpen}
          onClose={() => setIsVotingOpen(false)}
          participants={challenge.participants}
          onVote={(participantId) => onVote(participantId)}
        />
      </div>
    </div>
  );
};
