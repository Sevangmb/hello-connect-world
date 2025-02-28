
import { useState, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useChallengeSubmission } from "./challenges/useChallengeSubmission";
import { useChallengeVoting } from "./challenges/useChallengeVoting";
import { ChallengeSubmissionData } from "./challenges/types";

export type { ChallengeSubmissionData };

export function useChallengeSubmit() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { submitChallenge } = useChallengeSubmission();
  const { voteForParticipant } = useChallengeVoting();

  // État du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [participationType, setParticipationType] = useState<string>("virtual");
  const [isVotingEnabled, setIsVotingEnabled] = useState<boolean>(true);
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Mutation pour créer un défi
  const createChallenge = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Vous devez être connecté pour créer un défi");
      if (!startDate || !endDate) throw new Error("Les dates de début et de fin sont requises");

      // Insérer le défi dans la base de données
      const { data, error } = await supabase
        .from("challenges")
        .insert({
          creator_id: user.id,
          title,
          description,
          rules,
          reward_description: rewardDescription,
          start_date: startDate,
          end_date: endDate,
          participation_type: participationType,
          is_voting_enabled: isVotingEnabled,
          status: 'active'
        })
        .select("id")
        .single();

      if (error) throw error;
      
      // Ajouter les hashtags si présents
      if (hashtags.length > 0) {
        for (const tag of hashtags) {
          // Vérifier si le hashtag existe déjà
          let hashtagId: string;
          const { data: existingHashtag } = await supabase
            .from("hashtags")
            .select("id")
            .eq("name", tag)
            .maybeSingle();
            
          if (existingHashtag) {
            hashtagId = existingHashtag.id;
          } else {
            // Créer un nouveau hashtag
            const { data: newHashtag, error: hashtagError } = await supabase
              .from("hashtags")
              .insert({ name: tag })
              .select("id")
              .single();
              
            if (hashtagError) throw hashtagError;
            hashtagId = newHashtag.id;
          }
          
          // Associer le hashtag au défi
          const { error: linkError } = await supabase
            .from("challenge_hashtags")
            .insert({
              challenge_id: data.id,
              hashtag_id: hashtagId
            });
            
          if (linkError) throw linkError;
        }
      }

      return data.id;
    },
    onSuccess: (challengeId) => {
      toast({
        title: "Défi créé avec succès",
        description: "Votre défi a été créé et est maintenant visible par la communauté.",
      });
      navigate(`/challenge/${challengeId}`);
    },
    onError: (error) => {
      console.error("Error creating challenge:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du défi",
      });
    },
  });

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createChallenge.mutate();
  };

  return {
    formData: {
      title,
      description,
      rules,
      rewardDescription,
      startDate,
      endDate,
      participationType,
      isVotingEnabled,
      hashtags
    },
    setters: {
      setTitle,
      setDescription,
      setRules,
      setRewardDescription,
      setStartDate,
      setEndDate,
      setParticipationType,
      setIsVotingEnabled,
      setHashtags
    },
    handleSubmit,
    isSubmitting: createChallenge.isPending,
    // Compatibilité avec le code existant
    submitChallenge,
    voteForParticipant,
    isSubmittingParticipation: submitChallenge.isPending
  };
}
