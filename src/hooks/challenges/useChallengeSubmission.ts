
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, AlertCircle } from "lucide-react";

export function useChallengeSubmission() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Soumettre une participation à un défi
  const submitChallenge = useMutation({
    mutationFn: async ({
      challengeId,
      outfitId,
      comment,
    }: {
      challengeId: string;
      outfitId: string;
      comment: string;
    }) => {
      // Toast de chargement
      const { dismiss } = toast({
        title: "Traitement en cours",
        description: "Votre participation au défi est en cours de soumission...",
        icon: { type: "icon", icon: Loader2, className: "h-4 w-4 animate-spin" },
        duration: 10000,
      });

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Vous devez être connecté pour participer à un défi");
        }

        // Vérifier si le défi est toujours actif
        const { data: challenge } = await supabase
          .from("challenges")
          .select("status, end_date, title")
          .eq("id", challengeId)
          .single();

        if (!challenge || challenge.status !== "active" || new Date(challenge.end_date) < new Date()) {
          throw new Error("Ce défi n'est plus disponible pour participation");
        }

        // Vérifier si l'utilisateur participe déjà
        const { data: existingParticipation } = await supabase
          .from("challenge_participants")
          .select()
          .eq("challenge_id", challengeId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingParticipation) {
          throw new Error("Vous participez déjà à ce défi");
        }

        // Créer la participation
        const { data, error } = await supabase
          .from("challenge_participants")
          .insert({
            challenge_id: challengeId,
            user_id: user.id,
            outfit_id: outfitId,
            comment: comment,
            status: "pending",
          })
          .select();

        if (error) throw error;

        // Créer une notification pour le créateur du défi
        const { data: challengeData } = await supabase
          .from("challenges")
          .select("creator_id, title")
          .eq("id", challengeId)
          .single();

        if (challengeData && challengeData.creator_id !== user.id) {
          await supabase
            .from("notifications")
            .insert({
              type: "challenge_submission",
              user_id: challengeData.creator_id,
              actor_id: user.id,
              message: `a soumis une participation à votre défi "${challengeData.title}"`,
              data: { challenge_id: challengeId }
            });
        }

        dismiss();
        toast({
          title: "Participation soumise",
          description: "Votre participation au défi a été soumise avec succès",
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
      queryClient.invalidateQueries({ queryKey: ["user-challenges"] });
    },
    onError: (error) => {
      console.error("Error submitting challenge participation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la soumission",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" },
        duration: 5000,
      });
    }
  });

  return {
    submitChallenge,
  };
}
