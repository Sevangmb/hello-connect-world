
import { ReactNode } from 'react';

export type SuitcaseStatus = 'active' | 'archived' | 'completed';

export interface Suitcase {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  user_id: string;
  status: SuitcaseStatus;
  created_at: string;
  updated_at: string;
  destination?: string;
}

export interface SuitcaseItem {
  id: string;
  suitcase_id: string;
  clothes_id: string;
  quantity: number;
  created_at: string;
  clothes?: {
    id: string;
    name: string;
    image_url?: string;
    category: string;
    color?: string;
    brand?: string;
  };
}

export interface SuitcaseListProps {
  suitcases: Suitcase[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
