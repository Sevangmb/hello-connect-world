
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface SuitcaseSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: any[];
  isLoading: boolean;
  onAddSuggestions: () => Promise<void>;
  isAdding: boolean;
  aiExplanation?: string;
  suitcaseId: string;
}

export const SuitcaseSuggestionsDialog: React.FC<SuitcaseSuggestionsDialogProps> = ({
  open,
  onOpenChange,
  suggestions,
  isLoading,
  onAddSuggestions,
  isAdding,
  aiExplanation,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suggestions d'articles</DialogTitle>
          <DialogDescription>
            Voici les suggestions basées sur votre destination et la durée du voyage
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="py-4">
            {aiExplanation && (
              <p className="text-sm text-muted-foreground mb-4">{aiExplanation}</p>
            )}
            <ul className="space-y-2">
              {suggestions.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-sm">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={onAddSuggestions}
            disabled={isLoading || isAdding || !suggestions.length}
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
