
import type { ClothesItem } from "@/components/clothes/types";

export interface SuggestedClothesItem {
  id: string;
  name: string;
  category: string;
}

export interface SuggestionResponse {
  suggestedClothes: SuggestedClothesItem[];
  explanation: string;
}

export interface SuitcaseSuggestionsHookReturn {
  suggestedClothes: SuggestedClothesItem[];
  aiExplanation: string;
  isGettingSuggestions: boolean;
  isAddingSuggestions: boolean;
  showSuggestionsDialog: boolean;
  setShowSuggestionsDialog: (show: boolean) => void;
  error: string | null;
  getSuggestions: (startDate: Date, endDate: Date) => Promise<void>;
  addSuggestedClothes: () => Promise<void>;
}

export interface SuggestionsState {
  suggestedClothes: SuggestedClothesItem[];
  aiExplanation: string;
  isGettingSuggestions: boolean;
  isAddingSuggestions: boolean;
  showSuggestionsDialog: boolean;
  error: string | null;
}
