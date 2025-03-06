
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Suitcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { fr } from 'date-fns/locale';
import { SuitcaseActions } from './components/SuitcaseActions';
import { SuitcaseSuggestionsDialog } from './components/SuitcaseSuggestionsDialog';

interface SuitcaseCardProps {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  itemCount?: number;
  onDelete?: (id: string) => void;
  onShowSuggestions?: (id: string) => void;
}

const SuitcaseCard: React.FC<SuitcaseCardProps> = ({
  id,
  name,
  description,
  startDate,
  endDate,
  destination,
  itemCount = 0,
  onDelete,
  onShowSuggestions
}) => {
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (onDelete) {
        await onDelete(id);
      }
    },
    onSuccess: () => {
      toast.success('Valise supprimée avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error}`);
    }
  });

  const handleViewClick = () => {
    navigate(`/suitcases/${id}`);
  };

  const handleCalendarClick = () => {
    navigate(`/suitcases/${id}/calendar`);
  };

  const handleSuggestionsClick = () => {
    if (onShowSuggestions) {
      onShowSuggestions(id);
    } else {
      setShowSuggestions(true);
    }
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{name}</CardTitle>
          <SuitcaseActions 
            suitcaseId={id}
            onAddItems={() => navigate(`/suitcases/${id}/add-items`)}
            onViewCalendar={handleCalendarClick}
          />
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
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
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium">
              {itemCount} article{itemCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewClick}
          className="flex-1"
        >
          Voir
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSuggestionsClick}
          className="flex-1"
        >
          Suggestions
        </Button>
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="flex-1"
          >
            {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        )}
      </CardFooter>
      
      {showSuggestions && (
        <SuitcaseSuggestionsDialog
          suitcaseId={id}
          open={showSuggestions}
          onOpenChange={setShowSuggestions}
        />
      )}
    </Card>
  );
};

export default SuitcaseCard;
