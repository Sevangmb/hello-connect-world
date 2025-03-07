
import { MenuItem, MenuItemCategory } from '../../types';

/**
 * Classe utilitaire pour transformer la structure du menu
 * en fonction de l'arborescence fournie
 */
export class MenuStructureTransformer {
  /**
   * Structure le menu principal en 5 sections principales:
   * Accueil, Explorer, Perso, Communauté, Profil
   */
  static getMainSections(): MenuItemCategory[] {
    return ['main', 'explore', 'personal', 'social', 'profile'];
  }

  /**
   * Obtient les catégories pour une section principale donnée
   */
  static getSubcategoriesForSection(mainCategory: MenuItemCategory): MenuItemCategory[] {
    switch (mainCategory) {
      case 'main':
        return ['weather', 'ai_suggestions', 'feed', 'challenges_banner'];
      case 'explore':
        return ['global_search', 'trends', 'popular_outfits', 'popular_items', 'popular_hashtags', 'shops', 'shop_map'];
      case 'personal':
        return ['wardrobe', 'outfits', 'looks', 'suitcases', 'favorites', 'add_clothing', 'create_outfit', 'publish_look'];
      case 'social':
        return ['messages', 'groups', 'notifications', 'friends'];
      case 'profile':
        return ['my_profile', 'marketplace', 'settings', 'help', 'logout'];
      case 'admin':
        return ['admin_dashboard', 'admin_users', 'admin_shops', 'admin_marketplace', 'admin_content', 'admin_marketing', 'admin_stats', 'admin_settings'];
      default:
        return [];
    }
  }

  /**
   * Obtient les sous-catégories de niveau 2 pour une catégorie de niveau 1
   */
  static getLevel2Subcategories(category: MenuItemCategory): MenuItemCategory[] {
    switch (category) {
      case 'favorites':
        return ['favorite_items', 'favorite_outfits', 'favorite_users', 'favorite_shops'];
      case 'add_clothing':
        return ['scan_label', 'take_photo', 'import_gallery', 'manual_entry'];
      case 'marketplace':
        return ['sell', 'purchases'];
      case 'settings':
        return ['edit_profile', 'privacy', 'security', 'notification_settings', 'preferences', 'data_storage'];
      case 'admin_users':
        return ['admin_users_manage', 'admin_users_stats'];
      case 'admin_shops':
        return ['admin_shops_manage', 'admin_shops_stats'];
      case 'admin_marketplace':
        return ['admin_marketplace_items', 'admin_marketplace_transactions', 'admin_marketplace_stats'];
      case 'admin_content':
        return ['admin_content_challenges', 'admin_content_groups', 'admin_content_moderation'];
      case 'admin_marketing':
        return ['admin_marketing_campaigns', 'admin_marketing_newsletters'];
      case 'admin_stats':
        return ['admin_stats_general', 'admin_stats_financial'];
      case 'admin_settings':
        return ['admin_settings_admins', 'admin_settings_roles', 'admin_settings_config'];
      default:
        return [];
    }
  }

  /**
   * Regroupe les éléments de menu par catégorie principale
   */
  static groupItemsByMainCategory(items: MenuItem[]): Record<MenuItemCategory, MenuItem[]> {
    const mainSections = this.getMainSections();
    const result: Record<string, MenuItem[]> = {};
    
    // Initialiser les sections principales avec des tableaux vides
    mainSections.forEach(section => {
      result[section] = [];
    });
    
    // Ajouter une section admin si nécessaire
    result['admin'] = [];
    
    // Regrouper les éléments par catégorie principale
    items.forEach(item => {
      const category = item.category as string;
      
      // Vérifier si c'est une catégorie principale
      if (mainSections.includes(category as MenuItemCategory)) {
        if (!result[category]) {
          result[category] = [];
        }
        result[category].push(item);
      } else if (category.startsWith('admin_')) {
        // Les éléments admin vont dans la section admin
        if (!result['admin']) {
          result['admin'] = [];
        }
        result['admin'].push(item);
      } else {
        // Pour les autres, déterminer à quelle section principale ils appartiennent
        let assigned = false;
        
        // Vérifier dans quelle section principale cette sous-catégorie devrait aller
        for (const mainSection of mainSections) {
          const subcategories = this.getSubcategoriesForSection(mainSection);
          if (subcategories.includes(category as MenuItemCategory)) {
            if (!result[mainSection]) {
              result[mainSection] = [];
            }
            result[mainSection].push(item);
            assigned = true;
            break;
          }
        }
        
        // Si aucune correspondance n'est trouvée, mettre dans "utility"
        if (!assigned) {
          if (!result['utility']) {
            result['utility'] = [];
          }
          result['utility'].push(item);
        }
      }
    });
    
    return result as Record<MenuItemCategory, MenuItem[]>;
  }

  /**
   * Construit une structure de menu hiérarchique 
   * en utilisant les relations parent-enfant
   */
  static buildHierarchicalMenu(items: MenuItem[]): MenuItem[] {
    if (!items || items.length === 0) {
      return [];
    }
    
    // Créer un map pour accéder rapidement aux éléments par ID
    const itemMap = new Map<string, MenuItem>();
    
    // Copier les éléments pour éviter de modifier l'original
    const itemsCopy = items.map(item => ({
      ...item,
      children: [] as MenuItem[]
    }));
    
    // Alimenter le map
    itemsCopy.forEach(item => {
      itemMap.set(item.id, item);
    });
    
    // Construire la hiérarchie
    const rootItems: MenuItem[] = [];
    
    itemsCopy.forEach(item => {
      if (item.parent_id) {
        // Cet élément a un parent
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          // Ajouter cet élément comme enfant de son parent
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
        } else {
          // Si le parent n'existe pas, traiter comme élément racine
          rootItems.push(item);
        }
      } else {
        // Cet élément est un élément racine
        rootItems.push(item);
      }
    });
    
    // Trier les éléments par position ou ordre
    return this.sortMenuItems(rootItems);
  }

  /**
   * Trie récursivement les éléments de menu et leurs enfants
   */
  static sortMenuItems(items: MenuItem[]): MenuItem[] {
    return items
      .sort((a, b) => {
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        }
        return (a.order || 999) - (b.order || 999);
      })
      .map(item => {
        if (item.children && item.children.length > 0) {
          item.children = this.sortMenuItems(item.children);
        }
        return item;
      });
  }
}
