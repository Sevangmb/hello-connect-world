
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuitcaseStatus } from '../types';

interface SuitcaseHeaderProps {
  title: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  destination?: string | null;
  status: SuitcaseStatus;
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
  isOwner = true,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge>Active</Badge>;
      case 'completed':
        return <Badge variant="success">Terminée</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archivée</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{title}</h1>
            {getStatusBadge()}
          </div>
          
          {description && (
            <p className="text-muted-foreground mt-2 mb-4">{description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {(startDate || endDate) && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>
                  {formatDate(startDate)}
                  {startDate && endDate && ' - '}
                  {formatDate(endDate)}
                </span>
              </div>
            )}
            
            {destination && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>{destination}</span>
              </div>
            )}
          </div>
        </div>
        
        {isOwner && (
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
