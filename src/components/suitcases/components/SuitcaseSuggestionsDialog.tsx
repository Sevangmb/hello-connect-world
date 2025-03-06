
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface SuitcaseSuggestionsDialogProps {
  suitcaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SuitcaseSuggestionsDialog: React.FC<SuitcaseSuggestionsDialogProps> = ({
  suitcaseId,
  open,
  onOpenChange,
}) => {
  // Mock fetch function - replace with actual API call
  const fetchSuggestions = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
      "T-shirts légers en coton",
      "Pantalons confortables",
      "Chapeau ou casquette pour le soleil",
      "Maillot de bain",
      "Chaussures de marche",
      "Veste légère pour les soirées",
      "Lunettes de soleil",
      "Crème solaire"
    ];
  };

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['suitcase-suggestions', suitcaseId],
    queryFn: fetchSuggestions,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suggestions pour votre valise</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chargement des suggestions...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Voici quelques suggestions basées sur votre destination et la durée de votre voyage:
              </p>
              
              <ul className="space-y-2">
                {suggestions?.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
              
              <p className="text-xs text-muted-foreground mt-4">
                Ces suggestions sont basées sur des informations générales et peuvent ne pas correspondre exactement à vos besoins.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
