
import React, { useMemo } from "react";
import CategoryGroup from "./CategoryGroup";
import { MenuItemCategory } from "@/services/menu/types";

export const MenuCategories: React.FC = () => {
  // Optimiser en mémorisant les catégories pour éviter les re-rendus inutiles
  const categories = useMemo(() => [
    { id: 'main', title: 'Principales', category: 'main' as MenuItemCategory },
    { id: 'personal', title: 'Personnel', category: 'personal' as MenuItemCategory },
    { id: 'social', title: 'Social', category: 'social' as MenuItemCategory },
    { id: 'wardrobe', title: 'Garde-robe', category: 'wardrobe' as MenuItemCategory },
    { id: 'marketplace', title: 'Marketplace', category: 'marketplace' as MenuItemCategory },
    { id: 'utility', title: 'Utilitaires', category: 'utility' as MenuItemCategory },
    { id: 'system', title: 'Système', category: 'system' as MenuItemCategory },
  ], []);

  return (
    <>
      {categories.map(cat => (
        <CategoryGroup key={cat.id} title={cat.title} category={cat.category} />
      ))}
    </>
  );
};

export default MenuCategories;
