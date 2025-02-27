
import { supabase } from "@/integrations/supabase/client";
import type { OutfitSuggestion } from "../../types/weather";

export const fetchExistingSuggestion = async (userId: string, temperature: number, description: string) => {
  const nowMinus15Minutes = new Date();
  nowMinus15Minutes.setMinutes(nowMinus15Minutes.getMinutes() - 15);
  
  const { data: existingSuggestion, error: suggestionError } = await supabase
    .from('outfit_weather_suggestions')
    .select(`
      id,
      temperature,
      weather_description,
      outfit_id,
      created_at,
      outfits:outfit_id (
        id,
        name,
        description,
        top:clothes!outfits_top_id_fkey(
          id,
          name,
          image_url,
          brand
        ),
        bottom:clothes!outfits_bottom_id_fkey(
          id,
          name,
          image_url,
          brand
        ),
        shoes:clothes!outfits_shoes_id_fkey(
          id,
          name,
          image_url,
          brand
        )
      )
    `)
    .eq('user_id', userId)
    .eq('temperature', temperature)
    .ilike('weather_description', `%${description}%`)
    .gt('created_at', nowMinus15Minutes.toISOString())
    .order('created_at', { ascending: false })
    .maybeSingle();

  if (existingSuggestion?.outfits) {
    return {
      existingSuggestion: {
        ...existingSuggestion,
        outfits: {
          ...existingSuggestion.outfits,
          top: existingSuggestion.outfits.top || null,
          bottom: existingSuggestion.outfits.bottom || null,
          shoes: existingSuggestion.outfits.shoes || null
        }
      },
      suggestionError
    };
  }

  return { existingSuggestion, suggestionError };
};

export const fetchUserClothes = async (userId: string) => {
  return await supabase
    .from('clothes')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false);
};

export const createOutfitWithSuggestion = async (
  userId: string,
  temperature: number,
  description: string,
  explanation: string,
  topId: string | null,
  bottomId: string | null,
  shoesId: string | null
) => {
  // Create new outfit
  const { data: newOutfit, error: outfitError } = await supabase
    .from('outfits')
    .insert({
      user_id: userId,
      name: `Tenue pour ${temperature}°C, ${description}`,
      description: explanation,
      top_id: topId,
      bottom_id: bottomId,
      shoes_id: shoesId
    })
    .select('id')
    .single();

  if (outfitError || !newOutfit) {
    console.error("Error creating outfit:", outfitError);
    return { error: outfitError };
  }

  // Save weather suggestion
  const { error: weatherSuggestionError } = await supabase
    .from('outfit_weather_suggestions')
    .insert({
      user_id: userId,
      outfit_id: newOutfit.id,
      temperature: temperature,
      weather_description: description
    });

  if (weatherSuggestionError) {
    console.error("Error creating weather suggestion:", weatherSuggestionError);
  }

  // Fetch the complete outfit with clothes details
  const { data: completeOutfit, error: fetchError } = await supabase
    .from('outfits')
    .select(`
      id,
      name,
      description,
      top:clothes!outfits_top_id_fkey(
        id,
        name,
        image_url,
        brand
      ),
      bottom:clothes!outfits_bottom_id_fkey(
        id,
        name,
        image_url,
        brand
      ),
      shoes:clothes!outfits_shoes_id_fkey(
        id,
        name,
        image_url,
        brand
      )
    `)
    .eq('id', newOutfit.id)
    .single();

  if (fetchError) {
    console.error("Error fetching complete outfit:", fetchError);
    return { error: fetchError };
  }

  return { 
    outfitId: newOutfit.id,
    outfit: completeOutfit,
    error: null 
  };
};
