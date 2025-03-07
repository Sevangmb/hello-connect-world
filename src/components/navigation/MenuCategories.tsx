
import React, { useMemo } from "react";
import CategoryGroup from "./CategoryGroup";
import { MenuItemCategory, MenuCategory } from "@/services/menu/types";
import { MenuStructureTransformer } from "@/services/menu/infrastructure/utils/MenuStructureTransformer";

export const MenuCategories: React.FC = () => {
  // Optimiser en mémorisant les catégories pour éviter les re-rendus inutiles
  const categories = useMemo<MenuCategory[]>(() => [
    // Menu principal
    { id: 'main', title: 'Accueil', category: 'main', icon: 'Home', order: 1 },
    { id: 'explore', title: 'Explorer', category: 'explore', icon: 'Search', order: 2 },
    { id: 'personal', title: 'Perso', category: 'personal', icon: 'Star', order: 3 },
    { id: 'social', title: 'Communauté', category: 'social', icon: 'Users', order: 4 },
    { id: 'profile', title: 'Profil', category: 'profile', icon: 'User', order: 5 },
    
    // Catégories sous "Accueil"
    { id: 'weather', title: 'Météo du Jour', category: 'weather', icon: 'Cloud', order: 10, parent: 'main' },
    { id: 'ai_suggestions', title: 'Suggestions IA', category: 'ai_suggestions', icon: 'Sparkles', order: 11, parent: 'main' },
    { id: 'feed', title: 'Fil d\'Actualité', category: 'feed', icon: 'LayoutList', order: 12, parent: 'main' },
    { id: 'challenges_banner', title: 'Défis', category: 'challenges_banner', icon: 'Trophy', order: 13, parent: 'main' },
    
    // Catégories sous "Explorer"
    { id: 'global_search', title: 'Recherche Globale', category: 'global_search', icon: 'Search', order: 20, parent: 'explore' },
    { id: 'trends', title: 'Tendances', category: 'trends', icon: 'TrendingUp', order: 21, parent: 'explore' },
    { id: 'popular_outfits', title: 'Tenues Populaires', category: 'popular_outfits', icon: 'Shirt', order: 22, parent: 'explore' },
    { id: 'popular_items', title: 'Articles Populaires', category: 'popular_items', icon: 'ShoppingBag', order: 23, parent: 'explore' },
    { id: 'popular_hashtags', title: 'Hashtags Populaires', category: 'popular_hashtags', icon: 'Hash', order: 24, parent: 'explore' },
    { id: 'shops', title: 'Boutiques', category: 'shops', icon: 'Store', order: 25, parent: 'explore' },
    { id: 'shop_map', title: 'Carte des Boutiques', category: 'shop_map', icon: 'Map', order: 26, parent: 'explore' },
    
    // Catégories sous "Perso" (Mon Univers)
    { id: 'wardrobe', title: 'Ma Garde-robe', category: 'wardrobe', icon: 'ShirtIcon', order: 30, parent: 'personal' },
    { id: 'outfits', title: 'Mes Tenues', category: 'outfits', icon: 'Layers', order: 31, parent: 'personal' },
    { id: 'looks', title: 'Mes Looks', category: 'looks', icon: 'Camera', order: 32, parent: 'personal' },
    { id: 'suitcases', title: 'Mes Valises', category: 'suitcases', icon: 'Suitcase', order: 33, parent: 'personal' },
    { id: 'favorites', title: 'Mes Favoris', category: 'favorites', icon: 'Heart', order: 34, parent: 'personal' },
    { id: 'favorite_items', title: 'Articles Favoris', category: 'favorite_items', icon: 'Tag', order: 341, parent: 'favorites' },
    { id: 'favorite_outfits', title: 'Tenues Favorites', category: 'favorite_outfits', icon: 'Layers', order: 342, parent: 'favorites' },
    { id: 'favorite_users', title: 'Utilisateurs Favoris', category: 'favorite_users', icon: 'Users', order: 343, parent: 'favorites' },
    { id: 'favorite_shops', title: 'Boutiques Favorites', category: 'favorite_shops', icon: 'Store', order: 344, parent: 'favorites' },
    { id: 'add_clothing', title: 'Ajouter un Vêtement', category: 'add_clothing', icon: 'Plus', order: 35, parent: 'personal' },
    { id: 'scan_label', title: 'Scanner Étiquette', category: 'scan_label', icon: 'Scan', order: 351, parent: 'add_clothing' },
    { id: 'take_photo', title: 'Prendre une Photo', category: 'take_photo', icon: 'Camera', order: 352, parent: 'add_clothing' },
    { id: 'import_gallery', title: 'Importer depuis Galerie', category: 'import_gallery', icon: 'Image', order: 353, parent: 'add_clothing' },
    { id: 'manual_entry', title: 'Saisie Manuelle', category: 'manual_entry', icon: 'Pencil', order: 354, parent: 'add_clothing' },
    { id: 'create_outfit', title: 'Créer une Tenue', category: 'create_outfit', icon: 'Scissors', order: 36, parent: 'personal' },
    { id: 'publish_look', title: 'Publier un Look', category: 'publish_look', icon: 'Share2', order: 37, parent: 'personal' },
    
    // Catégories sous "Communauté"
    { id: 'messages', title: 'Messagerie', category: 'messages', icon: 'MessageSquare', order: 40, parent: 'social' },
    { id: 'groups', title: 'Groupes', category: 'groups', icon: 'Users', order: 41, parent: 'social' },
    { id: 'notifications', title: 'Notifications', category: 'notifications', icon: 'Bell', order: 42, parent: 'social' },
    { id: 'friends', title: 'Trouver des Amis', category: 'friends', icon: 'UserPlus', order: 43, parent: 'social' },
    
    // Catégories sous "Profil"
    { id: 'my_profile', title: 'Mon Profil', category: 'my_profile', icon: 'User', order: 50, parent: 'profile' },
    { id: 'marketplace', title: 'Vide-Dressing', category: 'marketplace', icon: 'ShoppingBag', order: 51, parent: 'profile' },
    { id: 'sell', title: 'Vendre', category: 'sell', icon: 'Tag', order: 511, parent: 'marketplace' },
    { id: 'purchases', title: 'Achats', category: 'purchases', icon: 'CreditCard', order: 512, parent: 'marketplace' },
    { id: 'settings', title: 'Paramètres', category: 'settings', icon: 'Settings', order: 52, parent: 'profile' },
    { id: 'edit_profile', title: 'Modifier le profil', category: 'edit_profile', icon: 'Edit', order: 521, parent: 'settings' },
    { id: 'privacy', title: 'Confidentialité', category: 'privacy', icon: 'Lock', order: 522, parent: 'settings' },
    { id: 'security', title: 'Sécurité', category: 'security', icon: 'Shield', order: 523, parent: 'settings' },
    { id: 'notification_settings', title: 'Préférences de notifications', category: 'notification_settings', icon: 'Bell', order: 524, parent: 'settings' },
    { id: 'preferences', title: 'Préférences', category: 'preferences', icon: 'Sliders', order: 525, parent: 'settings' },
    { id: 'data_storage', title: 'Données et stockage', category: 'data_storage', icon: 'Database', order: 526, parent: 'settings' },
    { id: 'help', title: 'Aide & Support', category: 'help', icon: 'HelpCircle', order: 53, parent: 'profile' },
    { id: 'logout', title: 'Déconnexion', category: 'logout', icon: 'LogOut', order: 54, parent: 'profile' },
    
    // Menu Boutique (simplifié)
    { id: 'shop_dashboard', title: 'Tableau de Bord Boutique', category: 'shop_dashboard', icon: 'LayoutDashboard', order: 70 },
    { id: 'shop_storefront', title: 'Vitrine', category: 'shop_storefront', icon: 'Storefront', order: 71 },
    { id: 'shop_orders', title: 'Commandes', category: 'shop_orders', icon: 'Package', order: 72 },
    { id: 'shop_messages', title: 'Messages Boutique', category: 'shop_messages', icon: 'Mail', order: 73 },
    
    // Administration
    { id: 'admin', title: 'Administration', category: 'admin', icon: 'Shield', order: 80 },
    { id: 'admin_dashboard', title: 'Tableau de Bord Admin', category: 'admin_dashboard', icon: 'LayoutDashboard', order: 81, parent: 'admin' },
    { id: 'admin_users', title: 'Utilisateurs', category: 'admin_users', icon: 'Users', order: 82, parent: 'admin' },
    { id: 'admin_users_manage', title: 'Gérer les Utilisateurs', category: 'admin_users_manage', icon: 'UserCog', order: 821, parent: 'admin_users' },
    { id: 'admin_users_stats', title: 'Statistiques Utilisateurs', category: 'admin_users_stats', icon: 'BarChart', order: 822, parent: 'admin_users' },
    { id: 'admin_shops', title: 'Boutiques', category: 'admin_shops', icon: 'Store', order: 83, parent: 'admin' },
    { id: 'admin_shops_manage', title: 'Gérer les Boutiques', category: 'admin_shops_manage', icon: 'Store', order: 831, parent: 'admin_shops' },
    { id: 'admin_shops_stats', title: 'Statistiques Boutiques', category: 'admin_shops_stats', icon: 'BarChart', order: 832, parent: 'admin_shops' },
    { id: 'admin_marketplace', title: 'Vide-Dressing', category: 'admin_marketplace', icon: 'ShoppingBag', order: 84, parent: 'admin' },
    { id: 'admin_marketplace_items', title: 'Gérer les Articles', category: 'admin_marketplace_items', icon: 'Package', order: 841, parent: 'admin_marketplace' },
    { id: 'admin_marketplace_transactions', title: 'Transactions', category: 'admin_marketplace_transactions', icon: 'CreditCard', order: 842, parent: 'admin_marketplace' },
    { id: 'admin_marketplace_stats', title: 'Statistiques Vide-Dressing', category: 'admin_marketplace_stats', icon: 'BarChart', order: 843, parent: 'admin_marketplace' },
    { id: 'admin_content', title: 'Contenu', category: 'admin_content', icon: 'FileText', order: 85, parent: 'admin' },
    { id: 'admin_content_challenges', title: 'Défis', category: 'admin_content_challenges', icon: 'Trophy', order: 851, parent: 'admin_content' },
    { id: 'admin_content_groups', title: 'Groupes', category: 'admin_content_groups', icon: 'Users', order: 852, parent: 'admin_content' },
    { id: 'admin_content_moderation', title: 'Modération', category: 'admin_content_moderation', icon: 'ShieldAlert', order: 853, parent: 'admin_content' },
    { id: 'admin_marketing', title: 'Marketing', category: 'admin_marketing', icon: 'Megaphone', order: 86, parent: 'admin' },
    { id: 'admin_marketing_campaigns', title: 'Campagnes', category: 'admin_marketing_campaigns', icon: 'Target', order: 861, parent: 'admin_marketing' },
    { id: 'admin_marketing_newsletters', title: 'Newsletters', category: 'admin_marketing_newsletters', icon: 'Mail', order: 862, parent: 'admin_marketing' },
    { id: 'admin_stats', title: 'Statistiques', category: 'admin_stats', icon: 'BarChart2', order: 87, parent: 'admin' },
    { id: 'admin_stats_general', title: 'Statistiques Générales', category: 'admin_stats_general', icon: 'BarChart2', order: 871, parent: 'admin_stats' },
    { id: 'admin_stats_financial', title: 'Statistiques Financières', category: 'admin_stats_financial', icon: 'DollarSign', order: 872, parent: 'admin_stats' },
    { id: 'admin_settings', title: 'Paramètres Admin', category: 'admin_settings', icon: 'Settings', order: 88, parent: 'admin' },
    { id: 'admin_settings_admins', title: 'Administrateurs', category: 'admin_settings_admins', icon: 'Users', order: 881, parent: 'admin_settings' },
    { id: 'admin_settings_roles', title: 'Rôles et Permissions', category: 'admin_settings_roles', icon: 'Lock', order: 882, parent: 'admin_settings' },
    { id: 'admin_settings_config', title: 'Configuration Générale', category: 'admin_settings_config', icon: 'Wrench', order: 883, parent: 'admin_settings' },
  ], []);

  // Organiser les catégories pour l'affichage dans le menu
  const menuGroups = useMemo(() => {
    // Extraire les catégories principales (niveau 1)
    const mainCategories = categories
      .filter(cat => ['main', 'explore', 'personal', 'social', 'profile'].includes(cat.id))
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    
    // Créer un objet qui mappe les catégories principales à leurs sous-catégories
    const categoryMap = mainCategories.reduce((acc, category) => {
      // Récupérer les sous-catégories de niveau 1 pour cette catégorie principale
      const subcategories = categories
        .filter(cat => cat.parent === category.id)
        .sort((a, b) => (a.order || 999) - (b.order || 999));
      
      acc[category.id] = subcategories;
      return acc;
    }, {} as Record<string, MenuCategory[]>);
    
    // Ajouter les catégories d'administration
    const adminCategories = categories
      .filter(cat => cat.id === 'admin' || cat.parent === 'admin')
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    
    // Ajouter les catégories de boutique
    const shopCategories = categories
      .filter(cat => cat.id.startsWith('shop_'))
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    
    return {
      main: mainCategories,
      categoryMap,
      adminCategories,
      shopCategories
    };
  }, [categories]);

  return (
    <div className="space-y-2">
      {/* Afficher les catégories principales */}
      {menuGroups.main.map(cat => (
        <CategoryGroup 
          key={cat.id} 
          title={cat.title} 
          category={cat.category as MenuItemCategory} 
          icon={cat.icon} 
        />
      ))}
      
      {/* Ajouter une section pour les boutiques si l'utilisateur est un vendeur/boutique */}
      {menuGroups.shopCategories.length > 0 && (
        <div className="mt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Boutique
          </h3>
          <div className="mt-1">
            {menuGroups.shopCategories.map(cat => (
              <CategoryGroup 
                key={cat.id} 
                title={cat.title} 
                category={cat.category as MenuItemCategory} 
                icon={cat.icon} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuCategories;
