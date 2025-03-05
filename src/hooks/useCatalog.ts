
/**
 * Hook pour utiliser le service de catalogue
 */
import { useState, useEffect, useCallback } from 'react';
import { getCatalogService } from '@/core/catalog/infrastructure/catalogDependencyProvider';
import { 
  CatalogFilter, 
  CatalogItem, 
  CatalogResult, 
  PriceUpdate, 
  StockUpdate 
} from '@/core/catalog/domain/types';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

export function useCatalog() {
  const catalogService = getCatalogService();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<CatalogItem | null>(null);
  const [searchResults, setSearchResults] = useState<CatalogResult>({
    items: [],
    total: 0,
    page: 1, 
    pageSize: 20,
    hasMore: false
  });
  
  // Récupérer un article par ID
  const getItemById = useCallback(async (itemId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const item = await catalogService.getItemById(itemId);
      setCurrentItem(item);
      return item;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération de l\'article');
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails de l'article",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [catalogService, toast]);
  
  // Rechercher des articles avec filtres
  const searchItems = useCallback(async (filter: CatalogFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await catalogService.searchItems(filter);
      setSearchResults(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche d\'articles');
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les articles",
        variant: "destructive"
      });
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: filter.limit || 20,
        hasMore: false
      };
    } finally {
      setLoading(false);
    }
  }, [catalogService, toast]);
  
  // Mettre à jour le statut d'un article
  const updateItemStatus = useCallback(async (update: StockUpdate) => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      });
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await catalogService.updateItemStatus(update);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Le statut de l'article a été mis à jour",
          variant: "default"
        });
        
        // Rafraîchir l'article si c'est celui actuellement affiché
        if (currentItem && currentItem.id === update.itemId) {
          await getItemById(update.itemId);
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut de l'article",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'article",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [catalogService, toast, isAuthenticated, currentItem, getItemById]);
  
  // Mettre à jour le prix d'un article
  const updateItemPrice = useCallback(async (update: PriceUpdate) => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      });
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await catalogService.updateItemPrice(update);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Le prix de l'article a été mis à jour",
          variant: "default"
        });
        
        // Rafraîchir l'article si c'est celui actuellement affiché
        if (currentItem && currentItem.id === update.itemId) {
          await getItemById(update.itemId);
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le prix de l'article",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du prix');
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prix de l'article",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [catalogService, toast, isAuthenticated, currentItem, getItemById]);
  
  // Récupérer les articles d'un vendeur
  const getSellerItems = useCallback(async (sellerId: string, filter: CatalogFilter = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await catalogService.getSellerItems(sellerId, filter);
      setSearchResults(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des articles du vendeur');
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les articles du vendeur",
        variant: "destructive"
      });
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: filter.limit || 20,
        hasMore: false
      };
    } finally {
      setLoading(false);
    }
  }, [catalogService, toast]);
  
  // Récupérer les articles d'une boutique
  const getShopItems = useCallback(async (shopId: string, filter: CatalogFilter = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await catalogService.getShopItems(shopId, filter);
      setSearchResults(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des articles de la boutique');
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les articles de la boutique",
        variant: "destructive"
      });
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: filter.limit || 20,
        hasMore: false
      };
    } finally {
      setLoading(false);
    }
  }, [catalogService, toast]);
  
  // Récupérer les articles par catégorie
  const getItemsByCategory = useCallback(async (category: string, filter: CatalogFilter = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await catalogService.getItemsByCategory(category, filter);
      setSearchResults(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des articles par catégorie');
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les articles de cette catégorie",
        variant: "destructive"
      });
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: filter.limit || 20,
        hasMore: false
      };
    } finally {
      setLoading(false);
    }
  }, [catalogService, toast]);
  
  // Invalider le cache
  const invalidateCache = useCallback((itemId?: string) => {
    if (itemId) {
      catalogService.invalidateItemCache(itemId);
    } else {
      catalogService.clearAllCaches();
    }
  }, [catalogService]);
  
  return {
    // États
    loading,
    error,
    currentItem,
    searchResults,
    
    // Fonctions
    getItemById,
    searchItems,
    updateItemStatus,
    updateItemPrice,
    getSellerItems,
    getShopItems,
    getItemsByCategory,
    invalidateCache
  };
}
