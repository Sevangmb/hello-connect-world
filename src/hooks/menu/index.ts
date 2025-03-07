
import { useEffect, useState } from 'react';
import { useAllMenuItems, useMenuItemsByCategory, useMenuItemsByModule } from './useMenuItems';
import { useMenuCategories } from './useMenuCategories';
import { useAdminStatus } from './useAdminStatus';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { eventBus } from '@/core/event-bus/EventBus';

interface UseMenuOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  hierarchical?: boolean;
}

// Main hook for using menu functionality
export const useMenu = (options: UseMenuOptions = {}) => {
  const { category, moduleCode, hierarchical = false } = options;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get admin status
  const { isUserAdmin } = useAdminStatus();

  // Query for menu items based on provided options
  const categoryQuery = useMenuItemsByCategory(category as MenuItemCategory);
  const moduleQuery = useMenuItemsByModule(moduleCode as string, isUserAdmin);
  const allItemsQuery = useAllMenuItems();

  // Categories 
  const menuCategories = useMenuCategories(menuItems);

  // Effect to set menu items based on query results
  useEffect(() => {
    try {
      setLoading(true);
      let items: MenuItem[] = [];

      // Get items based on options
      if (category) {
        items = categoryQuery.data || [];
      } else if (moduleCode) {
        items = moduleQuery.data || [];
      } else {
        items = allItemsQuery.data || [];
      }

      // Filter based on user permissions
      const filteredItems = items.filter(item => {
        if (item.requires_admin && !isUserAdmin) {
          return false;
        }
        return true;
      });

      // Handle hierarchical structure if needed
      if (hierarchical) {
        // Build tree structure (future enhancement)
        setMenuItems(filteredItems);
      } else {
        setMenuItems(filteredItems);
      }

      setError(null);
    } catch (err) {
      console.error("Error processing menu items:", err);
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  }, [
    category, 
    moduleCode, 
    hierarchical, 
    isUserAdmin,
    categoryQuery.data,
    moduleQuery.data,
    allItemsQuery.data
  ]);

  // Function to refresh menu data
  const refreshMenu = () => {
    if (category) {
      categoryQuery.refetch();
    } else if (moduleCode) {
      moduleQuery.refetch();
    } else {
      allItemsQuery.refetch();
    }
  };

  return {
    menuItems,
    loading: loading || categoryQuery.isLoading || moduleQuery.isLoading || allItemsQuery.isLoading,
    error,
    isUserAdmin,
    categories: menuCategories,
    refreshMenu
  };
};

// Export sub-hooks for direct access if needed
export { 
  useAllMenuItems,
  useMenuItemsByCategory,
  useMenuItemsByModule,
  useMenuCategories, 
  useAdminStatus 
};
