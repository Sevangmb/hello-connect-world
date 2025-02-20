
import { Calendar, Trophy, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Challenge } from "./types";

export const ChallengeMetadata = ({ challenge }: { challenge: Challenge }) => {
  const getWinner = () => {
    if (challenge.status !== 'completed' || !challenge.participants?.length) {
      return null;
    }

    // Calculer le nombre total de votes pour chaque participant
    const participantsWithVotes = challenge.participants.map(participant => {
      const voteCount = challenge.votes.filter(vote => vote.count > 0).length || 0;
      return {
        username: participant.profiles.username,
        voteCount
      };
    });

    // Trouver le participant avec le plus de votes
    const winner = participantsWithVotes.reduce((prev, current) => 
      (current.voteCount > prev.voteCount) ? current : prev
    );

    return winner.username;
  };

  const winner = getWinner();

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
      {challenge.status === 'completed' && winner && (
        <div className="flex items-center gap-1 text-yellow-600">
          <Trophy className="h-4 w-4" />
          <span>Vainqueur : {winner}</span>
        </div>
      )}
    </div>
  );
};
