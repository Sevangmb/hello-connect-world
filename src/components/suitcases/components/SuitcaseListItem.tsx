
import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import { Suitcase } from '@/hooks/useSuitcases';

export interface SuitcaseListItemProps {
  suitcase: Suitcase;
  onSelect: (id: string) => void;
  onClick?: () => void; // Add onClick prop as optional
}

export const SuitcaseListItem = ({ suitcase, onSelect, onClick }: SuitcaseListItemProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    onSelect(suitcase.id);
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={handleClick}
    >
      <Briefcase className="h-4 w-4 mr-2" />
      {suitcase.name}
    </Button>
  );
};
