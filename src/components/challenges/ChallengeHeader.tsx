import { Trophy } from "lucide-react";
import { JoinChallengeDialog } from "./JoinChallengeDialog";
import { Challenge } from "./types";

type ChallengeHeaderProps = {
  challenge: Challenge;
  onJoin: (outfitId: string, comment: string) => Promise<void>;
};

export const ChallengeHeader = ({ challenge, onJoin }: ChallengeHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-facebook-primary" />
          {challenge.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Créé par {challenge.profiles?.username || "Utilisateur inconnu"}
        </p>
      </div>
      <JoinChallengeDialog 
        challengeId={challenge.id}
        onJoin={onJoin}
      />
    </div>
  );
};