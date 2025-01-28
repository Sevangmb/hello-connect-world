import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Trophy } from "lucide-react";
import { useState } from "react";
import { Participant } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, PenSquare, Footprints } from "lucide-react";

type VotingDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onVote: (participantId: string, vote: "up" | "down") => Promise<void>;
};

export const VotingDialog = ({ isOpen, onClose, participants, onVote }: VotingDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votingComplete, setVotingComplete] = useState(false);
  const [votedParticipants, setVotedParticipants] = useState<Record<string, "up" | "down">>({});

  const currentParticipant = participants[currentIndex];

  const handleVote = async (vote: "up" | "down") => {
    if (!currentParticipant) return;

    await onVote(currentParticipant.id, vote);
    setVotedParticipants(prev => ({
      ...prev,
      [currentParticipant.id]: vote
    }));

    if (currentIndex < participants.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setVotingComplete(true);
    }
  };

  const getRanking = () => {
    return participants.sort((a, b) => {
      const aVote = votedParticipants[a.id] === "up" ? 1 : -1;
      const bVote = votedParticipants[b.id] === "up" ? 1 : -1;
      return bVote - aVote;
    });
  };

  const renderOutfitCard = (participant: Participant) => {
    if (!participant.outfits) return null;
    
    return (
      <Card className="w-full">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <Shirt className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium">Haut</p>
              {participant.outfits.top && (
                <div className="flex items-center gap-2">
                  <img
                    src={participant.outfits.top.image_url || ""}
                    alt={participant.outfits.top.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{participant.outfits.top.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PenSquare className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-medium">Bas</p>
              {participant.outfits.bottom && (
                <div className="flex items-center gap-2">
                  <img
                    src={participant.outfits.bottom.image_url || ""}
                    alt={participant.outfits.bottom.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{participant.outfits.bottom.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Footprints className="h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium">Chaussures</p>
              {participant.outfits.shoes && (
                <div className="flex items-center gap-2">
                  <img
                    src={participant.outfits.shoes.image_url || ""}
                    alt={participant.outfits.shoes.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{participant.outfits.shoes.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {votingComplete ? "Classement Final" : "Voter pour les tenues"}
          </DialogTitle>
        </DialogHeader>

        {!votingComplete && currentParticipant ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="font-medium">{currentParticipant.profiles.username}</p>
              {currentParticipant.comment && (
                <p className="text-sm text-gray-500 mt-2">{currentParticipant.comment}</p>
              )}
            </div>

            {renderOutfitCard(currentParticipant)}

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleVote("down")}
                className="w-24"
              >
                <ThumbsDown className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleVote("up")}
                className="w-24"
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              {currentIndex + 1} sur {participants.length}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {getRanking().map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                  <div>
                    <p className="font-medium">{participant.profiles.username}</p>
                    {participant.outfits && (
                      <p className="text-sm text-gray-600">
                        {participant.outfits.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-gray-500">
                  {votedParticipants[participant.id] === "up" ? (
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};