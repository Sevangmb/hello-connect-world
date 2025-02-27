
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  onAddCategory: () => void;
  isLoading: boolean;
}

export function CategoryHeader({ onAddCategory, isLoading }: CategoryHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Gestion des catégories</h3>
      <Button 
        onClick={onAddCategory} 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Ajouter une catégorie
      </Button>
    </div>
  );
}
