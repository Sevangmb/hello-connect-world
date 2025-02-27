
import { X, Box, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SuitcaseItem } from "../utils/types";
import { useSuitcaseItemsManager } from "../hooks"; // Updated import path
import { Badge } from "@/components/ui/badge";

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
  
  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.clothes.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SuitcaseItem[]>);

  return (
    <div className="grid gap-4">
      {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
        <div key={category} className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">{category}</h4>
            <Badge variant="outline" className="text-xs">
              {categoryItems.length}
            </Badge>
          </div>
          
          <div className="grid gap-2 sm:grid-cols-2">
            {categoryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-3 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.clothes.image_url ? (
                    <img
                      src={item.clothes.image_url}
                      alt={item.clothes.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                      <Box className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm line-clamp-1">{item.clothes.name}</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-muted-foreground">
                        Quantité: {item.quantity}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={isRemoving}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  {isRemoving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
