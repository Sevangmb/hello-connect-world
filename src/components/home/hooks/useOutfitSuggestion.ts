
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { OutfitSuggestion } from "../types/weather";

export const useOutfitSuggestion = (temperature: number, description: string) => {
  const { toast } = useToast();

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
