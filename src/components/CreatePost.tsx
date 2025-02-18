
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from('posts')
        .insert([{ content, user_id: user.id }]);

      if (error) throw error;

      setContent("");
      toast({
        title: "Publication créée",
        description: "Votre publication a été créée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la publication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <Textarea
          placeholder="Quoi de neuf ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit} disabled={isLoading || !content.trim()}>
          Publier
        </Button>
      </CardFooter>
    </Card>
  );
}
