
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CategoryFormFields } from "./CategoryFormFields";
import { useCategoryForm, Category } from "./useCategoryForm";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSave: () => void;
}

export function CategoryDialog({ 
  open, 
  onOpenChange, 
  category, 
  onSave 
}: CategoryDialogProps) {
  const { formData, isLoading, handleChange, handleSubmit } = useCategoryForm(
    category,
    onSave,
    onOpenChange
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Modifier la catégorie" : "Ajouter une catégorie"}
          </DialogTitle>
        </DialogHeader>
        <CategoryFormFields 
          formData={formData}
          handleChange={handleChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Check className="mr-2 h-4 w-4" />
            {category ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
