
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { handleSuggestionProcess } from "./outfit-suggestion/utils/suggestionHandler";
import { showLoadingToast } from "./outfit-suggestion/utils/toastManager";
import { OutfitSuggestionState } from "./outfit-suggestion/types/suggestionTypes";

export const useOutfitSuggestion = (temperature: number, description: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [state, setState] = useState<OutfitSuggestionState>({ toastId: null });

  const result = useQuery({
    queryKey: ["outfit-suggestion", temperature, description],
    queryFn: async () => {
      try {
        console.log("Fetching outfit suggestion for:", { temperature, description });
        
        // Toast de chargement initial
        const toastResult = showLoadingToast(toast, {
          title: "Préparation de votre tenue",
          description: "Nous recherchons la tenue idéale pour aujourd'hui..."
        });
        
        setState({ toastId: toastResult.id });
        
        // Processus de suggestion
        const result = await handleSuggestionProcess(
          toast,
          temperature,
          description,
          toastResult.id,
          toastResult.dismiss
        );
        
        if (result.error) {
          throw result.error;
        }
        
        return result.suggestion!;
      } catch (error) {
        console.error("Error in outfit suggestion query:", error);
        throw error;
      } finally {
        setState({ toastId: null });
      }
    },
    enabled: Boolean(temperature) && Boolean(description),
    retry: 1,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Nettoyage du toast lors du démontage
  useEffect(() => {
    return () => {
      if (state.toastId) {
        toast({
          id: state.toastId,
          title: "",
          description: ""
        });
      }
    };
  }, [state.toastId, toast]);

  return result;
};
