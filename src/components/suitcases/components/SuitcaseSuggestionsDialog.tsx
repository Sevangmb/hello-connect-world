
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SuitcaseSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: any[];
  isLoading: boolean;
  onAddSuggestions: () => Promise<void>;
  isAdding: boolean;
  aiExplanation: string;
  suitcaseId: string;
}

const SuitcaseSuggestionsDialog: React.FC<SuitcaseSuggestionsDialogProps> = ({
  open,
  onOpenChange,
  suggestions,
  isLoading,
  onAddSuggestions,
  isAdding,
  aiExplanation,
  suitcaseId,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Suggestions de l'IA</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-sm text-muted-foreground">
              L'IA est en train d'analyser votre valise et de générer des suggestions...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {aiExplanation && (
              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="font-medium mb-1">Explication:</p>
                <p>{aiExplanation}</p>
              </div>
            )}
            
            {suggestions.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  {suggestions.length} vêtements suggérés:
                </h3>
                <ul className="space-y-1">
                  {suggestions.map((item, index) => (
                    <li key={item.id || index} className="text-sm flex items-center gap-2">
                      <span className="w-4 h-4 flex items-center justify-center bg-primary/10 text-primary rounded-full text-xs">
                        {index + 1}
                      </span>
                      <span>
                        {item.name || `${item.category || 'Vêtement'} ${item.color || ''}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Aucune suggestion n'a été trouvée pour cette valise.
              </p>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          
          <Button
            onClick={onAddSuggestions}
            disabled={isAdding || isLoading || suggestions.length === 0}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              'Ajouter les suggestions'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuitcaseSuggestionsDialog;
