
import React, { useMemo } from "react";
import CategoryGroup from "./CategoryGroup";
import { MenuItemCategory, MenuCategory } from "@/services/menu/types";

export const MenuCategories: React.FC = () => {
  // Optimiser en mémorisant les catégories pour éviter les re-rendus inutiles
  const categories = useMemo<MenuCategory[]>(() => [
    { id: 'main', title: 'Accueil', category: 'main', icon: 'Home', order: 1 },
    { id: 'explore', title: 'Explorer', category: 'explore', icon: 'Globe', order: 2 },
    { id: 'personal', title: 'Mon Univers', category: 'personal', icon: 'User', order: 3 },
    { id: 'wardrobe', title: 'Garde-robe', category: 'wardrobe', icon: 'ShoppingBag', order: 4 },
    { id: 'social', title: 'Communauté', category: 'social', icon: 'Users', order: 5 },
    { id: 'marketplace', title: 'Vide-Dressing', category: 'marketplace', icon: 'ShoppingCart', order: 6 },
    { id: 'local_shops', title: 'Boutiques Locales', category: 'local_shops', icon: 'Store', order: 7 },
    { id: 'utility', title: 'Utilitaires', category: 'utility', icon: 'LayoutGrid', order: 8 },
  ], []);

  return (
    <div className="space-y-1">
      {categories
        .sort((a, b) => (a.order || 999) - (b.order || 999))
        .map(cat => (
          <CategoryGroup 
            key={cat.id} 
            title={cat.title} 
            category={cat.category} 
            icon={cat.icon} 
          />
        ))}
    </div>
  );
};

export default MenuCategories;
