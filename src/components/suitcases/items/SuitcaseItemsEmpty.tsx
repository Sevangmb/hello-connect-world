
import { AddClothesDialog } from "../components/AddClothesDialog";
import type { ClothesItem } from "@/components/clothes/types";

interface SuitcaseItemsEmptyProps {
  suitcaseId: string;
  availableClothes: ClothesItem[];
}

export const SuitcaseItemsEmpty = ({ 
  suitcaseId, 
  availableClothes 
}: SuitcaseItemsEmptyProps) => {
  return (
    <div className="text-center py-6 bg-muted/30 rounded-md border border-dashed">
      <p className="text-muted-foreground text-sm mb-2">
        Aucun vêtement dans cette valise
      </p>
      <AddClothesDialog
        suitcaseId={suitcaseId}
        availableClothes={availableClothes}
        variant="outline"
        size="sm"
      />
    </div>
  );
};
