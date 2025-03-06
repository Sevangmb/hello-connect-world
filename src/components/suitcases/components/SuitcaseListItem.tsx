
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar } from 'lucide-react';
import { SuitcaseListItemProps } from '../types';

const SuitcaseListItem: React.FC<SuitcaseListItemProps> = ({ 
  suitcase, 
  isSelected = false, 
  onClick,
  onSelect 
}) => {
  const { name, start_date, end_date, status } = suitcase;
  
  // Format dates nicely
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClick = () => {
    // Support both onClick and onSelect for backward compatibility
    if (onClick) onClick();
    if (onSelect) onSelect();
  };

  return (
    <Card 
      className={`w-full transition-all hover:shadow-md cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <h3 className="font-medium">{name}</h3>
              {(start_date || end_date) && (
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {start_date && formatDate(start_date)}
                  {start_date && end_date && ' - '}
                  {end_date && formatDate(end_date)}
                </div>
              )}
            </div>
          </div>
          
          <Badge variant="outline" className={getStatusColor(status)}>
            {status === 'active' ? 'Active' : status === 'archived' ? 'Archivée' : 'Planifiée'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuitcaseListItem;
