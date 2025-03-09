
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Luggage, MapPin, Trash } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SuitcaseStatus } from '../types';

interface SuitcaseHeaderProps {
  title: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  destination?: string | null;
  status: SuitcaseStatus;
  isOwner: boolean;
  onDelete: () => void;
}

export const SuitcaseHeader: React.FC<SuitcaseHeaderProps> = ({
  title,
  description,
  startDate,
  endDate,
  destination,
  status,
  isOwner,
  onDelete
}) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), 'PPP', { locale: fr });
    } catch {
      return null;
    }
  };

  const getStatusLabel = (status: SuitcaseStatus) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Terminée';
      case 'archived':
        return 'Archivée';
      default:
        return 'Inconnue';
    }
  };

  const getStatusVariant = (status: SuitcaseStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'success';
      case 'archived':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 pb-0">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Luggage className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">{title}</h1>
          <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
        </div>
        
        {isOwner && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        )}
      </div>
      
      {description && (
        <p className="text-gray-500 mb-4">{description}</p>
      )}
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        {destination && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{destination}</span>
          </div>
        )}
        
        {(startDate || endDate) && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatDate(startDate)}
              {startDate && endDate && ' - '}
              {formatDate(endDate)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
