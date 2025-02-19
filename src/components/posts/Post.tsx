import { Heart, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PostProps {
  id: string;
  author: {
    id: string;
    username: string;
    avatar_url: string;
  };
  content: string;
  created_at: string;
  likes: number;
  liked: boolean;
  comments: Array<{
    id: string;
    content: string;
    created_at: string;
    author: {
      id: string;
      username: string;
      avatar_url: string;
    };
  }>;
}

export const Post = ({ id, author, content, created_at, likes: initialLikes, liked: initialLiked, comments: initialComments }: PostProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      if (!isLiked) {
        const { error } = await supabase
          .from("outfit_likes")
          .insert({ outfit_id: id, user_id: user.id });

        if (error) throw error;
        setLikes(prev => prev + 1);
        setIsLiked(true);
      } else {
        const { error } = await supabase
          .from("outfit_likes")
          .delete()
          .match({ outfit_id: id, user_id: user.id });

        if (error) throw error;
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
    } catch (error: any) {
      console.error("Erreur lors du like:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("outfit_comments")
        .insert({
          outfit_id: id,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        author: {
          id: data.profiles.id,
          username: data.profiles.username,
          avatar_url: data.profiles.avatar_url,
        },
      }]);
      setNewComment("");
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={author.avatar_url} />
          <AvatarFallback>{author.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{author.username}</h3>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: fr })}
          </p>
        </div>
      </div>
      
      <p className="mb-4">{content}</p>

      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isLiked ? 'text-facebook-primary' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          {likes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          {comments.length}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
          />
          <Button 
            onClick={handleComment}
            disabled={loading || !newComment.trim()}
          >
            Commenter
          </Button>
        </div>

        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.avatar_url} />
              <AvatarFallback>{comment.author.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{comment.author.username}</p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
