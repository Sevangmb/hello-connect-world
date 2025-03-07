
/**
 * @deprecated Utilisez MenuCacheService à la place
 * Base repository class with caching functionality
 */
export abstract class BaseRepository<T> {
  protected _cachedItems: Record<string, T[]> = {};
  protected _lastCacheTime = 0;
  
  protected readonly CACHE_TTL = 10000; // 10 seconds cache TTL
  
  /**
   * Check if the cache is still valid
   */
  protected isCacheValid(cacheKey: string): boolean {
    return !!this._cachedItems[cacheKey] && 
           Date.now() - this._lastCacheTime < this.CACHE_TTL;
  }
  
  /**
   * Reset the entire cache
   */
  protected resetCache(): void {
    this._cachedItems = {};
    this._lastCacheTime = 0;
  }
  
  /**
   * Update cache with new data
   */
  protected updateCache(cacheKey: string, data: T[]): void {
    this._cachedItems[cacheKey] = data;
    this._lastCacheTime = Date.now();
  }
}
