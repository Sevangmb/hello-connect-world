
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
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const CreateChallenge = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [participationType, setParticipationType] = useState<"virtual" | "photo">("virtual");
  const [isVotingEnabled, setIsVotingEnabled] = useState(true);
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
          rules,
          reward_description: rewardDescription,
          start_date: startDate,
          end_date: endDate,
          creator_id: user.id,
          status: "active",
          participation_type: participationType,
          is_voting_enabled: isVotingEnabled
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
      setRules("");
      setRewardDescription("");
      setStartDate("");
      setEndDate("");
      setHashtags([]);
      setParticipationType("virtual");
      setIsVotingEnabled(true);
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
          placeholder="Décrivez le thème du défi..."
        />
      </div>

      <div>
        <Label htmlFor="rules">Règles du défi</Label>
        <Textarea
          id="rules"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="Listez les règles du défi..."
        />
      </div>

      <div>
        <Label htmlFor="rewardDescription">Description des récompenses</Label>
        <Textarea
          id="rewardDescription"
          value={rewardDescription}
          onChange={(e) => setRewardDescription(e.target.value)}
          placeholder="Décrivez les récompenses..."
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

      <div className="space-y-2">
        <Label>Type de participation</Label>
        <RadioGroup 
          value={participationType} 
          onValueChange={(value: "virtual" | "photo") => setParticipationType(value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="virtual" id="virtual" />
            <Label htmlFor="virtual">Tenue virtuelle</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="photo" id="photo" />
            <Label htmlFor="photo">Photo</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={isVotingEnabled}
          onCheckedChange={setIsVotingEnabled}
          id="voting"
        />
        <Label htmlFor="voting">Activer les votes</Label>
      </div>
      
      <ClothesHashtags
        initialHashtags={[]}
        onHashtagsChange={setHashtags}
      />
      
      <Button type="submit">Créer le défi</Button>
    </form>
  );
};
