
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "./useCategoryForm";

export function useCategoryManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeletingCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return;
    
    try {
      const { error } = await supabase
        .from("site_categories")
        .delete()
        .eq("id", deletingCategoryId);

      if (error) throw error;
      
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
      setDeleteDialogOpen(false);
      setDeletingCategoryId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const { error } = await supabase
        .from("site_categories")
        .update({ 
          is_active: !category.is_active,
          updated_at: new Date().toISOString()
        })
        .eq("id", category.id);

      if (error) throw error;
      
      toast({
        title: "Statut mis à jour",
        description: `La catégorie est maintenant ${!category.is_active ? "active" : "inactive"}.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCategory = () => {
    queryClient.invalidateQueries({ queryKey: ["site-categories"] });
  };

  return {
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editingCategory,
    deletingCategoryId,
    handleAddCategory,
    handleEditCategory,
    handleDeleteConfirm,
    handleDeleteCategory,
    handleToggleActive,
    handleSaveCategory
  };
}
