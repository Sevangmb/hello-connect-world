
/**
 * Repository du catalogue utilisant Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import { ICatalogRepository } from '../domain/interfaces/ICatalogRepository';
import { 
  CatalogFilter, 
  CatalogItem, 
  CatalogItemStatus, 
  CatalogResult, 
  PriceUpdate, 
  StockUpdate 
} from '../domain/types';
import { eventBus } from '@/core/event-bus/EventBus';
import { CATALOG_EVENTS } from '../domain/events';

export class SupabaseCatalogRepository implements ICatalogRepository {
  /**
   * Convertit un shop_item de Supabase en CatalogItem
   */
  private mapToCatalogItem(item: any): CatalogItem {
    return {
      id: item.id,
      itemId: item.id,
      shopId: item.shop_id,
      sellerId: item.shops?.user_id || '',
      name: item.clothes?.name || 'Article sans nom',
      description: item.clothes?.description || undefined,
      price: item.price,
      originalPrice: item.original_price || undefined,
      imageUrl: item.clothes?.image_url || null,
      category: item.clothes?.category || 'non catégorisé',
      status: this.mapStatus(item.status),
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      metadata: {
        shopName: item.shops?.name,
        clothesId: item.clothes_id,
        brand: item.clothes?.brand,
        size: item.clothes?.size,
        color: item.clothes?.color
      }
    };
  }

  /**
   * Convertit le statut Supabase en CatalogItemStatus
   */
  private mapStatus(status: string): CatalogItemStatus {
    switch (status) {
      case 'available':
        return 'available';
      case 'sold':
        return 'sold';
      case 'reserved':
        return 'reserved';
      default:
        return 'unavailable';
    }
  }

  /**
   * Applique les filtres à la requête Supabase
   */
  private applyFilters(query: any, filter: CatalogFilter) {
    if (filter.category) {
      if (Array.isArray(filter.category)) {
        query = query.in('clothes.category', filter.category);
      } else {
        query = query.eq('clothes.category', filter.category);
      }
    }

    if (filter.minPrice !== undefined) {
      query = query.gte('price', filter.minPrice);
    }

    if (filter.maxPrice !== undefined) {
      query = query.lte('price', filter.maxPrice);
    }

    if (filter.shopId) {
      query = query.eq('shop_id', filter.shopId);
    }

    if (filter.sellerId) {
      query = query.eq('shops.user_id', filter.sellerId);
    }

    if (filter.status) {
      if (Array.isArray(filter.status)) {
        query = query.in('status', filter.status);
      } else {
        query = query.eq('status', filter.status);
      }
    } else {
      // Par défaut, n'afficher que les articles disponibles
      query = query.eq('status', 'available');
    }

    if (filter.searchTerm) {
      query = query.or(`name.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%`);
    }

    return query;
  }

  /**
   * Applique le tri à la requête Supabase
   */
  private applySorting(query: any, filter: CatalogFilter) {
    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder || 'desc';
    
    let sortField = 'created_at';
    
    switch (sortBy) {
      case 'price':
        sortField = 'price';
        break;
      case 'popularity':
        // Tri par popularité - on utiliserait idéalement une vue ou une requête plus complexe
        sortField = 'created_at';
        break;
      case 'createdAt':
      default:
        sortField = 'created_at';
        break;
    }
    
    query = query.order(sortField, { ascending: sortOrder === 'asc' });
    
    return query;
  }

  /**
   * Applique la pagination à la requête Supabase
   */
  private applyPagination(query: any, filter: CatalogFilter) {
    const limit = filter.limit || 20;
    const offset = filter.offset || 0;
    
    query = query.range(offset, offset + limit - 1);
    
    return query;
  }

  /**
   * Récupère un élément du catalogue par ID
   */
  async getItemById(itemId: string): Promise<CatalogItem | null> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shops:shop_id (
            name,
            user_id
          ),
          clothes:clothes_id (
            name,
            description,
            category,
            image_url,
            brand,
            size,
            color
          )
        `)
        .eq('id', itemId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Publier un événement pour le suivi des vues
      eventBus.publish(CATALOG_EVENTS.ITEM_VIEWED, { 
        itemId,
        timestamp: Date.now()
      });

      return this.mapToCatalogItem(data);
    } catch (error) {
      console.error('Exception lors de la récupération de l\'article:', error);
      return null;
    }
  }

  /**
   * Recherche des éléments du catalogue selon les filtres
   */
  async searchItems(filter: CatalogFilter): Promise<CatalogResult> {
    try {
      // Construire une requête de base pour compter le total
      let countQuery = supabase
        .from('shop_items')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'available');

      // Appliquer les filtres à la requête de comptage
      countQuery = this.applyFilters(countQuery, filter);

      // Exécuter la requête de comptage
      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Erreur lors du comptage des articles:', countError);
        return { items: [], total: 0, page: 1, pageSize: filter.limit || 20, hasMore: false };
      }

      // Construire la requête principale
      let query = supabase
        .from('shop_items')
        .select(`
          *,
          shops:shop_id (
            name,
            user_id
          ),
          clothes:clothes_id (
            name,
            description,
            category,
            image_url,
            brand,
            size,
            color
          )
        `);

      // Appliquer les filtres
      query = this.applyFilters(query, filter);
      
      // Appliquer le tri
      query = this.applySorting(query, filter);
      
      // Appliquer la pagination
      query = this.applyPagination(query, filter);

      // Exécuter la requête principale
      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors de la recherche d\'articles:', error);
        return { items: [], total: 0, page: 1, pageSize: filter.limit || 20, hasMore: false };
      }

      const items = (data || []).map(item => this.mapToCatalogItem(item));
      const total = count || 0;
      const pageSize = filter.limit || 20;
      const page = Math.floor((filter.offset || 0) / pageSize) + 1;
      const hasMore = total > (filter.offset || 0) + items.length;

      // Publier un événement pour le suivi des recherches
      eventBus.publish(CATALOG_EVENTS.SEARCH_PERFORMED, {
        filter,
        resultCount: items.length,
        totalCount: total,
        timestamp: Date.now()
      });

      return { items, total, page, pageSize, hasMore };
    } catch (error) {
      console.error('Exception lors de la recherche d\'articles:', error);
      return { items: [], total: 0, page: 1, pageSize: filter.limit || 20, hasMore: false };
    }
  }

  /**
   * Mettre à jour le statut d'un article
   */
  async updateItemStatus(update: StockUpdate): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ 
          status: update.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', update.itemId);

      if (error) {
        console.error('Erreur lors de la mise à jour du statut de l\'article:', error);
        return false;
      }

      // Publier un événement pour le changement de statut
      eventBus.publish(CATALOG_EVENTS.ITEM_STATUS_CHANGED, {
        itemId: update.itemId,
        status: update.status,
        metadata: update.metadata,
        timestamp: Date.now()
      });

      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour du statut de l\'article:', error);
      return false;
    }
  }

  /**
   * Mettre à jour le prix d'un article
   */
  async updateItemPrice(update: PriceUpdate): Promise<boolean> {
    try {
      const updateData: any = { 
        price: update.price,
        updated_at: new Date().toISOString()
      };
      
      if (update.originalPrice !== undefined) {
        updateData.original_price = update.originalPrice;
      }
      
      const { error } = await supabase
        .from('shop_items')
        .update(updateData)
        .eq('id', update.itemId);

      if (error) {
        console.error('Erreur lors de la mise à jour du prix de l\'article:', error);
        return false;
      }

      // Publier un événement pour le changement de prix
      eventBus.publish(CATALOG_EVENTS.ITEM_PRICE_CHANGED, {
        itemId: update.itemId,
        price: update.price,
        originalPrice: update.originalPrice,
        timestamp: Date.now()
      });

      return true;
    } catch (error) {
      console.error('Exception lors de la mise à jour du prix de l\'article:', error);
      return false;
    }
  }

  /**
   * Récupère les articles d'un vendeur
   */
  async getSellerItems(sellerId: string, filter: CatalogFilter = {}): Promise<CatalogResult> {
    return this.searchItems({
      ...filter,
      sellerId
    });
  }

  /**
   * Récupère les articles d'une boutique
   */
  async getShopItems(shopId: string, filter: CatalogFilter = {}): Promise<CatalogResult> {
    return this.searchItems({
      ...filter,
      shopId
    });
  }

  /**
   * Récupère les articles par catégorie
   */
  async getItemsByCategory(category: string, filter: CatalogFilter = {}): Promise<CatalogResult> {
    return this.searchItems({
      ...filter,
      category
    });
  }
}
