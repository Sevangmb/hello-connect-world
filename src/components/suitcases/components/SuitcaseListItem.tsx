
import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

export interface SuitcaseListItemProps {
  suitcase: {
    id: string;
    name: string;
    description?: string;
  };
  onSelect: (id: string) => void;
}

export const SuitcaseListItem = ({ suitcase, onSelect }: SuitcaseListItemProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => onSelect(suitcase.id)}
    >
      <Briefcase className="h-4 w-4 mr-2" />
      {suitcase.name}
    </Button>
  );
};
