
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category, CategoryDialog } from "./categories";
import { CategoryHeader } from "./categories/CategoryHeader";
import { CategoryGroup } from "./categories/CategoryGroup";
import { EmptyCategories } from "./categories/EmptyCategories";
import { LoadingState } from "./categories/LoadingState";
import { DeleteCategoryDialog } from "./categories/DeleteCategoryDialog";
import { useCategoryManager } from "./categories/useCategoryManager";

interface CategoriesSettingsProps {
  categories: Category[] | undefined;
  isLoading: boolean;
}

export function CategoriesSettings({ categories: initialCategories, isLoading: initialLoading }: CategoriesSettingsProps) {
  const {
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editingCategory,
    handleAddCategory,
    handleEditCategory,
    handleDeleteConfirm,
    handleDeleteCategory,
    handleToggleActive,
    handleSaveCategory
  } = useCategoryManager();
  
  // Utiliser useQuery pour récupérer les données en temps réel
  const { data: categories, isLoading } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_categories")
        .select("*")
        .order('type')
        .order('order_index');
      
      if (error) throw error;
      return data as Category[];
    },
    initialData: initialCategories,
    enabled: !initialLoading,
  });

  // Grouper les catégories par type
  const categoryGroups = categories ? 
    Object.entries(
      categories.reduce((acc, category) => {
        if (!acc[category.type]) {
          acc[category.type] = [];
        }
        acc[category.type].push(category);
        return acc;
      }, {} as Record<string, Category[]>)
    ).sort(([typeA], [typeB]) => typeA.localeCompare(typeB)) : [];

  return (
    <div className="space-y-8">
      <CategoryHeader 
        onAddCategory={handleAddCategory} 
        isLoading={isLoading} 
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        categoryGroups.length === 0 ? (
          <EmptyCategories onAddCategory={handleAddCategory} />
        ) : (
          <div className="space-y-8">
            {categoryGroups.map(([type, typeCategories]) => (
              <CategoryGroup
                key={type}
                type={type}
                categories={typeCategories}
                isLoading={isLoading}
                onEdit={handleEditCategory}
                onDelete={handleDeleteConfirm}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}
