
import { useState } from "react";
import { Box, Loader2, Plus, Search, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AddClothesDialogProps {
  suitcaseId: string;
  availableClothes: ClothesItem[];
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export const AddClothesDialog = ({
  suitcaseId,
  availableClothes,
  variant = "default",
  size = "default"
}: AddClothesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isAdding, addItem } = useSuitcaseItemsManager(suitcaseId);

  const handleAddItem = async (clothesId: string) => {
    await addItem(clothesId);
    setIsOpen(false);
  };

  const categories = [...new Set(availableClothes.map(cloth => cloth.category))];
  
  const filteredClothes = availableClothes.filter(cloth => {
    const matchesSearch = search.trim() === "" || 
      cloth.name.toLowerCase().includes(search.toLowerCase()) ||
      (cloth.brand && cloth.brand.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = !selectedCategory || cloth.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un vêtement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un vêtement à la valise</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un vêtement..."
                className="pl-9 pr-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category}
                {selectedCategory === category && (
                  <X className="ml-1 h-3 w-3" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(null);
                  }} />
                )}
              </Badge>
            ))}
          </div>
          
          <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
            {filteredClothes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {availableClothes.length === 0
                    ? "Tous vos vêtements sont déjà dans cette valise"
                    : "Aucun vêtement ne correspond à votre recherche"}
                </p>
              </div>
            ) : (
              filteredClothes.map((cloth) => (
                <div
                  key={cloth.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {cloth.image_url ? (
                      <img
                        src={cloth.image_url}
                        alt={cloth.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                        <Box className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{cloth.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {cloth.category}
                        </Badge>
                        {cloth.brand && (
                          <span className="text-xs text-muted-foreground">{cloth.brand}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => handleAddItem(cloth.id)}
                    disabled={isAdding}
                  >
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
              ))
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
