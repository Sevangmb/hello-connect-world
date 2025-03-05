
import { MenuItem } from '../types';
import { CACHE_VALIDITY_MS } from '@/hooks/modules/constants';

interface CacheItem {
  items: MenuItem[];
  timestamp: number;
}

class MenuCacheService {
  private static cache: Record<string, CacheItem> = {};

  getCache(key: string): MenuItem[] | null {
    const cacheItem = MenuCacheService.cache[key];
    if (!cacheItem) return null;
    
    const now = Date.now();
    if (now - cacheItem.timestamp > CACHE_VALIDITY_MS) {
      delete MenuCacheService.cache[key];
      return null;
    }
    
    return cacheItem.items;
  }

  setCache(key: string, items: MenuItem[]): void {
    MenuCacheService.cache[key] = {
      items,
      timestamp: Date.now()
    };
  }

  static clearCache(): void {
    MenuCacheService.cache = {};
  }

  static invalidateCache(): void {
    MenuCacheService.cache = {};
  }
}

export { MenuCacheService };
