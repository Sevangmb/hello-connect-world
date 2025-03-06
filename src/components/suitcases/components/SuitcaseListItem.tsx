
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

interface SuitcaseListItemProps {
  suitcase: any;
  isSelected?: boolean;
  onClick?: () => void;
}

const SuitcaseListItem: React.FC<SuitcaseListItemProps> = ({ suitcase, isSelected = false, onClick }) => {
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

  return (
    <div 
      className={`border rounded-md p-4 flex items-center justify-between transition-all hover:shadow-sm cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <Briefcase className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="font-medium">{name}</h3>
          {(start_date || end_date) && (
            <div className="text-sm text-muted-foreground">
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
  );
};

export default SuitcaseListItem;
