
import React from "react";
import { MenuItemCategory } from "@/services/menu/types";

interface MenuEmptyStateProps {
  category?: MenuItemCategory;
  isUserAdmin?: boolean;
  isInitialized?: boolean;
}

export const MenuEmptyState: React.FC<MenuEmptyStateProps> = ({ 
  category, 
  isUserAdmin = false,
  isInitialized = false 
}) => {
  // Afficher un message différent selon le contexte
  const getMessage = () => {
    if (!isInitialized) {
      return "Chargement des données du menu...";
    }
    
    if (isUserAdmin) {
      return `Aucun élément disponible pour la catégorie ${category || "spécifiée"}`;
    }
    
    return "Aucun élément de menu disponible";
  };
  
  return (
    <div className="p-2 text-sm text-gray-500">
      {getMessage()}
    </div>
  );
};
