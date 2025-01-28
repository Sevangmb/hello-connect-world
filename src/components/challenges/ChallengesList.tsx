import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trophy, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

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
          creator:profiles(username),
          participants:challenge_participants(count),
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

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from("challenge_participants")
        .insert({ challenge_id: challengeId, user_id: user.id });

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
                Créé par {challenge.creator?.username || "Utilisateur inconnu"}
              </p>
            </div>
            <Button onClick={() => handleJoinChallenge(challenge.id)}>
              Participer
            </Button>
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
                {challenge.participants?.[0]?.count || 0} participant
                {(challenge.participants?.[0]?.count || 0) > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};