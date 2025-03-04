
export type WeatherOutfitSuggestionProps = {
  temperature: number;
  description: string;
  condition?: 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other';
  windSpeed?: number;
  humidity?: number;
};

export interface OutfitSuggestion {
  top: ClothingItem | null;
  bottom: ClothingItem | null;
  shoes: ClothingItem | null;
  explanation: string;
  temperature: number;
  description: string;
  condition?: string;
}

interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
}
