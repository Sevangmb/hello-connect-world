
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Check, ThumbsUp } from "lucide-react";

export const useChallengeActions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Fonction pour rejoindre un défi
  const handleJoinChallenge = async (challengeId: string, outfitId: string, comment: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour participer aux défis."
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("challenge_participants")
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          outfit_id: outfitId,
          comment: comment,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Participation enregistrée",
        description: "Votre participation au défi a été enregistrée avec succès.",
        icon: <Check className="h-4 w-4" />
      });
    } catch (error: any) {
      console.error("Erreur lors de la participation au défi:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la participation au défi."
      });
    }
  };

  // Fonction pour voter pour un participant
  const handleVote = async (participantId: string, challengeId?: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour voter."
      });
      return;
    }

    setLoading(prev => ({ ...prev, [participantId]: true }));

    try {
      // Vérifier si l'utilisateur a déjà voté pour ce participant
      const { data: existingVote } = await supabase
        .from("challenge_votes")
        .select("*")
        .eq("participant_id", participantId)
        .eq("voter_id", user.id)
        .maybeSingle();

      if (existingVote) {
        // L'utilisateur a déjà voté, supprimer le vote
        const { error } = await supabase
          .from("challenge_votes")
          .delete()
          .eq("id", existingVote.id);

        if (error) throw error;

        toast({
          title: "Vote retiré",
          description: "Votre vote a été retiré avec succès."
        });
      } else {
        // L'utilisateur n'a pas encore voté, ajouter un vote
        const { error } = await supabase
          .from("challenge_votes")
          .insert({
            participant_id: participantId,
            voter_id: user.id,
            challenge_id: challengeId || ''
          });

        if (error) throw error;

        toast({
          title: "Vote enregistré",
          description: "Votre vote a été enregistré avec succès.",
          icon: <ThumbsUp className="h-4 w-4" />
        });
      }
    } catch (error: any) {
      console.error("Erreur lors du vote:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du vote."
      });
    } finally {
      setLoading(prev => ({ ...prev, [participantId]: false }));
    }
  };

  return { handleJoinChallenge, handleVote, loading };
};
