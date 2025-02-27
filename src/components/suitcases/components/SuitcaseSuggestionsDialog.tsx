
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClothingSuggestion {
  id: string;
  name: string;
  category: string;
}

interface SuitcaseSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestedClothes: ClothingSuggestion[];
  aiExplanation: string;
  onAddSuggestions: (clothesIds: string[]) => Promise<void>;
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
  const handleAddSuggestions = async () => {
    const clothesIds = suggestedClothes.map(item => item.id);
    await onAddSuggestions(clothesIds);
    onOpenChange(false);
  };

  // Grouper les vêtements par catégorie
  const groupedByCategory = suggestedClothes.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ClothingSuggestion[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suggestions de l'IA</DialogTitle>
          <DialogDescription>
            Voici les vêtements suggérés par l'IA pour votre valise
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 rounded-lg bg-muted p-3 text-sm">
            <p className="text-muted-foreground">{aiExplanation}</p>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <div key={category} className="mb-4">
                <h4 className="mb-2 font-medium">{category}</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-lg border p-2">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleAddSuggestions} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              "Ajouter à la valise"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
