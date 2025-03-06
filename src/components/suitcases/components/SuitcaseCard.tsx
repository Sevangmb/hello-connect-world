import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

interface SuitcaseCardProps {
  suitcase: any;
  isSelected?: boolean;
  onClick?: () => void;
}

const SuitcaseCard: React.FC<SuitcaseCardProps> = ({ suitcase, isSelected = false, onClick }) => {
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
    <Card 
      className={`transition-all hover:shadow-md cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg truncate">{name}</h3>
          <Briefcase className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(start_date || end_date) && (
            <div className="text-sm text-muted-foreground">
              {start_date && formatDate(start_date)}
              {start_date && end_date && ' - '}
              {end_date && formatDate(end_date)}
            </div>
          )}
          
          <div className="flex justify-between">
            <Badge variant="outline" className={getStatusColor(status)}>
              {status === 'active' ? 'Active' : status === 'archived' ? 'Archivée' : 'Planifiée'}
            </Badge>
            
            {/* You could add an item count here if available */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuitcaseCard;
