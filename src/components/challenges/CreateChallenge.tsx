
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { ClothesHashtags } from "@/components/clothes/forms/ClothesHashtags";
import { ChallengeBasicInfo } from "./forms/ChallengeBasicInfo";
import { ChallengeDates } from "./forms/ChallengeDates";
import { ChallengeParticipationSettings } from "./forms/ChallengeParticipationSettings";

export const CreateChallenge = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [participationType, setParticipationType] = useState<"virtual" | "photo">("virtual");
  const [isVotingEnabled, setIsVotingEnabled] = useState(true);
  const [hashtags, setHashtags] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ChallengeBasicInfo
        title={title}
        description={description}
        rules={rules}
        rewardDescription={rewardDescription}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onRulesChange={setRules}
        onRewardDescriptionChange={setRewardDescription}
      />
      
      <ChallengeDates
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      
      <ChallengeParticipationSettings
        participationType={participationType}
        isVotingEnabled={isVotingEnabled}
        onParticipationTypeChange={setParticipationType}
        onVotingEnabledChange={setIsVotingEnabled}
      />
      
      <ClothesHashtags
        initialHashtags={[]}
        onHashtagsChange={setHashtags}
      />
      
      <Button type="submit">Créer le défi</Button>
    </form>
  );
};
