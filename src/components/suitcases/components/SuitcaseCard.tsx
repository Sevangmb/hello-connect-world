
import React from 'react';
import { Suitcase } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { SUITCASE_STATUSES } from '../constants/status';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SuitcaseCardProps {
  suitcase: Suitcase;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SuitcaseCard: React.FC<SuitcaseCardProps> = ({
  suitcase,
  onEdit,
  onDelete
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(suitcase.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(suitcase.id);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{suitcase.name}</CardTitle>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            suitcase.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {SUITCASE_STATUSES[suitcase.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {suitcase.description && (
          <p className="text-muted-foreground text-sm mb-2">
            {suitcase.description}
          </p>
        )}
        {suitcase.start_date && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Dates: </span>
            {format(new Date(suitcase.start_date), 'dd MMM yyyy', { locale: fr })}
            {suitcase.end_date && (
              ` - ${format(new Date(suitcase.end_date), 'dd MMM yyyy', { locale: fr })}`
            )}
          </p>
        )}
      </CardContent>
      <CardFooter className="justify-between pt-2 border-t">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive">
          <Trash className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
