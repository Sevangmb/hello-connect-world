
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";

export const useChallengeActions = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleJoinChallenge = async (challengeId: string, outfitId: string, comment: string) => {
    try {
      setLoading(prev => ({ ...prev, [challengeId]: true }));
      
      // Toast de chargement
      const { dismiss } = toast({
        title: "Traitement en cours",
        description: "Votre participation au défi est en cours de traitement...",
        duration: 10000,
      });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        dismiss();
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Vous devez être connecté pour participer à un défi",
          duration: 5000,
        });
        return;
      }

      const { data: challenge } = await supabase
        .from("challenges")
        .select("status, end_date, title")
        .eq("id", challengeId)
        .single();

      if (!challenge || challenge.status !== "active" || new Date(challenge.end_date) < new Date()) {
        dismiss();
        toast({
          variant: "destructive",
          title: "Défi non disponible",
          description: "Ce défi n'est plus disponible pour participation",
          duration: 5000,
        });
        return;
      }

      const { data: existingParticipation } = await supabase
        .from("challenge_participants")
        .select()
        .eq("challenge_id", challengeId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingParticipation) {
        dismiss();
        toast({
          variant: "default",
          title: "Déjà inscrit",
          description: "Vous participez déjà à ce défi",
          duration: 5000,
        });
        return;
      }

      const { error } = await supabase
        .from("challenge_participants")
        .insert({ 
          challenge_id: challengeId, 
          user_id: user.id,
          outfit_id: outfitId,
          comment: comment
        });

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
            type: "challenge_accepted",
            user_id: challengeData.creator_id,
            actor_id: user.id,
            message: `a rejoint votre défi "${challengeData.title}"`,
            data: { challenge_id: challengeId }
          });
      }

      dismiss();
      toast({
        title: "Participation confirmée",
        description: "Vous participez maintenant à ce défi",
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error joining challenge:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rejoindre le défi",
        duration: 5000,
      });
    } finally {
      setLoading(prev => ({ ...prev, [challengeId]: false }));
    }
  };

  const handleVote = async (participantId: string, challengeId: string) => {
    try {
      setLoading(prev => ({ ...prev, [participantId]: true }));
      
      // Toast de chargement
      const { dismiss } = toast({
        title: "Vote en cours",
        description: "Votre vote est en cours d'enregistrement...",
        duration: 10000,
      });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        dismiss();
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Vous devez être connecté pour voter",
          duration: 5000,
        });
        return;
      }

      const { data: participantData } = await supabase
        .from("challenge_participants")
        .select("user_id")
        .eq("id", participantId)
        .single();

      const { error } = await supabase
        .from("challenge_votes")
        .insert({
          challenge_id: challengeId,
          voter_id: user.id,
          participant_id: participantId
        });

      if (error) {
        if (error.code === "23505") {
          dismiss();
          toast({
            variant: "default",
            title: "Vote déjà enregistré",
            description: "Vous avez déjà voté pour ce participant",
            duration: 5000,
          });
          return;
        }
        throw error;
      }

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
        icon: <Check className="h-4 w-4 text-green-500" />,
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error voting:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 5000,
      });
    } finally {
      setLoading(prev => ({ ...prev, [participantId]: false }));
    }
  };

  const isLoading = (id: string) => loading[id] || false;

  return {
    handleJoinChallenge,
    handleVote,
    isLoading
  };
};
