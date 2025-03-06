
export type SuitcaseStatus = 'active' | 'archived' | 'completed' | 'deleted';

export interface SuitcaseFilter {
  status: SuitcaseStatus | 'all';
  search: string;
}

export interface Suitcase {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  destination?: string;
  status: SuitcaseStatus;
  created_at: string;
  updated_at?: string;
}

export interface SuitcaseItem {
  id: string;
  suitcase_id: string;
  clothes_id: string;
  quantity: number;
  notes?: string;
  is_packed: boolean;
  created_at: string;
  updated_at?: string;
  clothes?: any; // Définition complète à ajouter selon besoin
}

export interface SuitcaseCalendarItem {
  id: string;
  suitcase_id: string;
  date: string;
  items: {
    id: string;
    clothes_id: string;
    clothes_name?: string;
    clothes_image?: string;
  }[];
}
