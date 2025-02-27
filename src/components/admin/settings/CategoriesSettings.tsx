
import { useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryDialog } from "./CategoryDialog";

interface Category {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

interface CategoriesSettingsProps {
  categories: Category[] | undefined;
  isLoading: boolean;
}

export function CategoriesSettings({ categories, isLoading }: CategoriesSettingsProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [localLoading, setLocalLoading] = useState(false);

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie?")) {
      return;
    }
    
    setLocalLoading(true);
    try {
      const { error } = await supabase
        .from("site_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    setLocalLoading(true);
    try {
      const { error } = await supabase
        .from("site_categories")
        .update({ is_active: !category.is_active })
        .eq("id", category.id);

      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: `La catégorie est maintenant ${!category.is_active ? "active" : "inactive"}.`,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSaveCategory = () => {
    // This will be called after successful save in the dialog
    // The query will re-fetch the data automatically
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleAddCategory} 
          disabled={isLoading || localLoading}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une catégorie
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Icône</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucune catégorie trouvée. Ajoutez votre première catégorie.
              </TableCell>
            </TableRow>
          )}
          {categories?.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.type}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell className="max-w-xs truncate">{category.description}</TableCell>
              <TableCell>{category.icon}</TableCell>
              <TableCell>{category.order_index}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={category.is_active} 
                    onCheckedChange={() => handleToggleActive(category)}
                    disabled={isLoading || localLoading}
                  />
                  <span>{category.is_active ? "Actif" : "Inactif"}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    disabled={isLoading || localLoading}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={isLoading || localLoading}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
