
import React from "react";

interface MenuEmptyStateProps {
  isUserAdmin?: boolean;
  category?: string;
  isInitialized?: boolean;
}

export const MenuEmptyState: React.FC<MenuEmptyStateProps> = ({
  isUserAdmin = false,
  category,
  isInitialized = true
}) => {
  if (!isInitialized) {
    return (
      <div className="text-gray-500 text-sm py-2">
        Chargement des éléments de menu...
      </div>
    );
  }

  return (
    <div className="text-gray-500 text-sm py-2">
      {isUserAdmin && category === 'admin' 
        ? "Chargement du menu administrateur..." 
        : "Aucun élément de menu disponible"}
    </div>
  );
};
