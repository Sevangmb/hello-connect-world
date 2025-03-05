
/**
 * Types du domaine du service catalogue
 */

export interface CatalogItem {
  id: string;
  itemId: string;
  shopId: string;
  sellerId: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string | null;
  category: string;
  status: CatalogItemStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export type CatalogItemStatus = 'available' | 'sold' | 'reserved' | 'unavailable';

export interface ShopItemDetails {
  id: string;
  shopId: string;
  clothesId: string;
  price: number;
  originalPrice?: number;
  status: string;
  shop?: {
    name: string;
    sellerId: string;
  };
  clothes?: {
    name: string;
    description?: string;
    category: string;
    imageUrl?: string | null;
  };
}

export interface CatalogFilter {
  category?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  shopId?: string;
  sellerId?: string;
  status?: CatalogItemStatus | CatalogItemStatus[];
  searchTerm?: string;
  sortBy?: 'price' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CatalogResult {
  items: CatalogItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface StockUpdate {
  itemId: string;
  status: CatalogItemStatus;
  metadata?: Record<string, any>;
}

export interface PriceUpdate {
  itemId: string;
  price: number;
  originalPrice?: number;
}
