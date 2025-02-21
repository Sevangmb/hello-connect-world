
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type SuggestedClothing = {
  id: string;
  name: string;
  category: string;
};

interface SuitcaseSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestedClothes: SuggestedClothing[];
  aiExplanation: string;
  onAddSuggestions: () => void;
  isLoading: boolean;
}

export const SuitcaseSuggestionsDialog = ({
  open,
  onOpenChange,
  suggestedClothes,
  aiExplanation,
  onAddSuggestions,
  isLoading,
}: SuitcaseSuggestionsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suggestions de l'IA</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {aiExplanation}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {suggestedClothes.length > 0 ? (
            <>
              <div className="grid gap-2">
                {suggestedClothes.map((cloth) => (
                  <div key={cloth.id} className="flex items-center gap-2 p-2 border rounded">
                    <span className="font-medium">{cloth.name}</span>
                    <span className="text-sm text-muted-foreground">({cloth.category})</span>
                  </div>
                ))}
              </div>
              <Button onClick={onAddSuggestions} className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Ajout en cours..." : "Ajouter les suggestions à la valise"}
              </Button>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Aucun nouveau vêtement à suggérer pour cette valise
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
