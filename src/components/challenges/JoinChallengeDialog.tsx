import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface JoinChallengeDialogProps {
  challengeId: string;
  onJoin: (outfitId: string, comment: string) => Promise<void>;
}

export const JoinChallengeDialog = ({ challengeId, onJoin }: JoinChallengeDialogProps) => {
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: outfits, isLoading: isLoadingOutfits } = useQuery({
    queryKey: ["outfits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outfits")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async () => {
    if (!selectedOutfitId) return;
    
    setIsLoading(true);
    try {
      await onJoin(selectedOutfitId, comment);
      setIsOpen(false);
    } catch (error) {
      console.error("Error joining challenge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Participer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Participer au défi</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Choisir une tenue</label>
            {isLoadingOutfits ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <select
                className="w-full p-2 border rounded-md"
                value={selectedOutfitId}
                onChange={(e) => setSelectedOutfitId(e.target.value)}
              >
                <option value="">Sélectionner une tenue</option>
                {outfits?.map((outfit) => (
                  <option key={outfit.id} value={outfit.id}>
                    {outfit.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Commentaire</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="mt-1"
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOutfitId || isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmer la participation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};