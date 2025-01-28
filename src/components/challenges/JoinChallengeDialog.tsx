import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, PenSquare, Footprints } from "lucide-react";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("outfits")
        .select(`
          *,
          top:clothes!top_id(name, image_url),
          bottom:clothes!bottom_id(name, image_url),
          shoes:clothes!shoes_id(name, image_url)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const selectedOutfit = outfits?.find(outfit => outfit.id === selectedOutfitId);

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

  const renderOutfitCard = (outfit: any) => {
    if (!outfit) return null;
    
    return (
      <Card className="w-full mt-4">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <Shirt className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium">Haut</p>
              {outfit.top && (
                <div className="flex items-center gap-2">
                  <img
                    src={outfit.top.image_url || ""}
                    alt={outfit.top.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{outfit.top.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PenSquare className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-medium">Bas</p>
              {outfit.bottom && (
                <div className="flex items-center gap-2">
                  <img
                    src={outfit.bottom.image_url || ""}
                    alt={outfit.bottom.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{outfit.bottom.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Footprints className="h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium">Chaussures</p>
              {outfit.shoes && (
                <div className="flex items-center gap-2">
                  <img
                    src={outfit.shoes.image_url || ""}
                    alt={outfit.shoes.name}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{outfit.shoes.name}</p>
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

          {selectedOutfit && renderOutfitCard(selectedOutfit)}

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