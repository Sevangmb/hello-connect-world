
import { X, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SuitcaseItem } from "../utils/types";
import { useSuitcaseItemsManager } from "../hooks/useSuitcaseItemsManager";

interface SuitcaseItemsListProps {
  suitcaseId: string;
  items: SuitcaseItem[];
}

export const SuitcaseItemsList = ({
  suitcaseId,
  items,
}: SuitcaseItemsListProps) => {
  const { isRemoving, removeItem } = useSuitcaseItemsManager(suitcaseId);

  if (!items?.length) {
    return (
      <p className="text-center text-muted-foreground">
        Aucun vêtement dans cette valise
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-4">
            {item.clothes.image_url ? (
              <img
                src={item.clothes.image_url}
                alt={item.clothes.name}
                className="h-12 w-12 rounded object-cover"
              />
            ) : (
              <Box className="h-12 w-12" />
            )}
            <div>
              <p className="font-medium">{item.clothes.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.clothes.category}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeItem(item.id)}
            disabled={isRemoving}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
