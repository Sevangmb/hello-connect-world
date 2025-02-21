
import { Loader2 } from "lucide-react";
import { useClothes } from "@/hooks/useClothes";
import { useSuitcaseItems } from "@/hooks/useSuitcaseItems";
import { AddClothesDialog } from "./AddClothesDialog";
import { SuitcaseItemsList } from "./SuitcaseItemsList";

interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems = ({ suitcaseId }: SuitcaseItemsProps) => {
  const { data: items, isLoading: isLoadingItems } = useSuitcaseItems(suitcaseId);
  const { data: clothes } = useClothes({ source: "mine" });

  if (isLoadingItems) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const addedClothesIds = new Set(items?.map(item => item.clothes_id));
  const availableClothes = clothes?.filter(cloth => !addedClothesIds.has(cloth.id)) || [];

  return (
    <div className="space-y-4">
      <AddClothesDialog
        suitcaseId={suitcaseId}
        availableClothes={availableClothes}
      />
      <SuitcaseItemsList
        suitcaseId={suitcaseId}
        items={items || []}
      />
    </div>
  );
};
