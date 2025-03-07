
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Participant } from "./types";
import { Vote } from "lucide-react";

type VotingDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onVote: (participantId: string) => Promise<void>;
};

export const VotingDialog = ({ isOpen, onClose, participants, onVote }: VotingDialogProps) => {
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({});
  
  const handleVote = async (participantId: string) => {
    setIsVoting(prev => ({ ...prev, [participantId]: true }));
    
    try {
      await onVote(participantId);
      
      // Add a slight delay to show the loading state
      setTimeout(() => {
        setIsVoting(prev => ({ ...prev, [participantId]: false }));
      }, 500);
    } catch (error) {
      console.error("Error voting:", error);
      setIsVoting(prev => ({ ...prev, [participantId]: false }));
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Voter pour un participant</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {participants?.length ? (
            participants.map((participant) => (
              <div 
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium">{participant.profiles?.username || "Utilisateur inconnu"}</p>
                  {participant.outfits && (
                    <p className="text-sm text-gray-600">Tenue: {participant.outfits.name}</p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isVoting[participant.id]}
                  onClick={() => handleVote(participant.id)}
                  className="gap-1"
                >
                  {isVoting[participant.id] ? (
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Vote className="h-4 w-4" />
                  )}
                  Voter
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              Aucun participant à ce challenge
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
