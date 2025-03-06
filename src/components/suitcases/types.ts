
export interface SuitcaseCardProps {
  suitcase: any;
  isSelected?: boolean;
  onClick?: () => void;
  onSelect?: () => void; // Added for compatibility
}

export interface SuitcaseListItemProps {
  suitcase: any;
  isSelected?: boolean;
  onClick?: () => void;
  onSelect?: () => void; // Added for compatibility
}

export interface CreateSuitcaseFormProps {
  onSubmit: (values: any) => Promise<void>;
  onSuccess?: () => void;
  isLoading?: boolean;
}

export interface EmptySuitcasesProps {
  onCreateClick: () => void;
}

export interface SuitcaseItemsProps {
  suitcaseId: string;
  onBack: () => void;
}
