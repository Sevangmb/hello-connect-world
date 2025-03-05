
import { MenuItem } from '../types';
import { CACHE_VALIDITY_MS } from '@/hooks/modules/constants';

interface CacheItem {
  items: MenuItem[];
  timestamp: number;
}

class MenuCacheService {
  private cache: Record<string, CacheItem> = {};

  getCache(key: string): MenuItem[] | null {
    const cacheItem = this.cache[key];
    if (!cacheItem) return null;
    
    const now = Date.now();
    if (now - cacheItem.timestamp > CACHE_VALIDITY_MS) {
      delete this.cache[key];
      return null;
    }
    
    return cacheItem.items;
  }

  setCache(key: string, items: MenuItem[]): void {
    this.cache[key] = {
      items,
      timestamp: Date.now()
    };
  }

  clearCache(): void {
    this.cache = {};
  }

  invalidateCache(): void {
    this.cache = {};
  }
}

export { MenuCacheService };
