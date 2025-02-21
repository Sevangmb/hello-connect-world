
import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Challenge } from "./types";

type ChallengeMetadataProps = {
  challenge: Challenge;
};

export const ChallengeMetadata = ({ challenge }: ChallengeMetadataProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Dates</p>
          <div className="text-sm text-muted-foreground">
            Du {format(new Date(challenge.start_date), "d MMMM yyyy", { locale: fr })} au{" "}
            {format(new Date(challenge.end_date), "d MMMM yyyy", { locale: fr })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Users className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Participants</p>
          <div className="text-sm text-muted-foreground">
            {challenge.participants?.length || 0} participant(s)
          </div>
        </div>
      </div>

      {challenge.rules && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Règles du défi</p>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {challenge.rules}
          </div>
        </div>
      )}

      {challenge.reward_description && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Récompenses</p>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {challenge.reward_description}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">Type de participation</p>
        <Badge variant="secondary" className="text-xs">
          {challenge.participation_type === "virtual" ? "Tenue virtuelle" : "Photo"}
        </Badge>
      </div>

      {challenge.is_voting_enabled && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Votes</p>
          <Badge variant="secondary" className="text-xs">
            Votes activés
          </Badge>
        </div>
      )}
    </div>
  );
};
