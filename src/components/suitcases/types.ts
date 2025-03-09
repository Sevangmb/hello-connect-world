
export type SuitcaseStatus = 'active' | 'archived' | 'completed';

export interface Suitcase {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  destination?: string;
  start_date?: string | null;
  end_date?: string | null;
  status: SuitcaseStatus;
  created_at?: string;
  updated_at?: string;
  parent_id?: string | null;
}

export interface SuitcaseItem {
  id: string;
  suitcase_id: string;
  clothes_id: string;
  quantity: number;
  folder_id?: string | null;
  created_at?: string;
  clothes?: {
    name: string;
    image_url?: string | null;
    category: string;
    color?: string;
  };
}

export interface SuitcaseFolder {
  id: string;
  suitcase_id: string;
  name: string;
  parent_folder_id?: string | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface SuitcaseNote {
  id: string;
  suitcase_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface SuitcaseWithStats extends Suitcase {
  item_count?: number;
  outfit_count?: number;
}

export interface SuitcaseFormData {
  name: string;
  description?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
}
