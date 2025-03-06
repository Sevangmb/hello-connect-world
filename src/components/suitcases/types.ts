
import { ReactNode } from 'react';

// Interface pour la valise
export interface Suitcase {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'archived' | 'completed';
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Interface pour les éléments dans une valise
export interface SuitcaseItem {
  id: string;
  suitcase_id: string;
  clothes_id: string;
  quantity: number;
  created_at: string;
}

// Interface pour les props du composant SuitcaseHeader
export interface SuitcaseHeaderProps {
  onRefresh: () => void;
}

// Interface pour les props du composant SuitcaseFilters
export interface SuitcaseFiltersProps {
  filters: {
    status: string;
    search: string;
    date: Date | null;
  };
  statusLabels: Record<string, string>;
  onStatusChange: (status: string) => void;
  onClearSearch: () => void;
}

// Interface pour les props du composant SuitcaseGrid
export interface SuitcaseGridProps {
  suitcases: Suitcase[];
  onSelectSuitcase: (suitcaseId: string) => void;
}

// Interface pour les props du composant EmptySuitcases
export interface EmptySuitcasesProps {
  onCreateClick: () => void;
}

// Interface pour les props du composant SuitcaseItems
export interface SuitcaseItemsProps {
  suitcaseId: string;
  onBack: () => void;
}

// Interface pour les props du formulaire de création de valise
export interface CreateSuitcaseFormProps {
  onSubmit: (data: CreateSuitcaseData) => void;
  onSuccess?: () => void;
  isLoading: boolean;
}

// Interface pour les données de création d'une valise
export interface CreateSuitcaseData {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}
