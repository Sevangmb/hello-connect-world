import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useChallengeActions = () => {
  const { toast } = useToast();

  const handleJoinChallenge = async (challengeId: string, outfitId: string, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Vous devez être connecté pour participer à un défi",
        });
        return;
      }

      const { data: challenge } = await supabase
        .from("challenges")
        .select("status, end_date")
        .eq("id", challengeId)
        .single();

      if (!challenge || challenge.status !== "active" || new Date(challenge.end_date) < new Date()) {
        toast({
          variant: "destructive",
          title: "Défi non disponible",
          description: "Ce défi n'est plus disponible pour participation",
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
        toast({
          variant: "default",
          title: "Déjà inscrit",
          description: "Vous participez déjà à ce défi",
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

      toast({
        title: "Participation confirmée",
        description: "Vous participez maintenant à ce défi",
      });
    } catch (error: any) {
      console.error("Error joining challenge:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rejoindre le défi",
      });
    }
  };

  const handleVote = async (participantId: string, challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Non connecté",
          description: "Vous devez être connecté pour voter",
        });
        return;
      }

      const { error } = await supabase
        .from("challenge_votes")
        .insert({
          challenge_id: challengeId,
          voter_id: user.id,
          participant_id: participantId
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            variant: "default",
            title: "Vote déjà enregistré",
            description: "Vous avez déjà voté pour ce participant",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Vote enregistré",
        description: "Votre vote a été pris en compte",
      });
    } catch (error: any) {
      console.error("Error voting:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
      });
    }
  };

  return {
    handleJoinChallenge,
    handleVote,
  };
};
