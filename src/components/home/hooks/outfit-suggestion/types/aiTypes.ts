
export interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
  category: string;
}

export interface CategorizedClothes {
  tops: ClothingItem[];
  bottoms: ClothingItem[];
  shoes: ClothingItem[];
}

export interface AISuggestionResponse {
  suggestion: {
    top: string;
    bottom: string;
    shoes: string;
  };
  explanation: string;
}

export interface OutfitSuggestionResult {
  top: ClothingItem;
  bottom: ClothingItem;
  shoes: ClothingItem;
  explanation: string;
  temperature: number;
  description: string;
  condition?: string;
}

export interface SuggestionResult {
  suggestion: OutfitSuggestionResult | null;
  error: Error | null;
}
