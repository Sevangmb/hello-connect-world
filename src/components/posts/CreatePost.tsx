
import { Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("posts")
        .insert({
          content: content.trim(),
          user_id: user.id,
        });

      if (error) throw error;

      setContent("");
      toast({
        title: "Publication créée",
        description: "Votre message a été publié avec succès",
      });
    } catch (error: any) {
      console.error("Erreur lors de la création du post:", error);
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
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="Que voulez-vous partager ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 resize-none"
        />
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" className="gap-2">
            <Image className="h-5 w-5" />
            Photo
          </Button>
          <Button 
            type="submit" 
            className="bg-facebook-primary hover:bg-facebook-hover"
            disabled={loading || !content.trim()}
          >
            {loading ? "Publication en cours..." : "Publier"}
          </Button>
        </div>
      </form>
    </Card>
  );
};