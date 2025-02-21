
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useClothes } from "@/hooks/useClothes";
import { useSuitcaseItems } from "@/hooks/useSuitcaseItems";
import { AddClothesDialog } from "./components/AddClothesDialog";
import { SuitcaseItemsList } from "./components/SuitcaseItemsList";

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <AddClothesDialog
          suitcaseId={suitcaseId}
          availableClothes={availableClothes}
        />
      </div>

      <SuitcaseItemsList
        items={items || []}
        suitcaseId={suitcaseId}
      />
    </div>
  );
};
