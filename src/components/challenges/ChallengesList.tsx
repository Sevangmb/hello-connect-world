
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeMetadata } from "./ChallengeMetadata";
import { ParticipantsList } from "./ParticipantsList";
import { useChallengeActions } from "./ChallengeActions";
import { Challenge } from "./types";

interface ChallengesListProps {
  filter: "ongoing" | "upcoming" | "completed";
}

export const ChallengesList = ({ filter }: ChallengesListProps) => {
  const { handleJoinChallenge, handleVote } = useChallengeActions();
  const now = new Date().toISOString();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges", filter],
    queryFn: async () => {
      console.log("Fetching challenges...");
      let query = supabase
        .from("challenges")
        .select(`
          *,
          profiles(username),
          participants:challenge_participants(
            id,
            user_id,
            outfit_id,
            comment,
            status,
            moderated_at,
            moderated_by,
            moderation_status,
            moderation_reason,
            outfits!inner(
              name,
              top:clothes!top_id(name, image_url),
              bottom:clothes!bottom_id(name, image_url),
              shoes:clothes!shoes_id(name, image_url)
            ),
            profiles(username),
            votes:challenge_votes(id)
          ),
          votes:challenge_votes(count)
        `);

      // Appliquer les filtres en fonction de l'onglet sélectionné
      switch (filter) {
        case "ongoing":
          query = query
            .lte("start_date", now)
            .gt("end_date", now)
            .eq("status", "active");
          break;
        case "upcoming":
          query = query
            .gt("start_date", now)
            .eq("status", "active");
          break;
        case "completed":
          query = query
            .lte("end_date", now)
            .eq("status", "completed");
          break;
      }

      const { data, error } = await query.order("start_date", { ascending: true });

      if (error) {
        console.error("Error fetching challenges:", error);
        throw error;
      }

      console.log("Fetched challenges:", data);
      return data as Challenge[];
    },
  });

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
        {filter === "ongoing" && "Aucun défi en cours"}
        {filter === "upcoming" && "Aucun défi à venir"}
        {filter === "completed" && "Aucun défi terminé"}
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
            onVote={(participantId) => handleVote(participantId, challenge.id)}
          />
          
          {challenge.description && (
            <p className="text-sm text-gray-600">{challenge.description}</p>
          )}

          <ChallengeMetadata challenge={challenge} />
          
          <ParticipantsList 
            participants={challenge.participants} 
            onVote={handleVote}
            challengeId={challenge.id}
          />
        </div>
      ))}
    </div>
  );
};
