
/**
 * Types related to suitcase suggestions functionality
 */

/**
 * Represents a clothing item suggested for a suitcase
 */
export interface SuggestedClothesItem {
  id: string;
  name: string;
  category: string;
}

/**
 * Response structure from the AI suggestions
 */
export interface SuggestionResponse {
  suggestedClothes: SuggestedClothesItem[];
  explanation: string;
}

/**
 * State and methods returned by the useSuitcaseSuggestions hook
 */
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
