
import React, { useMemo } from "react";
import CategoryGroup from "./CategoryGroup";
import { MenuItemCategory, MenuCategory } from "@/services/menu/types";

export const MenuCategories: React.FC = () => {
  // Optimiser en mémorisant les catégories pour éviter les re-rendus inutiles
  const categories = useMemo<MenuCategory[]>(() => [
    // Menu principal
    { id: 'main', title: 'Accueil', category: 'main', icon: 'Home', order: 1 },
    { id: 'explore', title: 'Explorer', category: 'explore', icon: 'Search', order: 2 },
    { id: 'personal', title: 'Mon Univers', category: 'personal', icon: 'Star', order: 3 },
    { id: 'social', title: 'Communauté', category: 'social', icon: 'Users', order: 4 },
    { id: 'profile', title: 'Profil', category: 'profile', icon: 'User', order: 5 },
    
    // Catégories principales sous "Mon Univers"
    { id: 'wardrobe', title: 'Garde-robe', category: 'wardrobe', icon: 'ShirtIcon', order: 10 },
    { id: 'outfits', title: 'Mes Tenues', category: 'outfits', icon: 'Layers', order: 11 },
    { id: 'suitcases', title: 'Mes Valises', category: 'suitcases', icon: 'Suitcase', order: 12 },
    { id: 'favorites', title: 'Mes Favoris', category: 'favorites', icon: 'Heart', order: 13 },
    
    // Marketplace (Vide-Dressing)
    { id: 'marketplace', title: 'Vide-Dressing', category: 'marketplace', icon: 'ShoppingBag', order: 20 },
    { id: 'shops', title: 'Boutiques', category: 'shops', icon: 'Store', order: 21 },
    
    // Communauté
    { id: 'messages', title: 'Messagerie', category: 'messages', icon: 'MessageSquare', order: 30 },
    { id: 'groups', title: 'Groupes', category: 'groups', icon: 'Users', order: 31 },
    { id: 'notifications', title: 'Notifications', category: 'notifications', icon: 'Bell', order: 32 },
    { id: 'friends', title: 'Trouver des Amis', category: 'friends', icon: 'UserPlus', order: 33 },
    
    // Utilitaires
    { id: 'settings', title: 'Paramètres', category: 'settings', icon: 'Settings', order: 40 },
    { id: 'help', title: 'Aide & Support', category: 'help', icon: 'HelpCircle', order: 41 },
    
    // Admin (uniquement visible pour les admin)
    { id: 'admin', title: 'Administration', category: 'admin', icon: 'Shield', order: 50 },
  ], []);

  // On peut filtrer les catégories principales pour le menu latéral
  // et laisser les sous-catégories être gérées par leurs composants parents
  const mainCategories = useMemo(() => {
    return categories.filter(cat => 
      ['main', 'explore', 'personal', 'social', 'profile', 'marketplace', 'admin'].includes(cat.id)
    );
  }, [categories]);

  return (
    <div className="space-y-1">
      {mainCategories
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
