
import { Challenge } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const ChallengeMetadata = ({ challenge }: { challenge: Challenge }) => {
  const getWinner = () => {
    if (challenge.status !== 'completed' || !challenge.participants?.length) {
      return null;
    }

    const participantsWithVotes = challenge.participants.map(participant => {
      const voteCount = challenge.votes.filter(vote => vote.count > 0).length || 0;
      return {
        username: participant.profiles.username,
        voteCount
      };
    });

    const winner = participantsWithVotes.reduce((prev, current) => 
      (current.voteCount > prev.voteCount) ? current : prev
    );

    return winner.username;
  };

  const startDate = format(new Date(challenge.start_date), "dd/MM/yyyy", { locale: fr });
  const endDate = format(new Date(challenge.end_date), "dd/MM/yyyy", { locale: fr });
  const participantsCount = challenge.participants?.length || 0;
  const winner = getWinner();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <img 
        src={`https://img.shields.io/badge/Dates-${startDate}%20→%20${endDate}-blue?style=flat-square`}
        alt="Dates du défi"
        className="h-5"
      />
      
      <img 
        src={`https://img.shields.io/badge/Participants-${participantsCount}-green?style=flat-square`}
        alt="Nombre de participants"
        className="h-5"
      />
      
      {challenge.status === 'active' && (
        <img 
          src="https://img.shields.io/badge/Status-En%20cours-orange?style=flat-square"
          alt="Statut du défi"
          className="h-5"
        />
      )}
      
      {challenge.status === 'completed' && winner && (
        <img 
          src={`https://img.shields.io/badge/Vainqueur-${encodeURIComponent(winner)}-gold?style=flat-square`}
          alt="Vainqueur du défi"
          className="h-5"
        />
      )}
    </div>
  );
};
