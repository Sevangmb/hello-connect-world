
import { MenuItem } from '@/services/menu/types';

interface CacheItem {
  items: MenuItem[];
  timestamp: number;
  key: string;
}

const CACHE_EXPIRY_MS = 10000; // 10 seconds

/**
 * Utility functions for menu items caching
 */
export const menuCache = {
  /**
   * Generate a cache key based on menu options
   */
  generateKey: (options: {
    category?: string;
    moduleCode?: string;
    hierarchical?: boolean;
    isAdmin: boolean;
  }): string => {
    return `${options.category || 'all'}-${options.moduleCode || 'none'}-${
      options.isAdmin ? 'admin' : 'user'
    }-${options.hierarchical ? 'tree' : 'flat'}`;
  },

  /**
   * Check if the cache is valid
   */
  isValid: (cache: CacheItem | null, key: string): boolean => {
    if (!cache) return false;
    if (cache.key !== key) return false;
    
    const now = Date.now();
    return now - cache.timestamp < CACHE_EXPIRY_MS;
  },

  /**
   * Create a new cache item
   */
  create: (items: MenuItem[], key: string): CacheItem => {
    return {
      items,
      timestamp: Date.now(),
      key,
    };
  },
};
