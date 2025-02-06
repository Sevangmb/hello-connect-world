import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { Participant } from "./types";
import { useState } from "react";
import { VotingDialog } from "./VotingDialog";

type ParticipantsListProps = {
  participants: Participant[];
  onVote: (participantId: string, challengeId: string) => Promise<void>;
  challengeId: string;
};

export const ParticipantsList = ({ participants, onVote, challengeId }: ParticipantsListProps) => {
  const [isVotingOpen, setIsVotingOpen] = useState(false);

  if (!participants?.length) return null;

  const handleVote = async (participantId: string) => {
    await onVote(participantId, challengeId);
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Participants</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVotingOpen(true)}
          className="gap-2"
        >
          <Award className="h-4 w-4" />
          Voter
        </Button>
      </div>

      <div className="space-y-2">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div>
              <p className="font-medium">
                {participant.profiles?.username || "Utilisateur inconnu"}
              </p>
              {participant.outfits && (
                <p className="text-sm text-gray-600">Tenue: {participant.outfits.name}</p>
              )}
              {participant.comment && (
                <p className="text-sm text-gray-500">{participant.comment}</p>
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
