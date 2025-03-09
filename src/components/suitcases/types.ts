
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

// Interfaces pour EmptySuitcases
export interface EmptySuitcasesProps {
  onCreateNew?: () => void;
}

// Interfaces pour SuitcaseFilter
export interface SuitcaseFilter {
  status?: SuitcaseStatus;
  startDate?: Date;
  endDate?: Date;
  destination?: string;
  search?: string;
}

// Interface pour SuitcaseGrid
export interface SuitcaseGridProps {
  suitcases: Suitcase[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Interface pour SuitcaseSearchBar
export interface SuitcaseSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Interface pour SuitcaseViewToggle
export interface SuitcaseViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

// Interfaces pour CreateSuitcaseForm
export interface CreateSuitcaseData {
  name: string;
  description?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateSuitcaseFormProps {
  onSubmit: (data: CreateSuitcaseData) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateSuitcaseData>;
  isLoading?: boolean;
}

// Interfaces pour SuitcaseItems
export interface SuitcaseItemsEmptyProps {
  onAddItems?: () => void;
}

export interface SuitcaseItemsHeaderProps {
  itemsCount: number;
  onAddItems?: () => void;
}

// Interface pour SuitcaseCalendarItem
export interface SuitcaseCalendarItem {
  id: string;
  date: string;
  items: SuitcaseItem[];
  outfits?: any[]; // À compléter avec le type exact des tenues si nécessaire
}
