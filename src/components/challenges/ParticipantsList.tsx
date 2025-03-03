
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { Participant } from "./types";
import { useState } from "react";
import { VotingDialog } from "./VotingDialog";

type ParticipantsListProps = {
  participants: Participant[];
  onVote: (participantId: string, challengeId: string) => Promise<void>;
  challengeId: string;
  isVotingEnabled?: boolean;
  showFinalRanking?: boolean;
};

export const ParticipantsList = ({ 
  participants, 
  onVote, 
  challengeId,
  isVotingEnabled = true,
  showFinalRanking = false
}: ParticipantsListProps) => {
  const [isVotingOpen, setIsVotingOpen] = useState(false);

  if (!participants?.length) return null;

  const handleVote = async (participantId: string) => {
    await onVote(participantId, challengeId);
  };

  // Trier les participants par le nombre de votes si on montre le classement final
  const sortedParticipants = showFinalRanking
    ? [...participants].sort((a, b) => {
        const votesA = a.votes?.length || 0;
        const votesB = b.votes?.length || 0;
        return votesB - votesA;
      })
    : participants;

  // Obtenir le nom du défi pour le badge du vainqueur
  const getChallengeName = () => {
    // Obtenir le nom du défi depuis l'URL si disponible
    const path = window.location.pathname;
    const segments = path.split('/');
    // Simplifié pour démonstration
    return "Défi";
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">
          {showFinalRanking ? "Classement Final" : "Participants"}
        </h4>
        {isVotingEnabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVotingOpen(true)}
            className="gap-2"
          >
            <Award className="h-4 w-4" />
            Voter
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {sortedParticipants.map((participant, index) => (
          <div key={participant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div>
              {showFinalRanking && index === 0 && (
                <div className="mb-2 space-y-1">
                  <Badge variant="secondary" className="mb-1">
                    🏆 Vainqueur
                  </Badge>
                  
                  {/* Badge Shield.io pour le vainqueur */}
                  <div className="flex items-center">
                    <img 
                      src={`https://img.shields.io/badge/${encodeURIComponent(getChallengeName().replace(/ /g, '_'))}-Vainqueur-green?style=for-the-badge&logo=trophy&logoColor=gold`}
                      alt="Badge vainqueur"
                      className="h-6"
                    />
                  </div>
                  
                  {/* Badge Shield.io pour le nom de la tenue */}
                  {participant.outfits && (
                    <div className="flex items-center mt-1">
                      <img 
                        src={`https://img.shields.io/badge/Tenue-${encodeURIComponent(participant.outfits.name.replace(/ /g, '_'))}-blue?style=flat-square`}
                        alt="Badge tenue"
                        className="h-5"
                      />
                    </div>
                  )}
                </div>
              )}
              <p className="font-medium">
                {participant.profiles?.username || "Utilisateur inconnu"}
                {showFinalRanking && index < 3 && (
                  <span className="ml-2">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                )}
              </p>
              {participant.outfits && (
                <p className="text-sm text-gray-600">Tenue: {participant.outfits.name}</p>
              )}
              {participant.comment && (
                <p className="text-sm text-gray-500">{participant.comment}</p>
              )}
              
              {/* Afficher un badge pour les 2e et 3e positions */}
              {showFinalRanking && (index === 1 || index === 2) && participant.outfits && (
                <div className="mt-1">
                  <img 
                    src={`https://img.shields.io/badge/Tenue-${encodeURIComponent(participant.outfits.name.replace(/ /g, '_'))}-${index === 1 ? 'silver' : 'bronze'}?style=flat-square&logo=fashion&logoColor=white`}
                    alt={`Badge ${index === 1 ? '2e' : '3e'} place`}
                    className="h-5"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <VotingDialog
        isOpen={isVotingOpen}
        onClose={() => setIsVotingOpen(false)}
        participants={participants}
        onVote={handleVote}
      />
    </div>
  );
};
