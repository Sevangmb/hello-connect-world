
import React from "react";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { CartIcon } from "@/components/cart/CartIcon";
import { CategoryGroupProps } from "./types/moduleMenu";
import { useModuleVisibility } from "./hooks/useModuleVisibility";

export const CategoryGroup: React.FC<CategoryGroupProps> = ({ title, category }) => {
  // Utiliser le hook de visibilité pour obtenir les éléments de menu filtrés
  const { loading, isUserAdmin } = useModuleVisibility(category);
  
  // Ne pas afficher la catégorie admin si l'utilisateur n'est pas admin
  if (category === 'admin' && !isUserAdmin) {
    return null;
  }
  
  // Ajouter l'icône du panier pour la catégorie marketplace
  if (category === 'marketplace') {
    return (
      <div className="space-y-1 mb-6">
        <div className="flex items-center justify-between px-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
          <CartIcon className="ml-auto text-gray-500 hover:text-primary transition-colors" />
        </div>
        <DynamicMenu category={category} />
      </div>
    );
  }
  
  // Rendu standard pour les autres catégories
  return (
    <div className="space-y-1 mb-6">
      <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <DynamicMenu category={category} />
    </div>
  );
};

export default CategoryGroup;
