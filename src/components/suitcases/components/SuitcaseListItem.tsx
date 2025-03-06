
import { SuitcaseListItemProps } from '../types';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

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
