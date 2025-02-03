import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutfitVotingProps {
  outfitId: string;
}

export const OutfitVoting = ({ outfitId }: OutfitVotingProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const { data: voteData, refetch: refetchVotes } = useQuery({
    queryKey: ["outfit-votes", outfitId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const [{ data: likes }, { data: userLike }, { data: userRating }] = await Promise.all([
        supabase
          .from("outfit_likes")
          .select("id", { count: "exact" })
          .eq("outfit_id", outfitId),
        supabase
          .from("outfit_likes")
          .select("id")
          .eq("outfit_id", outfitId)
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("outfit_ratings")
          .select("rating")
          .eq("outfit_id", outfitId)
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      // Update local states
      setIsLiked(!!userLike);
      if (userRating?.rating) {
        setRating(userRating.rating);
      }

      return {
        likes: likes?.length || 0,
        userLike: !!userLike,
        userRating: userRating?.rating || null,
      };
    },
  });

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour aimer une tenue",
        });
        return;
      }

      if (!isLiked) {
        // Try to delete any existing like first to handle potential race conditions
        await supabase
          .from("outfit_likes")
          .delete()
          .eq("outfit_id", outfitId)
          .eq("user_id", user.id);

        const { error } = await supabase
          .from("outfit_likes")
          .insert({ outfit_id: outfitId, user_id: user.id });

        if (error) throw error;

        setIsLiked(true);
        toast({
          title: "J'aime ajouté",
          description: "Vous avez aimé cette tenue",
        });
      } else {
        const { error } = await supabase
          .from("outfit_likes")
          .delete()
          .eq("outfit_id", outfitId)
          .eq("user_id", user.id);

        if (error) throw error;

        setIsLiked(false);
        toast({
          title: "J'aime retiré",
          description: "Vous n'aimez plus cette tenue",
        });
      }

      refetchVotes();
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le j'aime",
      });
    }
  };

  const handleRating = async (value: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour noter une tenue",
        });
        return;
      }

      // Delete any existing rating first to handle potential race conditions
      await supabase
        .from("outfit_ratings")
        .delete()
        .eq("outfit_id", outfitId)
        .eq("user_id", user.id);

      const { error } = await supabase
        .from("outfit_ratings")
        .insert({
          outfit_id: outfitId,
          user_id: user.id,
          rating: value,
        });

      if (error) throw error;

      setRating(value);
      toast({
        title: "Note ajoutée",
        description: "Votre note a été enregistrée",
      });

      refetchVotes();
    } catch (error: any) {
      console.error("Error rating outfit:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter votre note",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLike}
          className={isLiked ? "text-facebook-primary" : ""}
        >
          <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
          {voteData?.likes || 0}
        </Button>
      </div>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            onClick={() => handleRating(value)}
            className={rating === value ? "text-yellow-500" : ""}
          >
            <Star className={`h-4 w-4 ${rating === value ? "fill-current" : ""}`} />
          </Button>
        ))}
      </div>
    </div>
  );
};