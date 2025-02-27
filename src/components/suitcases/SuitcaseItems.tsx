
import { Loader2, Package } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useClothes } from "@/hooks/useClothes";
import { useSuitcaseItems } from "@/hooks/useSuitcaseItems";
import { AddClothesDialog } from "./components/AddClothesDialog";
import { SuitcaseItemsList } from "./components/SuitcaseItemsList";
import { Badge } from "@/components/ui/badge";

interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems = ({ suitcaseId }: SuitcaseItemsProps) => {
  const { data: items, isLoading: isLoadingItems } = useSuitcaseItems(suitcaseId);
  const { data: clothes } = useClothes({ source: "mine" });
  const queryClient = useQueryClient();

  if (isLoadingItems) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const addedClothesIds = new Set(items?.map(item => item.clothes_id));
  const availableClothes = clothes?.filter(cloth => !addedClothesIds.has(cloth.id)) || [];

  const itemsByCategory = items?.reduce((acc, item) => {
    const category = item.clothes.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Vêtements</h3>
          {items && items.length > 0 && (
            <Badge variant="secondary">{items.length}</Badge>
          )}
        </div>
        <AddClothesDialog
          suitcaseId={suitcaseId}
          availableClothes={availableClothes}
        />
      </div>

      {items && items.length > 0 ? (
        <div className="space-y-4">
          <SuitcaseItemsList
            items={items}
            suitcaseId={suitcaseId}
          />
        </div>
      ) : (
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
      )}
    </div>
  );
};
