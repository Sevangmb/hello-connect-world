import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, Plus, Archive, Scissors } from 'lucide-react';
import { useSuitcaseSuggestions } from '../hooks/suitcase-suggestions/useSuitcaseSuggestions';
import { SuitcaseSuggestionsDialog } from './SuitcaseSuggestionsDialog';

interface SuitcaseActionsProps {
  suitcaseId: string;
  onAddItems?: () => void;
  onViewCalendar?: () => void;
  showCalendarButton?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string | undefined) => void;
  startDate?: Date;
  endDate?: Date;
}

export const SuitcaseActions: React.FC<SuitcaseActionsProps> = ({
  suitcaseId,
  onAddItems,
  onViewCalendar,
  showCalendarButton = true,
}) => {
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const {
    suggestions,
    loading,
    getSuggestions,
    addSuggestedItems,
    aiExplanation
  } = useSuitcaseSuggestions(suitcaseId);

  const handleGetSuggestions = async () => {
    await getSuggestions();
    setShowSuggestionsDialog(true);
  };

  const handleAddSuggestions = async () => {
    await addSuggestedItems();
    setShowSuggestionsDialog(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onAddItems}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter des vêtements
        </Button>
        
        <Button
          variant="secondary"
          onClick={handleGetSuggestions}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Obtention...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Suggestions IA
            </>
          )}
        </Button>
        
        {showCalendarButton && onViewCalendar && (
          <Button
            variant="outline"
            onClick={onViewCalendar}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendrier
          </Button>
        )}
      </div>
      
      <SuitcaseSuggestionsDialog
        open={showSuggestionsDialog}
        onOpenChange={setShowSuggestionsDialog}
        suggestions={suggestions}
        isLoading={loading}
        onAddSuggestions={handleAddSuggestions}
        isAdding={false}
        aiExplanation={aiExplanation}
        suitcaseId={suitcaseId}
      />
    </>
  );
};
