import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Challenge } from "./types";

export const ChallengeMetadata = ({ challenge }: { challenge: Challenge }) => {
  return (
    <div className="flex items-center gap-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>
          Du {format(new Date(challenge.start_date), "PPP", { locale: fr })}
          {" au "}
          {format(new Date(challenge.end_date), "PPP", { locale: fr })}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        <span>
          {challenge.participants?.length || 0} participant
          {(challenge.participants?.length || 0) > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};
