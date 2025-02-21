
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { ClothesHashtags } from "@/components/clothes/forms/ClothesHashtags";

export const CreateChallenge = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [hashtags, setHashtags] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Créer le défi
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .insert({
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          creator_id: user.id,
          status: "active",
        })
        .select()
        .single();

      if (challengeError) {
        console.error("Error creating challenge:", challengeError);
        throw challengeError;
      }

      // Ajouter les hashtags au défi
      if (hashtags.length && challengeData?.id) {
        for (const hashtag of hashtags) {
          const hashtagId = await addHashtag(hashtag);
          if (hashtagId) {
            await supabase.from("challenge_hashtags").insert({
              challenge_id: challengeData.id,
              hashtag_id: hashtagId
            });
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['challenges'] });

      toast({
        title: "Défi créé",
        description: "Le défi a été créé avec succès",
      });
      
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setHashtags([]);
    } catch (error) {
      console.error("Error submitting challenge:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le défi",
      });
    }
  };

  const addHashtag = async (hashtag: string) => {
    const { data: existingHashtag } = await supabase
      .from("hashtags")
      .select("id")
      .eq("name", hashtag)
      .single();
  
    if (existingHashtag) {
      return existingHashtag.id;
    }
  
    const { data: newHashtag } = await supabase
      .from("hashtags")
      .insert({ name: hashtag })
      .select("id")
      .single();
  
    return newHashtag?.id;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez les règles et objectifs du défi..."
        />
      </div>
      <div>
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      
      <ClothesHashtags
        initialHashtags={[]}
        onHashtagsChange={setHashtags}
      />
      
      <Button type="submit">Créer le défi</Button>
    </form>
  );
};
