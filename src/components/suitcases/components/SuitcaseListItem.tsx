
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Suitcase } from '../types';
import { SUITCASE_STATUSES } from '../constants/status';
import { Luggage, Calendar } from 'lucide-react';

export interface SuitcaseListItemProps {
  suitcase: Suitcase;
  onSelect: () => void;
}

export const SuitcaseListItem: React.FC<SuitcaseListItemProps> = ({ 
  suitcase, 
  onSelect 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'deleted':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  };

  return (
    <Card 
      className="h-full hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate">{suitcase.name}</CardTitle>
          <Badge className={getStatusColor(suitcase.status)}>
            {SUITCASE_STATUSES[suitcase.status as keyof typeof SUITCASE_STATUSES]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {suitcase.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {suitcase.description}
          </p>
        )}
        
        {suitcase.destination && (
          <div className="flex items-center text-sm mt-1">
            <Luggage className="h-4 w-4 mr-1" />
            <span className="truncate">{suitcase.destination}</span>
          </div>
        )}
        
        {(suitcase.start_date || suitcase.end_date) && (
          <div className="flex items-center text-sm mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {suitcase.start_date && new Date(suitcase.start_date).toLocaleDateString()} 
              {suitcase.start_date && suitcase.end_date && ' - '} 
              {suitcase.end_date && new Date(suitcase.end_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        Créée {formatDistanceToNow(new Date(suitcase.created_at), { addSuffix: true, locale: fr })}
      </CardFooter>
    </Card>
  );
};
