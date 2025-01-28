import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeMetadata } from "./ChallengeMetadata";
import { ParticipantsList } from "./ParticipantsList";
import { Challenge } from "./types";

export const ChallengesList = () => {
  const { toast } = useToast();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      console.log("Fetching challenges...");
      const { data, error } = await supabase
        .from("challenges")
        .select(`
          *,
          profiles!challenges_creator_id_fkey(username),
          participants:challenge_participants(
            id,
            user_id,
            outfit_id,
            comment,
            outfits(name),
            profiles(username)
          ),
          votes:challenge_votes(count)
        `)
        .order("created_at", { ascending: false })
        .eq("status", "active")
        .gte("end_date", new Date().toISOString());

      if (error) {
        console.error("Error fetching challenges:", error);
        throw error;
      }

      const sortedChallenges = data.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA.getTime() - dateB.getTime();
      });

      console.log("Fetched challenges:", sortedChallenges);
      return sortedChallenges;
    },
  });

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

  const handleVote = async (participantId: string) => {
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
          challenge_id: challenges?.find(c => 
            c.participants?.some(p => p.id === participantId)
          )?.id,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!challenges?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun défi actif en ce moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge: Challenge) => (
        <div
          key={challenge.id}
          className="bg-white p-4 rounded-lg shadow space-y-4"
        >
          <ChallengeHeader 
            challenge={challenge} 
            onJoin={(outfitId, comment) => handleJoinChallenge(challenge.id, outfitId, comment)} 
          />
          
          {challenge.description && (
            <p className="text-sm text-gray-600">{challenge.description}</p>
          )}

          <ChallengeMetadata challenge={challenge} />
          
          <ParticipantsList 
            participants={challenge.participants} 
            onVote={handleVote}
          />
        </div>
      ))}
    </div>
  );
};