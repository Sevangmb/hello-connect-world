
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useHashtags = (initialHashtags: string[] = []) => {
  const [hashtags, setHashtags] = useState<string[]>(initialHashtags);

  const generateHashtags = async (type: 'clothes' | 'outfit', item: {
    name: string;
    description?: string;
    category?: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-hashtags', {
        body: {
          type,
          name: item.name,
          description: item.description,
          category: item.category
        }
      });

      if (error) throw error;
      if (data.hashtags) {
        setHashtags(prevHashtags => [...new Set([...prevHashtags, ...data.hashtags])]);
        return data.hashtags;
      }
    } catch (error) {
      console.error("Erreur lors de la génération des hashtags:", error);
      return [];
    }
  };

  const addHashtag = async (hashtag: string) => {
    // D'abord, créer ou récupérer le hashtag dans la table hashtags
    const { data: existingHashtag, error: searchError } = await supabase
      .from("hashtags")
      .select("id")
      .eq("name", hashtag)
      .single();

    if (searchError && searchError.code !== "PGRST116") {
      console.error("Erreur lors de la recherche du hashtag:", searchError);
      return null;
    }

    if (existingHashtag) {
      setHashtags([...hashtags, hashtag]);
      return existingHashtag.id;
    }

    const { data: newHashtag, error: insertError } = await supabase
      .from("hashtags")
      .insert({ name: hashtag })
      .select("id")
      .single();

    if (insertError) {
      console.error("Erreur lors de la création du hashtag:", insertError);
      return null;
    }

    setHashtags([...hashtags, hashtag]);
    return newHashtag.id;
  };

  const removeHashtag = (hashtagToRemove: string) => {
    setHashtags(hashtags.filter(h => h !== hashtagToRemove));
  };

  return {
    hashtags,
    addHashtag,
    removeHashtag,
    setHashtags,
    generateHashtags
  };
};
