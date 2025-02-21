
import { X, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SuitcaseItem } from "@/hooks/useSuitcaseItems";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SuitcaseItemsListProps {
  items: SuitcaseItem[];
  onItemRemoved: () => void;
}

export const SuitcaseItemsList = ({
  items,
  onItemRemoved,
}: SuitcaseItemsListProps) => {
  const { toast } = useToast();

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("suitcase_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Vêtement retiré",
        description: "Le vêtement a été retiré de la valise",
      });

      onItemRemoved();
    } catch (error) {
      console.error("Error removing item from suitcase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le vêtement de la valise",
      });
    }
  };

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
            onClick={() => handleRemoveItem(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
