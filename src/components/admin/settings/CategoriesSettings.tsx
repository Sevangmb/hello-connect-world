
import { useState, useEffect } from "react";
import { Edit, Plus, Trash, AlertTriangle, Check, X, IconNames } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

export function CategoriesSettings({ categories: initialCategories, isLoading: initialLoading }: CategoriesSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  
  // Utiliser useQuery pour récupérer les données en temps réel
  const { data: categories, isLoading, refetch } = useQuery({
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gestion des catégories</h3>
        <Button 
          onClick={handleAddCategory} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une catégorie
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      ) : (
        categoryGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border border-dashed">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">Aucune catégorie trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore créé de catégories pour votre site.
            </p>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre première catégorie
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {categoryGroups.map(([type, typeCategories]) => (
              <div key={type} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-medium">{type}</h4>
                  <Badge variant="outline" className="font-normal">
                    {typeCategories.length} {typeCategories.length > 1 ? 'catégories' : 'catégorie'}
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Icône</TableHead>
                      <TableHead>Ordre</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {typeCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                        <TableCell>{category.icon}</TableCell>
                        <TableCell>{category.order_index}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={category.is_active} 
                              onCheckedChange={() => handleToggleActive(category)}
                              disabled={isLoading}
                            />
                            <div className="flex items-center gap-1.5">
                              {category.is_active ? (
                                <>
                                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                  <span>Actif</span>
                                </>
                              ) : (
                                <>
                                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                  <span className="text-muted-foreground">Inactif</span>
                                </>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteConfirm(category.id)}
                              disabled={isLoading}
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
              </div>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La catégorie sera définitivement supprimée de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex items-center gap-1">
              <X className="h-4 w-4" />
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1"
            >
              <Trash className="h-4 w-4" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
