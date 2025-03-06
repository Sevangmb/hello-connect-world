
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Suitcase } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { SuitcaseActions } from './SuitcaseActions';

interface SuitcaseListItemProps {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  itemCount?: number;
}

const SuitcaseListItem: React.FC<SuitcaseListItemProps> = ({
  id,
  name,
  description,
  startDate,
  endDate,
  destination,
  itemCount = 0
}) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/suitcases/${id}`);
  };

  const handleCalendarClick = () => {
    navigate(`/suitcases/${id}/calendar`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      return 'Date invalide';
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          <div className="space-y-1 mt-2">
            {(startDate || endDate) && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {startDate && formatDate(startDate)}
                  {startDate && endDate && ' - '}
                  {endDate && formatDate(endDate)}
                </span>
              </div>
            )}
            {destination && (
              <div className="flex items-center gap-2">
                <Suitcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{destination}</span>
              </div>
            )}
            <div className="mt-2">
              <span className="text-sm font-medium">
                {itemCount} article{itemCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <SuitcaseActions 
            suitcaseId={id} 
            onAddItems={() => navigate(`/suitcases/${id}/add-items`)}
            onViewCalendar={handleCalendarClick}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewClick}
          >
            Voir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuitcaseListItem;
