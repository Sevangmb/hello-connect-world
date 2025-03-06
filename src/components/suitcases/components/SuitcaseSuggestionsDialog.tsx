
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ClothesCard } from '@/components/clothes/ClothesCard';

interface SuitcaseSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestedClothes: any[];
  aiExplanation: string;
  onAddSuggestions: () => void;
  isLoading: boolean;
}

export const SuitcaseSuggestionsDialog: React.FC<SuitcaseSuggestionsDialogProps> = ({
  open,
  onOpenChange,
  suggestedClothes,
  aiExplanation,
  onAddSuggestions,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>AI Suggestions</DialogTitle>
          <DialogDescription>
            Here are our recommendations for your trip
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm">{aiExplanation}</p>
          </div>

          <h3 className="text-lg font-medium mb-2">Suggested Items</h3>
          {suggestedClothes.length === 0 ? (
            <p className="text-muted-foreground">No suggestions available.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {suggestedClothes.map((cloth) => (
                <ClothesCard key={cloth.id} cloth={cloth} simple={true} />
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6 gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={onAddSuggestions}
              disabled={suggestedClothes.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Suitcase'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
