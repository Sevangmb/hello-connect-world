
export type WeatherOutfitSuggestionProps = {
  temperature: number;
  description: string;
};

export interface OutfitSuggestion {
  top: ClothingItem | null;
  bottom: ClothingItem | null;
  shoes: ClothingItem | null;
  explanation: string;
  temperature: number;
  description: string;
}

interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
}

