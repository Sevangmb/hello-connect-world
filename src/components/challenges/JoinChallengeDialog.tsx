
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Loader2 } from "lucide-react";

type JoinChallengeDialogProps = {
  challengeId: string;
  onJoin: (outfitId: string, comment: string) => Promise<void>;
};

export const JoinChallengeDialog = ({ challengeId, onJoin }: JoinChallengeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOutfitId, setSelectedOutfitId] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Récupérer les tenues de l'utilisateur
  const { data: outfits, isLoading } = useQuery({
    queryKey: ["user-outfits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("outfits")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const handleSubmit = async () => {
    if (!selectedOutfitId) return;
    
    setIsSubmitting(true);
    
    try {
      await onJoin(selectedOutfitId, comment);
      setIsOpen(false);
      setSelectedOutfitId("");
      setComment("");
    } catch (error) {
      console.error("Error joining challenge:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Participer
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Participer au défi</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Choisir une tenue</label>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Chargement des tenues...</span>
              </div>
            ) : outfits?.length ? (
              <Select value={selectedOutfitId} onValueChange={setSelectedOutfitId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une tenue" />
                </SelectTrigger>
                <SelectContent>
                  {outfits.map((outfit) => (
                    <SelectItem key={outfit.id} value={outfit.id}>
                      {outfit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-gray-500">
                Vous n'avez pas encore créé de tenues. Créez une tenue pour participer.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Commentaire (optionnel)</label>
            <Textarea
              placeholder="Partagez quelques mots sur votre tenue..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!selectedOutfitId || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              "Participer au défi"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
