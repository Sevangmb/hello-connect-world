
import React from 'react';
import { CalendarIcon, Luggage, Suitcase as SuitcaseIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Suitcase } from '../types';

interface SuitcaseCardProps {
  suitcase: Suitcase;
  onClick: () => void;
}

export const SuitcaseCard: React.FC<SuitcaseCardProps> = ({ suitcase, onClick }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    active: 'Active',
    archived: 'Archivée',
    completed: 'Terminée'
  };

  const formattedCreatedAt = formatDistanceToNow(
    new Date(suitcase.created_at),
    { addSuffix: true, locale: fr }
  );

  const formatDateIfValid = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd/MM/yyyy', { locale: fr }) : null;
  };

  const startDate = formatDateIfValid(suitcase.start_date);
  const endDate = formatDateIfValid(suitcase.end_date);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">{suitcase.name}</CardTitle>
          <Badge className={statusColors[suitcase.status]}>
            {statusLabels[suitcase.status]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {suitcase.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {suitcase.description}
          </p>
        )}
        
        {(startDate || endDate) && (
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>
              {startDate && endDate 
                ? `${startDate} - ${endDate}`
                : startDate || endDate
              }
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-2 flex justify-between">
        <div className="flex items-center">
          <Luggage className="w-3 h-3 mr-1" />
          <span>Créée {formattedCreatedAt}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
