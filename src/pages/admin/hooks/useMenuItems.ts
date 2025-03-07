
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/services/menu/types";
import { MenuUseCase } from "@/services/menu/application/MenuUseCase";
import { MenuRepository } from "@/services/menu/infrastructure/SupabaseMenuRepository";

export const useMenuItems = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPath, setEditedPath] = useState("");

  // Create menu service instance
  const menuService = new MenuUseCase(new MenuRepository());

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
    } catch (e) {
      setError("Failed to load menu items.");
      console.error("Error fetching menu items:", e);
      toast({
        title: "Erreur",
        description: "Impossible de charger les éléments du menu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshMenuItems = async () => {
    await fetchMenuItems();
  };

  const handleDelete = async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(menuItems.filter((item) => item.id !== id));
      toast({
        title: "Succès",
        description: "Élément du menu supprimé avec succès",
      });
    } catch (e) {
      console.error("Error deleting menu item:", e);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet élément du menu",
        variant: "destructive",
      });
    }
  };

  const toggleMenuItemVisibility = async (id: string) => {
    try {
      const item = menuItems.find(i => i.id === id);
      if (!item) return;
      
      await menuService.updateMenuItem(id, { is_visible: !item.is_visible });
      await refreshMenuItems();
      
      toast({
        title: "Succès",
        description: "Visibilité mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error toggling menu item visibility:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la visibilité de cet élément du menu',
        variant: 'destructive',
      });
    }
  };

  const updateMenuItem = async (menuItemData: Partial<MenuItem> & { id: string }) => {
    try {
      const { id, ...updates } = menuItemData;
      await menuService.updateMenuItem(id, updates);
      await refreshMenuItems();
      
      toast({
        title: "Succès",
        description: "Élément du menu mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour cet élément du menu",
        variant: "destructive",
      });
    }
  };

  const startEditing = (item: MenuItem) => {
    setEditingId(item.id);
    setEditedName(item.name);
    setEditedPath(item.path);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveChanges = async (id: string) => {
    await updateMenuItem({ id: id, name: editedName, path: editedPath });
    setEditingId(null);
  };

  return {
    menuItems,
    loading,
    error,
    editingId,
    editedName,
    editedPath,
    fetchMenuItems,
    refreshMenuItems,
    handleDelete,
    toggleMenuItemVisibility,
    updateMenuItem,
    startEditing,
    cancelEditing,
    saveChanges,
    setEditedName,
    setEditedPath,
  };
};
