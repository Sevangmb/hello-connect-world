
export interface ClothesFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  image_url: string | null;
  brand: string;
  size: string;
  material: string;
  color: string;
  style: string;
  price: number | null;
  purchase_date: string;
  is_for_sale: boolean;
  needs_alteration: boolean;
  weather_categories: string[];
  hashtags?: string[];
}

export interface ClothesWearHistory {
  id: string;
  clothes?: {
    name: string;
    image_url: string | null;
  };
  worn_date: string;
}

export interface ClothesItem {
  id: string;
  name: string;
  image_url: string | null;
  category: string;
  brand?: string;
  description?: string;
  subcategory?: string;
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  price?: number;
  purchase_date?: string;
  is_for_sale?: boolean;
  needs_alteration?: boolean;
  archived?: boolean;
  weather_categories?: string[];
}

export interface ClothesCalendarState {
  selectedDate: Date | undefined;
  selectedFriend: { id: string; username: string } | null;
}

export interface UseClothesCalendarReturn {
  wearHistory: ClothesWearHistory[] | null;
  clothesList: ClothesItem[] | null;
  isHistoryLoading: boolean;
  isClothesLoading: boolean;
  addClothesToHistory: (clothesId: string, date: Date) => Promise<void>;
  refetchHistory: () => Promise<void>;
}
