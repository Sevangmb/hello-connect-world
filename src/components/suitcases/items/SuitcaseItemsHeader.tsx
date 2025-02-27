
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddClothesDialog } from "../components/AddClothesDialog";
import type { ClothesItem } from "@/components/clothes/types";

interface SuitcaseItemsHeaderProps {
  suitcaseId: string;
  itemsCount: number;
  availableClothes: ClothesItem[];
}

export const SuitcaseItemsHeader = ({ 
  suitcaseId, 
  itemsCount, 
  availableClothes 
}: SuitcaseItemsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Vêtements</h3>
        {itemsCount > 0 && (
          <Badge variant="secondary">{itemsCount}</Badge>
        )}
      </div>
      <AddClothesDialog
        suitcaseId={suitcaseId}
        availableClothes={availableClothes}
      />
    </div>
  );
};
