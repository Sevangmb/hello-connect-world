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
import { Loader2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
            profiles(username)
          ),
          votes:challenge_votes(count),
          hashtags:challenge_hashtags(
            hashtags(name)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
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

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{challenge.title}</CardTitle>
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
              
              <ParticipantsList 
                participants={challenge.participants} 
                onVote={handleVote}
                challengeId={challenge.id}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
