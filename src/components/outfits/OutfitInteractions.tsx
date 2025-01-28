import { useState } from "react";
import { Star, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OutfitInteractionsProps {
  outfitId: string;
}

export const OutfitInteractions = ({ outfitId }: OutfitInteractionsProps) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!isLiked) {
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
          .match({ outfit_id: outfitId, user_id: user.id });

        if (error) throw error;
        setIsLiked(false);
        toast({
          title: "J'aime retiré",
          description: "Vous n'aimez plus cette tenue",
        });
      }
    } catch (error) {
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
      if (!user) return;

      const { error } = await supabase
        .from("outfit_ratings")
        .upsert({
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
    } catch (error) {
      console.error("Error rating outfit:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter votre note",
      });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("outfit_comments")
        .insert({
          outfit_id: outfitId,
          user_id: user.id,
          content: comment.trim(),
        });

      if (error) throw error;
      setComment("");
      loadComments();
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter votre commentaire",
      });
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from("outfit_comments")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("outfit_id", outfitId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={isLiked ? "text-red-500" : ""}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        </Button>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              variant="ghost"
              size="sm"
              onClick={() => handleRating(value)}
              className={rating === value ? "text-yellow-500" : ""}
            >
              <Star className={`h-5 w-5 ${rating === value ? "fill-current" : ""}`} />
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="resize-none"
        />
        <Button onClick={handleComment} className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Commenter
        </Button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
            <div className="h-8 w-8 rounded-full bg-secondary" />
            <div>
              <p className="font-medium">{comment.profiles?.username || "Utilisateur"}</p>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};