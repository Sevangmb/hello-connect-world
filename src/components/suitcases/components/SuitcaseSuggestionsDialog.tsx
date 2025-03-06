
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SuitcaseSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: any[];
  isLoading: boolean;
  onAddSuggestions: () => void;
  isAdding: boolean;
  aiExplanation?: string;
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
  suitcaseId
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Suggestions pour votre valise</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            {aiExplanation && (
              <Card className="mb-4 bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm">{aiExplanation}</p>
                </CardContent>
              </Card>
            )}
            
            {suggestions.length > 0 ? (
              <>
                <div className="grid gap-2 mb-4">
                  {suggestions.map((item, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.category} {item.subcategory ? `- ${item.subcategory}` : ''}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2">
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
                      "Ajouter ces vêtements"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                Aucune suggestion disponible pour cette valise.
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuitcaseSuggestionsDialog;
