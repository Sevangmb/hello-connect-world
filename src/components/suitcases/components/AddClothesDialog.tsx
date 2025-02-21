
import { useState } from "react";
import { Box, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ClothesItem } from "@/components/clothes/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddClothesDialogProps {
  suitcaseId: string;
  availableClothes: ClothesItem[];
  onClothesAdded: () => void;
}

export const AddClothesDialog = ({
  suitcaseId,
  availableClothes,
  onClothesAdded,
}: AddClothesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

      onClothesAdded();
      setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  );
};
