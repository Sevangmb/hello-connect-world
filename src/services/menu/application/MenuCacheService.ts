
// Cache expiration time
export const CACHE_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

export class MenuCacheService {
  private static menuCache: Record<string, { data: any, timestamp: number }> = {};
  
  static setMenuData(key: string, data: any): void {
    this.menuCache[key] = {
      data,
      timestamp: Date.now()
    };
  }
  
  static getMenuData(key: string): any | null {
    const cached = this.menuCache[key];
    if (!cached) return null;
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp > CACHE_VALIDITY_MS) {
      delete this.menuCache[key];
      return null;
    }
    
    return cached.data;
  }
  
  static clearCache(): void {
    this.menuCache = {};
  }
  
  static invalidateCache(key: string): void {
    delete this.menuCache[key];
  }
}
