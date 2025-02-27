
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { SuggestedClothesItem } from "../types/suitcaseSuggestionsTypes";

/**
 * Hook to manage the state for suitcase suggestions
 */
export const useSuitcaseSuggestionsState = () => {
  const [suggestedClothes, setSuggestedClothes] = useState<SuggestedClothesItem[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [isAddingSuggestions, setIsAddingSuggestions] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Reset suggestions state
   */
  const resetSuggestionsState = () => {
    setSuggestedClothes([]);
    setAiExplanation("");
    setError(null);
  };

  /**
   * Update suggestions state with new data
   */
  const updateSuggestionsState = (
    suggestions: SuggestedClothesItem[], 
    explanation: string
  ) => {
    setSuggestedClothes(suggestions);
    setAiExplanation(explanation);
    setShowSuggestionsDialog(true);
  };

  return {
    // State
    suggestedClothes,
    aiExplanation,
    isGettingSuggestions,
    isAddingSuggestions,
    showSuggestionsDialog,
    error,
    
    // State updaters
    setSuggestedClothes,
    setAiExplanation,
    setIsGettingSuggestions,
    setIsAddingSuggestions,
    setShowSuggestionsDialog,
    setError,
    resetSuggestionsState,
    updateSuggestionsState,
    
    // Dependencies
    toast,
    queryClient
  };
};
