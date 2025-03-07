
import React from "react";
import { AlertCircle } from "lucide-react";

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
      <div className="text-gray-500 text-sm py-2 flex items-center">
        <span className="animate-pulse mr-2">⏳</span>
        Chargement des éléments de menu...
      </div>
    );
  }

  // Si c'est le menu admin et l'utilisateur est admin, montrer un message spécifique
  if (isUserAdmin && category === 'admin') {
    return (
      <div className="text-gray-500 text-sm py-2 flex items-center">
        <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
        Chargement du menu administrateur...
      </div>
    );
  }

  // Message standard pour les autres cas
  return (
    <div className="text-gray-500 text-sm py-2 flex items-center">
      <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
      Aucun élément de menu disponible
    </div>
  );
};
