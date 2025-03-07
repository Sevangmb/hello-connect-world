
import React, { useMemo } from "react";
import CategoryGroup from "./CategoryGroup";
import { MenuItemCategory, MenuCategory } from "@/services/menu/types";
import { Home, User, Users, ShoppingBag, Briefcase, Image, Calendar, Settings } from "lucide-react";

export const MenuCategories: React.FC = () => {
  // Optimiser en mémorisant les catégories pour éviter les re-rendus inutiles
  const categories = useMemo<MenuCategory[]>(() => [
    { id: 'main', title: 'Accueil', category: 'main', icon: 'Home', order: 1 },
    { id: 'explore', title: 'Explorer', category: 'explore', icon: 'Globe', order: 2 },
    { id: 'personal', title: 'Mon Univers', category: 'personal', icon: 'User', order: 3 },
    { id: 'wardrobe', title: 'Garde-robe', category: 'wardrobe', icon: 'Shirt', order: 4 },
    { id: 'social', title: 'Social', category: 'social', icon: 'Users', order: 5 },
    { id: 'marketplace', title: 'Marketplace', category: 'marketplace', icon: 'ShoppingBag', order: 6 },
    { id: 'utility', title: 'Utilitaires', category: 'utility', icon: 'LayoutGrid', order: 7 },
  ], []);

  return (
    <div className="space-y-1">
      {categories.map(cat => (
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
