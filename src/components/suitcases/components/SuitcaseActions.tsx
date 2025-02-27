
import { HelpCircle, Loader2, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteSuitcase } from "../hooks/useDeleteSuitcase";
import { useSuitcaseSuggestions } from "../hooks"; // Updated import path
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
    isAddingSuggestions,
    suggestedClothes,
    showSuggestionsDialog,
    setShowSuggestionsDialog,
    aiExplanation,
    getSuggestions,
    addSuggestedClothes,
  } = useSuitcaseSuggestions(suitcaseId);

  const isDisabled = isDeleting || isGettingSuggestions || isAddingSuggestions;

  const handleDeleteSuitcase = () => {
    deleteSuitcase(suitcaseId);
  };

  const handleGetSuggestions = () => {
    if (startDate && endDate) {
      getSuggestions(startDate, endDate);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelect(suitcaseId)}
            disabled={isDisabled}
          >
            <Package className="mr-2 h-4 w-4" />
            {isSelected ? "Masquer les vêtements" : "Voir les vêtements"}
          </Button>
          <Button
            variant="outline"
            onClick={handleGetSuggestions}
            disabled={isDisabled || !startDate || !endDate}
          >
            {isGettingSuggestions ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <HelpCircle className="mr-2 h-4 w-4" />
            )}
            {isGettingSuggestions ? "Chargement..." : "Demander à l'IA"}
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDeleteSuitcase}
          disabled={isDisabled}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <SuitcaseSuggestionsDialog
        open={showSuggestionsDialog}
        onOpenChange={setShowSuggestionsDialog}
        suggestedClothes={suggestedClothes}
        aiExplanation={aiExplanation}
        onAddSuggestions={addSuggestedClothes}
        isLoading={isAddingSuggestions}
      />
    </>
  );
};
