
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { ChallengeSubmissionData } from "./types";

export function useChallengeSubmission() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutation pour soumettre une participation au challenge
  const submitChallenge = useMutation({
    mutationFn: async (data: ChallengeSubmissionData) => {
      setIsSubmitting(true);
      
      // Toast de chargement
      const { dismiss } = toast({
        title: "Soumission en cours",
        description: "Envoi de votre participation au challenge...",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        duration: 10000,
      });

      try {
        // Vérifier si l'utilisateur est connecté
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          throw new Error("Vous devez être connecté pour participer");
        }

        const userId = authData.user.id;
        
        // Vérifier si l'utilisateur a déjà participé à ce challenge
        const { data: existingSubmission, error: checkError } = await supabase
          .from('challenge_submissions')
          .select('id')
          .eq('challenge_id', data.challengeId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (checkError) {
          throw new Error("Erreur lors de la vérification des participations");
        }
        
        if (existingSubmission) {
          throw new Error("Vous avez déjà participé à ce challenge");
        }

        // Si un outfit existant est utilisé
        if (data.outfitId) {
          // Vérifier que l'outfit appartient bien à l'utilisateur
          const { data: outfit, error: outfitError } = await supabase
            .from('outfits')
            .select('id')
            .eq('id', data.outfitId)
            .eq('user_id', userId)
            .single();
            
          if (outfitError || !outfit) {
            throw new Error("La tenue sélectionnée n'est pas valide");
          }
        }
        
        // Insérer la soumission au challenge
        const { data: submission, error: submissionError } = await supabase
          .from('challenge_submissions')
          .insert({
            challenge_id: data.challengeId,
            user_id: userId,
            outfit_id: data.outfitId || null,
            description: data.description || null,
            additional_data: data.additionalData || null,
            status: 'pending',
            submission_date: new Date().toISOString()
          })
          .select('*')
          .single();
          
        if (submissionError) {
          throw submissionError;
        }
        
        // Si des vêtements individuels sont soumis, les lier à la soumission
        if (data.clothesIds && data.clothesIds.length > 0) {
          const clothesSubmissions = data.clothesIds.map(clothesId => ({
            submission_id: submission.id,
            clothes_id: clothesId
          }));
          
          const { error: clothesError } = await supabase
            .from('challenge_submission_clothes')
            .insert(clothesSubmissions);
            
          if (clothesError) {
            console.error("Erreur lors de l'ajout des vêtements:", clothesError);
            // On ne fait pas échouer la soumission complète si cette partie échoue
          }
        }
        
        // Incrémenter le compteur de participations du challenge
        const { error: updateError } = await supabase.rpc('increment_challenge_submissions_count', {
          challenge_id: data.challengeId
        });
        
        if (updateError) {
          console.error("Erreur lors de la mise à jour du compteur:", updateError);
          // Ne pas faire échouer la soumission pour cette raison
        }
        
        // Toast de succès
        dismiss();
        toast({
          title: "Participation réussie",
          description: "Votre participation au challenge a été enregistrée avec succès !",
          icon: <Check className="h-4 w-4 text-green-500" />,
          duration: 5000,
        });
        
        return submission;
      } catch (error: any) {
        dismiss();
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la soumission",
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 5000,
        });
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-submissions'] });
    },
    onError: (error: any) => {
      console.error("Error submitting challenge:", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  return {
    submitChallenge,
    isSubmitting
  };
}
