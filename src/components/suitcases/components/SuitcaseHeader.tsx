
import React from 'react';
import { CalendarRange, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fr } from 'date-fns/locale';

export interface SuitcaseHeaderProps {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  status?: string;
  suitcase?: any;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SuitcaseHeader: React.FC<SuitcaseHeaderProps> = ({
  title,
  description,
  startDate,
  endDate,
  destination,
  status,
  suitcase,
  isOwner = false,
  onEdit,
  onDelete
}) => {
  // Si on a reçu un objet suitcase, extraire les valeurs
  const actualTitle = title || (suitcase?.name || 'Sans titre');
  const actualDescription = description || suitcase?.description;
  const actualStartDate = startDate || suitcase?.start_date;
  const actualEndDate = endDate || suitcase?.end_date;
  const actualDestination = destination || suitcase?.destination;
  const actualStatus = status || suitcase?.status;

  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{actualTitle}</h1>
          
          {actualDescription && (
            <p className="mt-2 text-gray-600">{actualDescription}</p>
          )}
          
          <div className="flex flex-wrap gap-3 mt-3">
            {actualStartDate && (
              <div className="flex items-center text-sm text-gray-600">
                <CalendarRange className="h-4 w-4 mr-1" />
                {format(new Date(actualStartDate), 'dd MMM', { locale: fr })}
                {actualEndDate && ` - ${format(new Date(actualEndDate), 'dd MMM yyyy', { locale: fr })}`}
              </div>
            )}
            
            {actualDestination && (
              <Badge variant="outline" className="text-sm">
                {actualDestination}
              </Badge>
            )}
            
            {actualStatus && (
              <Badge 
                variant={actualStatus === 'active' ? 'default' : 
                         actualStatus === 'completed' ? 'success' : 
                         'secondary'}
                className="text-sm"
              >
                {actualStatus === 'active' ? 'En cours' : 
                 actualStatus === 'completed' ? 'Terminé' : 
                 actualStatus === 'archived' ? 'Archivé' : 'Brouillon'}
              </Badge>
            )}
          </div>
        </div>
        
        {isOwner && (
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button variant="destructive" size="icon" onClick={onDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuitcaseHeader;
