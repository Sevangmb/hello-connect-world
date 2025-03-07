
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

  // Message spécifique par catégorie
  const getCategoryMessage = () => {
    switch (category) {
      case 'main':
        return "Aucun élément dans le menu d'accueil";
      case 'explore':
        return "Aucun élément dans le menu d'exploration";
      case 'personal':
        return "Aucun élément dans votre menu personnel";
      case 'social':
        return "Aucun élément dans le menu communautaire";
      case 'profile':
        return "Aucun élément dans le menu de profil";
      case 'admin':
        return "Aucun élément dans le menu d'administration";
      default:
        return "Aucun élément de menu disponible pour cette section";
    }
  };

  // Message standard pour les autres cas
  return (
    <div className="text-gray-500 text-sm py-2 flex items-center">
      <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
      {getCategoryMessage()}
    </div>
  );
};
