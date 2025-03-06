
import { useState } from 'react';
import { useClothes } from '@/hooks/useClothes';

export interface SuitcaseSuggestionsHook {
  suggestions: any[];
  loading: boolean;
  isGettingSuggestions: boolean;
  isAddingSuggestions: boolean;
  suggestedClothes: any[];
  showSuggestionsDialog: boolean;
  setShowSuggestionsDialog: (show: boolean) => void;
  aiExplanation: string;
  getSuggestions: (startDate: Date, endDate: Date) => void;
  addSuggestedClothes: () => void;
}

export const useSuitcaseSuggestions = (suitcaseId: string): SuitcaseSuggestionsHook => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState<boolean>(false);
  const [isAddingSuggestions, setIsAddingSuggestions] = useState<boolean>(false);
  const [suggestedClothes, setSuggestedClothes] = useState<any[]>([]);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  
  const { clothes } = useClothes({});

  const getSuggestions = (startDate: Date, endDate: Date) => {
    setIsGettingSuggestions(true);
    
    setTimeout(() => {
      // Mock implementation - in a real app, this would call an API
      const mockSuggestions = clothes.slice(0, 5);
      setSuggestedClothes(mockSuggestions);
      setAiExplanation('These clothes are recommended based on the weather forecast and your preferences.');
      setIsGettingSuggestions(false);
      setShowSuggestionsDialog(true);
    }, 1500);
  };

  const addSuggestedClothes = () => {
    setIsAddingSuggestions(true);
    
    setTimeout(() => {
      // Mock implementation - in a real app, this would add the suggested clothes to the suitcase
      setSuggestions([...suggestions, ...suggestedClothes]);
      setIsAddingSuggestions(false);
      setShowSuggestionsDialog(false);
    }, 1000);
  };

  return {
    suggestions,
    loading,
    isGettingSuggestions,
    isAddingSuggestions,
    suggestedClothes,
    showSuggestionsDialog,
    setShowSuggestionsDialog,
    aiExplanation,
    getSuggestions,
    addSuggestedClothes
  };
};
