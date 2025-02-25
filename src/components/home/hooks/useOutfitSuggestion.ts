
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
          return null;
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
          return null;
        }

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
          console.error("AI suggestion error:", aiError);
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

        return null;
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
    enabled: !!temperature && !!description,
  });
};

