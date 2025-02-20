
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeMetadata } from "./ChallengeMetadata";
import { ParticipantsList } from "./ParticipantsList";
import { useChallengeActions } from "./ChallengeActions";
import { Challenge } from "./types";

export const ChallengesList = () => {
  const { handleJoinChallenge, handleVote } = useChallengeActions();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      console.log("Fetching challenges...");
      const { data, error } = await supabase
        .from("challenges")
        .select(`
          *,
          profiles(username),
          participants:challenge_participants(
            id,
            user_id,
            outfit_id,
            comment,
            outfits!inner(
              name,
              top:clothes!top_id(name, image_url),
              bottom:clothes!bottom_id(name, image_url),
              shoes:clothes!shoes_id(name, image_url)
            ),
            profiles(username)
          ),
          votes:challenge_votes(count)
        `)
        .order("created_at", { ascending: false })
        .in("status", ["active", "completed"]);

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
      return sortedChallenges as Challenge[];
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
        Aucun défi trouvé
      </div>
    );
  }

  const activeChallenges = challenges.filter(challenge => challenge.status === "active");
  const completedChallenges = challenges.filter(challenge => challenge.status === "completed");

  return (
    <div className="space-y-8">
      {activeChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Défis actifs</h2>
          {activeChallenges.map((challenge: Challenge) => (
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
      )}

      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Défis terminés</h2>
          {completedChallenges.map((challenge: Challenge) => (
            <div
              key={challenge.id}
              className="bg-white p-4 rounded-lg shadow space-y-4 opacity-80"
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
      )}
    </div>
  );
};

