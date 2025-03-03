import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { ChallengeMetadata } from "@/components/challenges/ChallengeMetadata";
import { ParticipantsList } from "@/components/challenges/ParticipantsList";
import { useChallengeActions } from "@/components/challenges/ChallengeActions";
import { Loader2, AlertTriangle, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Challenge } from "@/components/challenges/types";

export default function Challenge() {
  const { id } = useParams();
  const { handleJoinChallenge, handleVote } = useChallengeActions();

  const { data: challenge, isLoading, error } = useQuery({
    queryKey: ["challenge", id],
    queryFn: async () => {
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
          votes:challenge_votes(count),
          hashtags:challenge_hashtags(
            hashtags(name)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data.participation_type !== "virtual" && data.participation_type !== "photo") {
        throw new Error("Invalid participation_type value");
      }

      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      const isActive = now >= startDate && now <= endDate;

      return {
        ...data,
        participation_type: data.participation_type as "virtual" | "photo",
        isActive
      } as Challenge & { isActive: boolean };
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16 md:pb-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16 md:pb-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-500" />
          <p className="text-muted-foreground">
            Une erreur est survenue lors du chargement du défi
          </p>
        </div>
      </div>
    );
  }

  const sortedParticipants = !challenge.isActive && challenge.participants
    ? [...challenge.participants].sort((a, b) => {
        const votesA = a.votes?.length || 0;
        const votesB = b.votes?.length || 0;
        return votesB - votesA;
      })
    : challenge.participants;
  
  const winner = !challenge.isActive && sortedParticipants?.length > 0 
    ? sortedParticipants[0] 
    : null;

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                  <Badge variant={challenge.isActive ? "secondary" : "outline"}>
                    {challenge.isActive ? "En cours" : "Terminé"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {challenge.hashtags?.map((tag: any) => (
                    <Badge key={tag.hashtags.name} variant="secondary">
                      #{tag.hashtags.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {challenge.description && (
                <div className="prose prose-sm max-w-none">
                  <p>{challenge.description}</p>
                </div>
              )}
              
              <Separator />
              
              <ChallengeMetadata challenge={challenge} />
              
              <Separator />
              
              {!challenge.isActive && (
                <div className="bg-yellow-50 p-4 rounded-md mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm font-medium text-yellow-800">
                      Ce défi est terminé. Les votes et la participation ne sont plus possibles.
                    </p>
                  </div>
                  
                  {winner && winner.outfits && (
                    <div className="mt-3 flex flex-col items-center space-y-2">
                      <p className="text-sm font-semibold text-center">Vainqueur du défi:</p>
                      <img 
                        src={`https://img.shields.io/badge/${encodeURIComponent(challenge.title.replace(/ /g, '_'))}-Vainqueur-green?style=for-the-badge&logo=trophy&logoColor=gold`}
                        alt="Badge vainqueur"
                        className="h-8"
                      />
                      <img 
                        src={`https://img.shields.io/badge/${encodeURIComponent(winner.profiles.username || 'Utilisateur')}-${encodeURIComponent(winner.outfits.name.replace(/ /g, '_'))}-blue?style=flat-square&logo=fashion`}
                        alt="Badge tenue gagnante"
                        className="h-6 mt-1"
                      />
                    </div>
                  )}
                </div>
              )}
              
              <ParticipantsList 
                participants={challenge.participants} 
                onVote={handleVote}
                challengeId={challenge.id}
                isVotingEnabled={challenge.isActive && challenge.is_voting_enabled}
                showFinalRanking={!challenge.isActive}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
