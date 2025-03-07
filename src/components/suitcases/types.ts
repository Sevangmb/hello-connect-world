
import { ReactNode } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

export type SuitcaseStatus = 'active' | 'archived' | 'completed' | 'deleted';

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
  parent_id?: string;
  destination?: string;
}

export interface SuitcaseItem {
  id: string;
  suitcase_id: string;
  clothes_id: string;
  quantity: number;
  folder_id?: string;
  created_at: string;
  is_packed?: boolean;
  notes?: string;
  clothes?: {
    id: string;
    name: string;
    image_url?: string;
    category: string;
    color?: string;
    brand?: string;
    description?: string;
  };
}

export interface SuitcaseCalendarItem {
  id: string;
  suitcase_id: string;
  date: string;
  items: string[];
  created_at: string;
}

export interface SuitcaseFilter {
  status?: SuitcaseStatus | 'all';
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'name' | 'status';
}

export interface EmptySuitcasesProps {
  onCreateClick: () => void;
}

export interface SuitcaseHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export interface SuitcaseFiltersProps {
  filters: SuitcaseFilter;
  onFiltersChange: (filters: SuitcaseFilter) => void;
}

export interface CreateSuitcaseData {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  destination?: string;
}

export interface CreateSuitcaseFormProps {
  onSubmit: (data: CreateSuitcaseData) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateSuitcaseData>;
  isSubmitting?: boolean;
  onSuccess?: () => void;
}

export interface SuitcaseCalendarItemsHookResult {
  data: SuitcaseCalendarItem[];
  isLoading: boolean;
  error: Error | null;
  addCalendarItem: UseMutationResult<any, Error, any, unknown>;
  updateCalendarItem: UseMutationResult<any, Error, any, unknown>;
  removeCalendarItem: UseMutationResult<any, Error, string, unknown>;
}

export interface SuitcaseItemsEmptyProps {
  onAddItems: () => void;
}

export interface SuitcaseItemsHeaderProps {
  onAddItems: () => void;
}

export interface SuitcaseSearchBarProps {
  value: string;
  onChange: (search: string) => void;
}

export interface SuitcaseGridProps {
  suitcases: Suitcase[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface SuitcaseListProps {
  suitcases: Suitcase[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface SuitcaseViewToggleProps {
  viewMode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
}
