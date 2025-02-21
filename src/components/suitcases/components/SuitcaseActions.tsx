
import { HelpCircle, Loader2, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteSuitcase } from "../hooks/useDeleteSuitcase";
import { useSuitcaseSuggestions } from "../hooks/useSuitcaseSuggestions";
import { SuitcaseSuggestionsDialog } from "./SuitcaseSuggestionsDialog";

interface SuitcaseActionsProps {
  suitcaseId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  startDate?: Date;
  endDate?: Date;
}

export const SuitcaseActions = ({
  suitcaseId,
  isSelected,
  onSelect,
  startDate,
  endDate,
}: SuitcaseActionsProps) => {
  const { isDeleting, deleteSuitcase } = useDeleteSuitcase();
  const {
    isGettingSuggestions,
    suggestedClothes,
    showSuggestionsDialog,
    setShowSuggestionsDialog,
    aiExplanation,
    getSuggestions,
    addSuggestedClothes,
  } = useSuitcaseSuggestions(suitcaseId);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelect(suitcaseId)}
          >
            <Package className="mr-2 h-4 w-4" />
            {isSelected ? "Masquer les vêtements" : "Voir les vêtements"}
          </Button>
          <Button
            variant="outline"
            onClick={() => startDate && endDate && getSuggestions(startDate, endDate)}
            disabled={isGettingSuggestions || !startDate || !endDate}
          >
            {isGettingSuggestions ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <HelpCircle className="mr-2 h-4 w-4" />
            )}
            Demander à l'IA
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => deleteSuitcase(suitcaseId)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <SuitcaseSuggestionsDialog
        open={showSuggestionsDialog}
        onOpenChange={setShowSuggestionsDialog}
        suggestedClothes={suggestedClothes}
        aiExplanation={aiExplanation}
        onAddSuggestions={addSuggestedClothes}
      />
    </>
  );
};
