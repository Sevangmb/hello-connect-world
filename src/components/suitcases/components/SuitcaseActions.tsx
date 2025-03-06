
import React from 'react';
import { Button } from '@/components/ui/button';

export interface SuitcaseActionsProps {
  suitcaseId: string;
  onAddItems?: () => void;
  onViewCalendar?: () => void;
}

export const SuitcaseActions: React.FC<SuitcaseActionsProps> = ({
  suitcaseId,
  onAddItems,
  onViewCalendar
}) => {
  return (
    <div className="flex gap-2">
      {onAddItems && (
        <Button variant="outline" size="sm" onClick={onAddItems}>
          Ajouter des articles
        </Button>
      )}
      {onViewCalendar && (
        <Button variant="outline" size="sm" onClick={onViewCalendar}>
          Voir le calendrier
        </Button>
      )}
    </div>
  );
};
