
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trophy, AlertCircle } from "lucide-react";

interface UseChallengeSubmitProps {
  onSuccess?: () => void;
}

export const useChallengeSubmit = ({ onSuccess }: UseChallengeSubmitProps = {}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [participationType, setParticipationType] = useState<"virtual" | "photo">("virtual");
  const [isVotingEnabled, setIsVotingEnabled] = useState(true);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const addHashtag = async (hashtag: string) => {
    try {
      const { data: existingHashtag } = await supabase
        .from("hashtags")
        .select("id")
        .eq("name", hashtag)
        .single();
    
      if (existingHashtag) {
        return existingHashtag.id;
      }
    
      const { data: newHashtag, error } = await supabase
        .from("hashtags")
        .insert({ name: hashtag })
        .select("id")
        .single();
      
      if (error) {
        console.error("Error adding hashtag:", error);
        throw error;
      }
    
      return newHashtag?.id;
    } catch (error) {
      console.error("Error in addHashtag:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Toast de chargement
    const { dismiss } = toast({
      title: "Création du défi",
      description: "Votre défi est en cours de création...",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      duration: 30000,
    });
    
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Step 1: Create challenge
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

      // Step 2: Process hashtags (if any)
      let addedHashtags = 0;
      if (hashtags.length && challengeData?.id) {
        for (const hashtag of hashtags) {
          const hashtagId = await addHashtag(hashtag);
          if (hashtagId) {
            const { error: linkError } = await supabase
              .from("challenge_hashtags")
              .insert({
                challenge_id: challengeData.id,
                hashtag_id: hashtagId
              });
            
            if (!linkError) {
              addedHashtags++;
            }
          }
        }
      }

      // Step 3: Notify followers if available
      try {
        const { data: followers } = await supabase
          .from("followers")
          .select("follower_id")
          .eq("following_id", user.id);
          
        if (followers && followers.length > 0) {
          const notifications = followers.map(follower => ({
            type: "challenge_accepted",
            user_id: follower.follower_id,
            actor_id: user.id,
            message: `a créé un nouveau défi : "${title}"`,
            data: { challenge_id: challengeData.id }
          }));
          
          await supabase.from("notifications").insert(notifications);
        }
      } catch (notifyError) {
        console.error("Error notifying followers:", notifyError);
        // Non-critical error, continue
      }

      // Invalidate and reset
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      resetForm();
      if (onSuccess) {
        onSuccess();
      }

      dismiss();
      toast({
        title: "Défi créé",
        description: `Le défi "${title}" a été créé avec succès ${addedHashtags > 0 ? `avec ${addedHashtags} hashtags` : ''}`,
        icon: <Trophy className="h-4 w-4 text-amber-500" />,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting challenge:", error);
      
      dismiss();
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le défi. Veuillez réessayer.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRules("");
    setRewardDescription("");
    setStartDate("");
    setEndDate("");
    setHashtags([]);
    setParticipationType("virtual");
    setIsVotingEnabled(true);
  };

  return {
    formData: {
      title,
      description,
      rules,
      rewardDescription,
      startDate,
      endDate,
      participationType,
      isVotingEnabled,
      hashtags,
    },
    setters: {
      setTitle,
      setDescription,
      setRules,
      setRewardDescription,
      setStartDate,
      setEndDate,
      setParticipationType,
      setIsVotingEnabled,
      setHashtags,
    },
    handleSubmit,
    isSubmitting,
    resetForm
  };
};
