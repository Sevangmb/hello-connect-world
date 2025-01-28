import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { Participant } from "./types";

type ParticipantsListProps = {
  participants: Participant[];
  onVote: (participantId: string) => Promise<void>;
};

export const ParticipantsList = ({ participants, onVote }: ParticipantsListProps) => {
  if (!participants?.length) return null;

  return (
    <div className="mt-4 space-y-3">
      <h4 className="font-medium">Participants</h4>
      <div className="space-y-2">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div>
              <p className="font-medium">
                {participant.profiles[0]?.username || "Utilisateur inconnu"}
              </p>
              {participant.outfits && (
                <p className="text-sm text-gray-600">Tenue: {participant.outfits.name}</p>
              )}
              {participant.comment && (
                <p className="text-sm text-gray-500">{participant.comment}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVote(participant.id)}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Voter
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};