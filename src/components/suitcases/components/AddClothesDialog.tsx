
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
import { useSuitcaseItemsManager } from "../hooks/useSuitcaseItemsManager";

interface AddClothesDialogProps {
  suitcaseId: string;
  availableClothes: ClothesItem[];
}

export const AddClothesDialog = ({
  suitcaseId,
  availableClothes,
}: AddClothesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdding, addItem } = useSuitcaseItemsManager(suitcaseId);

  const handleAddItem = async (clothesId: string) => {
    await addItem(clothesId);
    setIsOpen(false);
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
                  disabled={isAdding}
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
