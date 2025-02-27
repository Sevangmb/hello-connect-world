
import { AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCategoriesProps {
  onAddCategory: () => void;
}

export function EmptyCategories({ onAddCategory }: EmptyCategoriesProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border border-dashed">
      <AlertTriangle className="h-10 w-10 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-1">Aucune catégorie trouvée</h3>
      <p className="text-muted-foreground mb-4">
        Vous n'avez pas encore créé de catégories pour votre site.
      </p>
      <Button onClick={onAddCategory}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter votre première catégorie
      </Button>
    </div>
  );
}
