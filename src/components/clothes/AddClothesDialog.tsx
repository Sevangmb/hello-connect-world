
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddClothesDialogProps {
  selectedDate: Date;
  clothesList: Array<{ id: string; name: string }>;
  onAddClothes: (clothesId: string) => void;
}

export const AddClothesDialog = ({ selectedDate, clothesList, onAddClothes }: AddClothesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClothes, setSelectedClothes] = useState("");

  const handleAddClothes = () => {
    if (!selectedClothes) return;
    onAddClothes(selectedClothes);
    setSelectedClothes("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ajouter un vêtement porté le {format(selectedDate, "d MMMM yyyy", { locale: fr })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Select
              value={selectedClothes}
              onValueChange={setSelectedClothes}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un vêtement" />
              </SelectTrigger>
              <SelectContent>
                {clothesList?.map((clothes) => (
                  <SelectItem key={clothes.id} value={clothes.id}>
                    {clothes.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAddClothes}
            disabled={!selectedClothes}
            className="w-full"
          >
            Ajouter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
