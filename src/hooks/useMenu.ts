
import { useState, useEffect, useCallback } from 'react';
import { MenuConfiguration, MenuItem } from '@/services/modules/menu/types';
import { menuService } from '@/services/modules/menu/MenuService';
import { useModuleRegistry } from '@/hooks/modules/useModuleRegistry';
import { MENU_MODULE_CODE } from '@/hooks/modules/constants';
import { eventBus } from '@/core/event-bus/EventBus';

/**
 * Hook pour gérer les menus de l'application
 */
export const useMenu = (moduleCode?: string) => {
  const [menuConfig, setMenuConfig] = useState<MenuConfiguration>({ sections: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isModuleActive } = useModuleRegistry();

  // Charger les éléments de menu
  const loadMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si le module menu est actif
      const isMenuActive = await isModuleActive(MENU_MODULE_CODE);
      
      if (!isMenuActive) {
        setError('Le module Menu n\'est pas actif');
        setLoading(false);
        return;
      }
      
      // Charger la configuration du menu
      const config = await menuService.getMenuConfiguration(moduleCode || '');
      setMenuConfig(config);
    } catch (err) {
      console.error('Erreur lors du chargement des éléments de menu:', err);
      setError('Impossible de charger les éléments de menu');
    } finally {
      setLoading(false);
    }
  }, [moduleCode, isModuleActive]);

  // Modifier un élément de menu
  const updateMenuItem = useCallback(async (id: string, updates: Partial<MenuItem>) => {
    try {
      const success = await menuService.updateMenuItem(id, updates);
      if (success) {
        loadMenuItems();
      }
      return success;
    } catch (err) {
      console.error('Erreur lors de la mise à jour d\'un élément de menu:', err);
      return false;
    }
  }, [loadMenuItems]);

  // Ajouter un élément de menu
  const addMenuItem = useCallback(async (item: Omit<MenuItem, 'id'>) => {
    try {
      const newItem = await menuService.addMenuItem(item);
      if (newItem) {
        loadMenuItems();
      }
      return newItem;
    } catch (err) {
      console.error('Erreur lors de l\'ajout d\'un élément de menu:', err);
      return null;
    }
  }, [loadMenuItems]);

  // Supprimer un élément de menu
  const deleteMenuItem = useCallback(async (id: string) => {
    try {
      const success = await menuService.deleteMenuItem(id);
      if (success) {
        loadMenuItems();
      }
      return success;
    } catch (err) {
      console.error('Erreur lors de la suppression d\'un élément de menu:', err);
      return false;
    }
  }, [loadMenuItems]);

  // Réorganiser les éléments de menu
  const reorderMenuItems = useCallback(async (itemIds: string[]) => {
    try {
      const success = await menuService.reorderMenuItems(itemIds);
      if (success) {
        loadMenuItems();
      }
      return success;
    } catch (err) {
      console.error('Erreur lors de la réorganisation des éléments de menu:', err);
      return false;
    }
  }, [loadMenuItems]);

  // Effet pour charger les éléments de menu au montage
  useEffect(() => {
    loadMenuItems();
    
    // S'abonner aux mises à jour du menu
    const unsubscribe = eventBus.subscribe('menu:updated', () => {
      loadMenuItems();
    });
    
    return () => {
      unsubscribe();
    };
  }, [loadMenuItems]);

  return {
    menuConfig,
    loading,
    error,
    loadMenuItems,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    reorderMenuItems
  };
};
