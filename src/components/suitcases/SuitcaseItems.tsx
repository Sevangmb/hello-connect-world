
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Box, Loader2, Package, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClothes } from "@/hooks/useClothes";
import { useSuitcaseItems } from "@/hooks/useSuitcaseItems";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SuitcaseItemsProps {
  suitcaseId: string;
}

export const SuitcaseItems = ({ suitcaseId }: SuitcaseItemsProps) => {
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: items, isLoading: isLoadingItems } = useSuitcaseItems(suitcaseId);
  const { data: clothes } = useClothes({ source: "mine" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddItem = async (clothesId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("suitcase_items")
        .insert({
          suitcase_id: suitcaseId,
          clothes_id: clothesId,
        });

      if (error) throw error;

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à la valise",
      });

      queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
      setIsAddingOpen(false);
    } catch (error) {
      console.error("Error adding item to suitcase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le vêtement à la valise",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
    } catch (error) {
      console.error("Error removing item from suitcase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le vêtement de la valise",
      });
    }
  };

  if (isLoadingItems) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const addedClothesIds = new Set(items?.map(item => item.clothes_id));
  const availableClothes = clothes?.filter(cloth => !addedClothesIds.has(cloth.id)) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vêtements dans la valise</h3>
        <Dialog open={isAddingOpen} onOpenChange={setIsAddingOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un vêtement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un vêtement à la valise</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto">
              {availableClothes.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Tous vos vêtements sont déjà dans cette valise
                </p>
              ) : (
                availableClothes.map((cloth) => (
                  <div
                    key={cloth.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      {cloth.image_url ? (
                        <img
                          src={cloth.image_url}
                          alt={cloth.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <Box className="h-12 w-12" />
                      )}
                      <div>
                        <p className="font-medium">{cloth.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cloth.category}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddItem(cloth.id)}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!items?.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
          <Package className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">
            Aucun vêtement dans cette valise
          </p>
        </div>
      ) : (
        <div className="space-y-2">
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
      )}
    </div>
  );
};

