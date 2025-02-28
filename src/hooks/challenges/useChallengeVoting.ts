
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { SubmissionVoteData } from "./types";

export function useChallengeVoting() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation pour voter pour une soumission
  const voteSubmission = useMutation({
    mutationFn: async ({ submissionId, vote }: SubmissionVoteData) => {
      // Toast de chargement
      const { dismiss } = toast({
        title: "Vote en cours",
        description: "Enregistrement de votre vote...",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 5000,
      });
      
      // Vérifier si l'utilisateur est connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error("Vous devez être connecté pour voter");
      }
      
      const userId = authData.user.id;
      
      // Vérifier si l'utilisateur a déjà voté pour cette soumission
      const { data: existingVote, error: checkError } = await supabase
        .from('challenge_submission_votes')
        .select('id, vote')
        .eq('submission_id', submissionId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) {
        throw new Error("Erreur lors de la vérification des votes");
      }
      
      let result;
      
      if (existingVote) {
        // Mettre à jour le vote existant
        const { data, error } = await supabase
          .from('challenge_submission_votes')
          .update({ vote })
          .eq('id', existingVote.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Créer un nouveau vote
        const { data, error } = await supabase
          .from('challenge_submission_votes')
          .insert({
            submission_id: submissionId,
            user_id: userId,
            vote
          })
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      // Mettre à jour le score total de la soumission
      const { error: updateError } = await supabase.rpc('update_submission_vote_count', {
        target_submission_id: submissionId
      });
      
      if (updateError) {
        console.error("Erreur lors de la mise à jour du score:", updateError);
      }
      
      dismiss();
      toast({
        title: "Vote enregistré",
        description: "Votre vote a été pris en compte",
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenge-submissions'] });
    },
    onError: (error: any) => {
      console.error("Error voting:", error);
      toast({
        variant: "destructive",
        title: "Erreur de vote",
        description: error.message || "Une erreur est survenue lors du vote",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  });

  return {
    voteSubmission
  };
}
