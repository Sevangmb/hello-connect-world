
import React from 'react';
import { Suitcase } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { SUITCASE_STATUSES } from '../constants/status';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SuitcaseListItemProps {
  suitcase: Suitcase;
  onEdit: () => void;
  onDelete: () => void;
}

export const SuitcaseListItem: React.FC<SuitcaseListItemProps> = ({
  suitcase,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-medium text-lg">{suitcase.name}</h3>
          {suitcase.description && (
            <p className="text-muted-foreground text-sm line-clamp-1">
              {suitcase.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              suitcase.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {SUITCASE_STATUSES[suitcase.status]}
            </span>
            {suitcase.start_date && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(suitcase.start_date), 'dd MMM yyyy', { locale: fr })}
                {suitcase.end_date && (
                  ` - ${format(new Date(suitcase.end_date), 'dd MMM yyyy', { locale: fr })}`
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
