
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { OutfitSuggestion } from "../types/weather";

export const useOutfitSuggestion = (temperature: number, description: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["outfit-suggestion", temperature, description],
    queryFn: async () => {
      try {
        console.log("Fetching outfit suggestion for:", { temperature, description });
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("User not authenticated");
          toast({
            variant: "destructive",
            title: "Non connecté",
            description: "Vous devez être connecté pour voir les suggestions de tenues."
          });
          throw new Error("User not authenticated");
        }

        // Vérifier d'abord si une suggestion récente existe déjà
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
              top:top_id (id, name, image_url, brand),
              bottom:bottom_id (id, name, image_url, brand),
              shoes:shoes_id (id, name, image_url, brand)
            )
          `)
          .eq('user_id', user.id)
          .eq('temperature', temperature)
          .ilike('weather_description', `%${description}%`)
          .gt('created_at', nowMinus15Minutes.toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (!suggestionError && existingSuggestion && existingSuggestion.outfits) {
          console.log("Using existing suggestion:", existingSuggestion);
          
          // Transformer la réponse pour correspondre au format OutfitSuggestion
          return {
            top: existingSuggestion.outfits.top,
            bottom: existingSuggestion.outfits.bottom,
            shoes: existingSuggestion.outfits.shoes,
            explanation: `Pour ${temperature}°C avec un temps ${description}, ${existingSuggestion.outfits.description || 'cette tenue est appropriée.'}`,
            temperature,
            description
          } as OutfitSuggestion;
        }

        // Si aucune suggestion récente n'existe, on continue avec la logique actuelle
        const { data: clothes, error: clothesError } = await supabase
          .from('clothes')
          .select('*')
          .eq('user_id', user.id)
          .eq('archived', false);

        if (clothesError) {
          console.error("Error fetching clothes:", clothesError);
          throw clothesError;
        }

        console.log("Found clothes:", clothes?.length);

        if (!clothes || clothes.length === 0) {
          toast({
            variant: "destructive",
            title: "Aucun vêtement",
            description: "Vous devez d'abord ajouter des vêtements à votre garde-robe."
          });
          throw new Error("No clothes available");
        }

        // Ajouter une tentative avec retry pour la fonction edge
        const maxRetries = 2;
        let lastError = null;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const { data: aiSuggestion, error: aiError } = await supabase.functions.invoke(
              'generate-outfit-suggestion',
              {
                body: {
                  temperature,
                  description,
                  clothes
                }
              }
            );

            if (aiError) {
              console.error(`Attempt ${attempt + 1} failed:`, aiError);
              lastError = aiError;
              
              // Attendre un peu avant de réessayer
              if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
              throw aiError;
            }

            console.log("Received AI suggestion:", aiSuggestion);

            if (aiSuggestion?.suggestion) {
              const { top, bottom, shoes } = aiSuggestion.suggestion;
              
              const topDetails = clothes?.find(c => c.id === top) || null;
              const bottomDetails = clothes?.find(c => c.id === bottom) || null;
              const shoesDetails = clothes?.find(c => c.id === shoes) || null;

              // Enregistrer cette suggestion dans la base de données
              if (topDetails && bottomDetails && shoesDetails) {
                try {
                  // Vérifier d'abord si une tenue similaire existe déjà
                  const { data: existingOutfit } = await supabase
                    .from('outfits')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('top_id', topDetails.id)
                    .eq('bottom_id', bottomDetails.id)
                    .eq('shoes_id', shoesDetails.id)
                    .single();
                  
                  let outfitId;
                  
                  if (existingOutfit) {
                    outfitId = existingOutfit.id;
                  } else {
                    // Créer une nouvelle tenue
                    const { data: newOutfit, error: outfitError } = await supabase
                      .from('outfits')
                      .insert({
                        user_id: user.id,
                        name: `Tenue pour ${temperature}°C, ${description}`,
                        description: aiSuggestion.explanation,
                        top_id: topDetails.id,
                        bottom_id: bottomDetails.id,
                        shoes_id: shoesDetails.id
                      })
                      .select('id')
                      .single();
                      
                    if (outfitError) {
                      console.error("Error creating outfit:", outfitError);
                    } else {
                      outfitId = newOutfit.id;
                    }
                  }
                  
                  // Enregistrer la suggestion météo
                  if (outfitId) {
                    const { error: weatherSuggestionError } = await supabase
                      .from('outfit_weather_suggestions')
                      .insert({
                        user_id: user.id,
                        outfit_id: outfitId,
                        temperature: temperature,
                        weather_description: description
                      });
                      
                    if (weatherSuggestionError) {
                      console.error("Error saving weather suggestion:", weatherSuggestionError);
                    }
                  }
                } catch (dbError) {
                  console.error("Error saving suggestion to database:", dbError);
                  // On continue même si l'enregistrement échoue
                }
              }

              // Invalider les requêtes de tenues pour forcer un rafraîchissement
              queryClient.invalidateQueries({ queryKey: ["outfits"] });

              return {
                top: topDetails,
                bottom: bottomDetails,
                shoes: shoesDetails,
                explanation: aiSuggestion.explanation,
                temperature,
                description
              } as OutfitSuggestion;
            }

            throw new Error("Invalid suggestion format");
          } catch (retryError) {
            console.error(`Attempt ${attempt + 1} error:`, retryError);
            lastError = retryError;
            
            if (attempt === maxRetries) {
              break;
            }
            
            // Attendre un peu avant de réessayer
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        // Si toutes les tentatives ont échoué
        throw lastError || new Error("Failed to generate suggestion after multiple attempts");
      } catch (error) {
        console.error("Error in outfit suggestion query:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la génération de la suggestion."
        });
        throw error;
      }
    },
    enabled: Boolean(temperature) && Boolean(description),
    retry: 1,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
