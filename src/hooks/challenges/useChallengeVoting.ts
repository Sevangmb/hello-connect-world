
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, AlertCircle } from "lucide-react";

export function useChallengeVoting() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const voteForParticipant = useMutation({
    mutationFn: async ({
      challengeId,
      participantId,
    }: {
      challengeId: string;
      participantId: string;
    }) => {
      // Toast de chargement
      const { dismiss } = toast({
        title: "Vote en cours",
        description: "Votre vote est en cours d'enregistrement...",
        icon: { type: "icon", icon: Loader2, className: "h-4 w-4 animate-spin" },
        duration: 10000,
      });

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Vous devez être connecté pour voter");
        }

        // Vérifier si l'utilisateur a déjà voté
        const { data: existingVote } = await supabase
          .from("challenge_votes")
          .select()
          .eq("challenge_id", challengeId)
          .eq("voter_id", user.id)
          .maybeSingle();

        if (existingVote) {
          throw new Error("Vous avez déjà voté pour ce défi");
        }

        // Récupérer les infos du participant
        const { data: participantData } = await supabase
          .from("challenge_participants")
          .select("user_id")
          .eq("id", participantId)
          .single();

        // Enregistrer le vote
        const { data, error } = await supabase
          .from("challenge_votes")
          .insert({
            challenge_id: challengeId,
            voter_id: user.id,
            participant_id: participantId
          })
          .select();

        if (error) throw error;

        // Créer une notification pour le participant
        if (participantData && participantData.user_id !== user.id) {
          await supabase
            .from("notifications")
            .insert({
              type: "rating",
              user_id: participantData.user_id,
              actor_id: user.id,
              message: "a voté pour votre participation au défi",
              data: { challenge_id: challengeId }
            });
        }

        dismiss();
        toast({
          title: "Vote enregistré",
          description: "Votre vote a été pris en compte",
          icon: { type: "icon", icon: Check, className: "h-4 w-4 text-green-500" },
          duration: 5000,
        });

        return data;
      } catch (error) {
        dismiss();
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
    onError: (error) => {
      console.error("Error casting vote:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du vote",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" },
        duration: 5000,
      });
    }
  });

  return {
    voteForParticipant,
  };
}
