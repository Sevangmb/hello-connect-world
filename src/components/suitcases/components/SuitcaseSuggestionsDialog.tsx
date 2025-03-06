
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SuitcaseSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: any[];
  isLoading: boolean;
  isAdding: boolean;
  aiExplanation: string;
  onAddSuggestions: () => Promise<void>;
  suitcaseId: string;
}

export const SuitcaseSuggestionsDialog: React.FC<SuitcaseSuggestionsDialogProps> = ({
  open,
  onOpenChange,
  suggestions,
  isLoading,
  isAdding,
  aiExplanation,
  onAddSuggestions,
  suitcaseId,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Suggestions IA pour votre valise</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Génération des suggestions en cours...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {aiExplanation && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium mb-1">Explication IA:</p>
                <p>{aiExplanation}</p>
              </div>
            )}
            
            {suggestions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Vêtements suggérés ({suggestions.length}):</p>
                <ul className="space-y-1">
                  {suggestions.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      {item.name || item.category || "Vêtement"}
                      {item.color && ` (${item.color})`}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                Aucune suggestion disponible. Essayez d'ajouter plus d'informations à votre valise.
              </p>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
          {suggestions.length > 0 && (
            <Button 
              onClick={onAddSuggestions}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                'Ajouter tous les vêtements'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
