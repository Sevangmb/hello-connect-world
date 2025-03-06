
export interface SuitcaseCardProps {
  suitcase: any;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface SuitcaseListItemProps {
  suitcase: any;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface CreateSuitcaseFormProps {
  onSubmit: (values: any) => Promise<void>;
  isLoading?: boolean;
}

export interface EmptySuitcasesProps {
  onCreateClick: () => void;
}

export interface SuitcaseItemsProps {
  suitcaseId: string;
  onBack: () => void;
}
