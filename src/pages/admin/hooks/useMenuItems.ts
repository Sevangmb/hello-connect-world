
import { useState, useCallback } from 'react';
import { MenuItem, CreateMenuItemParams, UpdateMenuItemParams } from '@/services/menu/types';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { useToast } from '@/hooks/use-toast';

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedPath, setEditedPath] = useState('');
  const { toast } = useToast();

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      const menuService = getMenuService();
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
      setError(null);
    } catch (err) {
      setError('Failed to load menu items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const menuService = getMenuService();
      const success = await menuService.deleteMenuItem(id);
      if (success) {
        setMenuItems(prev => prev.filter(item => item.id !== id));
        toast({
          title: "Success",
          description: "Menu item deleted successfully",
        });
      } else {
        throw new Error('Failed to delete menu item');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
      console.error(err);
    }
  }, [toast]);

  const toggleMenuItemVisibility = useCallback(async (id: string, isVisible: boolean) => {
    try {
      const menuService = getMenuService();
      const updates: UpdateMenuItemParams = { is_visible: !isVisible };
      const updatedItem = await menuService.updateMenuItem(id, updates);
      
      if (updatedItem) {
        setMenuItems(prev => prev.map(item => 
          item.id === id ? { ...item, is_visible: !isVisible } : item
        ));
        toast({
          title: "Success",
          description: `Menu item is now ${!isVisible ? 'visible' : 'hidden'}`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update menu item visibility",
        variant: "destructive",
      });
      console.error(err);
    }
  }, [toast]);

  const startEditing = useCallback((item: MenuItem) => {
    setEditingId(item.id);
    setEditedName(item.name);
    setEditedPath(item.path);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditedName('');
    setEditedPath('');
  }, []);

  const saveChanges = useCallback(async () => {
    if (!editingId) return;
    
    try {
      const menuService = getMenuService();
      const updates: UpdateMenuItemParams = {
        name: editedName,
        path: editedPath,
      };
      
      const updatedItem = await menuService.updateMenuItem(editingId, updates);
      
      if (updatedItem) {
        setMenuItems(prev => prev.map(item => 
          item.id === editingId 
            ? { ...item, name: editedName, path: editedPath } 
            : item
        ));
        
        setEditingId(null);
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      });
      console.error(err);
    }
  }, [editingId, editedName, editedPath, toast]);

  const addMenuItem = useCallback(async (newItem: CreateMenuItemParams) => {
    try {
      const menuService = getMenuService();
      const createdItem = await menuService.createMenuItem(newItem);
      
      if (createdItem) {
        setMenuItems(prev => [...prev, createdItem]);
        toast({
          title: "Success",
          description: "Menu item created successfully",
        });
      } else {
        throw new Error('Failed to create menu item');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create menu item",
        variant: "destructive",
      });
      console.error(err);
      throw err; // Re-throw to allow the form to handle the error
    }
  }, [toast]);

  return {
    menuItems,
    loading,
    error,
    editingId,
    editedName,
    editedPath,
    fetchMenuItems,
    handleDelete,
    toggleMenuItemVisibility,
    startEditing,
    cancelEditing,
    saveChanges,
    setEditedName,
    setEditedPath,
    addMenuItem,
  };
};
