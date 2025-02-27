
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
  brand?: string; // Added brand as an optional property
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
