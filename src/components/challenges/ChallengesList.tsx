import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trophy, Users, Calendar, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { JoinChallengeDialog } from "./JoinChallengeDialog";

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
          profiles!challenges_creator_id_profiles_fkey(username),
          participants:challenge_participants(
            id,
            user_id,
            outfit_id,
            comment,
            outfits(name),
            profiles:profiles!inner(username)
          ),
          votes:challenge_votes(count)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching challenges:", error);
        throw error;
      }

      console.log("Fetched challenges:", data);
      return data;
    },
  });

  const handleJoinChallenge = async (challengeId: string, outfitId: string, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      // Check if user is already participating
      const { data: existingParticipation } = await supabase
        .from("challenge_participants")
        .select()
        .eq("challenge_id", challengeId)
        .eq("user_id", user.id)
        .single();

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
      if (!user) throw new Error("Utilisateur non connecté");

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
        Aucun défi n'a encore été créé
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="bg-white p-4 rounded-lg shadow space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-facebook-primary" />
                {challenge.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Créé par {challenge.profiles?.username || "Utilisateur inconnu"}
              </p>
            </div>
            <JoinChallengeDialog 
              challengeId={challenge.id}
              onJoin={(outfitId, comment) => handleJoinChallenge(challenge.id, outfitId, comment)}
            />
          </div>

          {challenge.description && (
            <p className="text-sm text-gray-600">{challenge.description}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Du {format(new Date(challenge.start_date), "PPP", { locale: fr })}
                {" au "}
                {format(new Date(challenge.end_date), "PPP", { locale: fr })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {challenge.participants?.length || 0} participant
                {(challenge.participants?.length || 0) > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {challenge.participants && challenge.participants.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="font-medium">Participants</h4>
              <div className="space-y-2">
                {challenge.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div>
                      <p className="font-medium">{participant.profiles?.username}</p>
                      {participant.outfits && (
                        <p className="text-sm text-gray-600">Tenue: {participant.outfits.name}</p>
                      )}
                      {participant.comment && (
                        <p className="text-sm text-gray-500">{participant.comment}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(participant.id)}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Voter
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};