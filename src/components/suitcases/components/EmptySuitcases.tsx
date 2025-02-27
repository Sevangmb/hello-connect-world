
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { CreateSuitcaseDialog } from "@/components/suitcases/CreateSuitcaseDialog";
import { SuitcaseFilters } from "@/hooks/useSuitcases";

interface EmptySuitcasesProps {
  filters: SuitcaseFilters;
  resetFilters: () => void;
}

export const EmptySuitcases = ({
  filters,
  resetFilters,
}: EmptySuitcasesProps) => {
  return (
    <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Filter className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucune valise trouvée</h3>
        <p className="text-muted-foreground mb-6">
          {filters.status !== "active" || filters.search 
            ? "Aucune valise ne correspond à vos critères de recherche." 
            : "Vous n'avez pas encore créé de valise."}
        </p>
        {filters.status !== "active" || filters.search ? (
          <Button 
            variant="outline" 
            onClick={resetFilters}
          >
            Réinitialiser les filtres
          </Button>
        ) : (
          <CreateSuitcaseDialog />
        )}
      </div>
    </div>
  );
};
