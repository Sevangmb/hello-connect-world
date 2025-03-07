
import React, { useMemo } from "react";
import CategoryGroup from "./CategoryGroup";
import { MenuItemCategory, MenuCategory } from "@/services/menu/types";

export const MenuCategories: React.FC = () => {
  // Optimiser en mémorisant les catégories pour éviter les re-rendus inutiles
  const categories = useMemo<MenuCategory[]>(() => [
    // Menu principal
    { id: 'main', title: 'Accueil', category: 'main', icon: 'Home', order: 1 },
    { id: 'explore', title: 'Explorer', category: 'explore', icon: 'Search', order: 2 },
    { id: 'personal', title: 'Perso', category: 'personal', icon: 'Star', order: 3 },
    { id: 'social', title: 'Communauté', category: 'social', icon: 'Users', order: 4 },
    { id: 'profile', title: 'Profil', category: 'profile', icon: 'User', order: 5 },
    
    // Catégories principales sous "Accueil"
    { id: 'weather', title: 'Météo du Jour', category: 'weather', icon: 'Cloud', order: 10 },
    { id: 'ai_suggestions', title: 'Suggestions IA', category: 'ai_suggestions', icon: 'Sparkles', order: 11 },
    { id: 'feed', title: 'Fil d\'Actualité', category: 'feed', icon: 'LayoutList', order: 12 },
    { id: 'challenges_banner', title: 'Défis', category: 'challenges_banner', icon: 'Trophy', order: 13 },
    
    // Catégories principales sous "Explorer"
    { id: 'global_search', title: 'Recherche Globale', category: 'global_search', icon: 'Search', order: 20 },
    { id: 'trends', title: 'Tendances', category: 'trends', icon: 'TrendingUp', order: 21 },
    { id: 'popular_outfits', title: 'Tenues Populaires', category: 'popular_outfits', icon: 'Shirt', order: 22 },
    { id: 'popular_items', title: 'Articles Populaires', category: 'popular_items', icon: 'ShoppingBag', order: 23 },
    { id: 'popular_hashtags', title: 'Hashtags Populaires', category: 'popular_hashtags', icon: 'Hash', order: 24 },
    { id: 'shops', title: 'Boutiques', category: 'shops', icon: 'Store', order: 25 },
    { id: 'shop_map', title: 'Carte des Boutiques', category: 'shop_map', icon: 'Map', order: 26 },
    
    // Catégories principales sous "Perso" (Mon Univers)
    { id: 'wardrobe', title: 'Ma Garde-robe', category: 'wardrobe', icon: 'ShirtIcon', order: 30 },
    { id: 'outfits', title: 'Mes Tenues', category: 'outfits', icon: 'Layers', order: 31 },
    { id: 'looks', title: 'Mes Looks', category: 'looks', icon: 'Camera', order: 32 },
    { id: 'suitcases', title: 'Mes Valises', category: 'suitcases', icon: 'Suitcase', order: 33 },
    { id: 'favorites', title: 'Mes Favoris', category: 'favorites', icon: 'Heart', order: 34 },
    { id: 'add_clothing', title: 'Ajouter un Vêtement', category: 'add_clothing', icon: 'Plus', order: 35 },
    { id: 'create_outfit', title: 'Créer une Tenue', category: 'create_outfit', icon: 'Scissors', order: 36 },
    { id: 'publish_look', title: 'Publier un Look', category: 'publish_look', icon: 'Share2', order: 37 },
    
    // Catégories sous "Communauté"
    { id: 'messages', title: 'Messagerie', category: 'messages', icon: 'MessageSquare', order: 40 },
    { id: 'groups', title: 'Groupes', category: 'groups', icon: 'Users', order: 41 },
    { id: 'notifications', title: 'Notifications', category: 'notifications', icon: 'Bell', order: 42 },
    { id: 'friends', title: 'Trouver des Amis', category: 'friends', icon: 'UserPlus', order: 43 },
    
    // Catégories sous "Profil"
    { id: 'my_profile', title: 'Mon Profil', category: 'my_profile', icon: 'User', order: 50 },
    { id: 'marketplace', title: 'Vide-Dressing', category: 'marketplace', icon: 'ShoppingBag', order: 51 },
    { id: 'sell', title: 'Vendre', category: 'sell', icon: 'Tag', order: 52 },
    { id: 'purchases', title: 'Achats', category: 'purchases', icon: 'CreditCard', order: 53 },
    { id: 'settings', title: 'Paramètres', category: 'settings', icon: 'Settings', order: 54 },
    { id: 'edit_profile', title: 'Modifier le profil', category: 'edit_profile', icon: 'Edit', order: 55 },
    { id: 'privacy', title: 'Confidentialité', category: 'privacy', icon: 'Lock', order: 56 },
    { id: 'security', title: 'Sécurité', category: 'security', icon: 'Shield', order: 57 },
    { id: 'notification_settings', title: 'Préférences de notifications', category: 'notification_settings', icon: 'Bell', order: 58 },
    { id: 'preferences', title: 'Préférences', category: 'preferences', icon: 'Sliders', order: 59 },
    { id: 'data_storage', title: 'Données et stockage', category: 'data_storage', icon: 'Database', order: 60 },
    { id: 'help', title: 'Aide & Support', category: 'help', icon: 'HelpCircle', order: 61 },
    { id: 'logout', title: 'Déconnexion', category: 'logout', icon: 'LogOut', order: 62 },
    
    // Boutique (menu simplifié)
    { id: 'shop_dashboard', title: 'Tableau de Bord Boutique', category: 'shop_dashboard', icon: 'LayoutDashboard', order: 70 },
    { id: 'shop_storefront', title: 'Vitrine', category: 'shop_storefront', icon: 'Storefront', order: 71 },
    { id: 'shop_orders', title: 'Commandes', category: 'shop_orders', icon: 'Package', order: 72 },
    { id: 'shop_messages', title: 'Messages Boutique', category: 'shop_messages', icon: 'Mail', order: 73 },
    
    // Administration (uniquement visible pour les admin)
    { id: 'admin', title: 'Administration', category: 'admin', icon: 'Shield', order: 80 },
    { id: 'admin_dashboard', title: 'Tableau de Bord Admin', category: 'admin_dashboard', icon: 'LayoutDashboard', order: 81 },
    { id: 'admin_users', title: 'Utilisateurs', category: 'admin_users', icon: 'Users', order: 82 },
    { id: 'admin_shops', title: 'Boutiques', category: 'admin_shops', icon: 'Store', order: 83 },
    { id: 'admin_marketplace', title: 'Vide-Dressing', category: 'admin_marketplace', icon: 'ShoppingBag', order: 84 },
    { id: 'admin_content', title: 'Contenu', category: 'admin_content', icon: 'FileText', order: 85 },
    { id: 'admin_marketing', title: 'Marketing', category: 'admin_marketing', icon: 'Megaphone', order: 86 },
    { id: 'admin_stats', title: 'Statistiques', category: 'admin_stats', icon: 'BarChart2', order: 87 },
    { id: 'admin_settings', title: 'Paramètres Admin', category: 'admin_settings', icon: 'Settings', order: 88 },
  ], []);

  // Structure des catégories principales pour le menu latéral
  const mainMenuCategories = useMemo(() => {
    return categories.filter(cat => 
      ['main', 'explore', 'personal', 'social', 'profile'].includes(cat.id)
    );
  }, [categories]);

  // Structure pour les sous-catégories d'accueil
  const homeSubcategories = useMemo(() => {
    return categories.filter(cat => 
      ['weather', 'ai_suggestions', 'feed', 'challenges_banner'].includes(cat.id)
    );
  }, [categories]);

  // Structure pour les sous-catégories d'exploration
  const exploreSubcategories = useMemo(() => {
    return categories.filter(cat => 
      ['global_search', 'trends', 'popular_outfits', 'popular_items', 'popular_hashtags', 'shops', 'shop_map'].includes(cat.id)
    );
  }, [categories]);

  // Structure pour les sous-catégories personnelles
  const personalSubcategories = useMemo(() => {
    return categories.filter(cat => 
      ['wardrobe', 'outfits', 'looks', 'suitcases', 'favorites', 'add_clothing', 'create_outfit', 'publish_look'].includes(cat.id)
    );
  }, [categories]);

  // Structure pour les sous-catégories de communauté
  const socialSubcategories = useMemo(() => {
    return categories.filter(cat => 
      ['messages', 'groups', 'notifications', 'friends'].includes(cat.id)
    );
  }, [categories]);

  // Structure pour les sous-catégories de profil
  const profileSubcategories = useMemo(() => {
    return categories.filter(cat => 
      ['my_profile', 'marketplace', 'sell', 'purchases', 'settings', 'help', 'logout'].includes(cat.id)
    );
  }, [categories]);

  return (
    <div className="space-y-2">
      {/* Afficher les catégories principales */}
      {mainMenuCategories
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
