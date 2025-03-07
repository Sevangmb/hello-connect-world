
import React, { useMemo } from "react";
import CategoryGroup from "./CategoryGroup";
import { MenuItemCategory } from "@/services/menu/types";

export const MenuCategories: React.FC = () => {
  // Optimiser en mémorisant les catégories pour éviter les re-rendus inutiles
  // Restructuration des catégories pour éviter les doublons et assurer une meilleure organisation
  const categories = useMemo(() => [
    { id: 'main', title: 'Principales', category: 'main' as MenuItemCategory },
    { id: 'personal', title: 'Personnel', category: 'personal' as MenuItemCategory },
    { id: 'social', title: 'Social', category: 'social' as MenuItemCategory },
    { id: 'wardrobe', title: 'Garde-robe', category: 'wardrobe' as MenuItemCategory },
    { id: 'marketplace', title: 'Marketplace', category: 'marketplace' as MenuItemCategory },
    { id: 'utility', title: 'Utilitaires', category: 'utility' as MenuItemCategory },
    // Catégorie système - retirée car souvent vide ou redondante
    // { id: 'system', title: 'Système', category: 'system' as MenuItemCategory },
  ], []);

  return (
    <div className="space-y-1">
      {categories.map(cat => (
        <CategoryGroup key={cat.id} title={cat.title} category={cat.category} />
      ))}
    </div>
  );
};

export default MenuCategories;
