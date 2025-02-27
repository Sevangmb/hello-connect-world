
export type SuitcaseStatus = 'active' | 'archived' | 'deleted';

export interface Suitcase {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  start_date: string | null;
  end_date: string | null;
  status: SuitcaseStatus;
  created_at: string;
  updated_at: string;
}

export interface SuitcaseItem {
  id: string;
  suitcase_id: string;
  clothes_id: string;
  created_at: string;
  quantity: number;
  folder_id: string | null;
  clothes: {
    id: string;
    name: string;
    image_url: string | null;
    category: string;
    brand?: string; // Make brand optional to match the ClothesItem type
  };
}

export interface SuitcaseCalendarItem extends SuitcaseItem {
  suitcase: Pick<Suitcase, 'start_date' | 'end_date' | 'name'>;
}
