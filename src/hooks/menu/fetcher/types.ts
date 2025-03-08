
import { MenuItemCategory } from '@/services/menu/types';

/**
 * Types pour le hook useMenuFetcher
 */

export interface MenuFetcherOptions {
  category?: MenuItemCategory;
  moduleCode?: string;
  setLoading: (loading: boolean) => void;
  setMenuItems: (items: any[]) => void;
  setError: (error: Error | null) => void;
  setInitialized: (initialized: boolean) => void;
  toast?: any;
}

export interface MenuFetcherResult {
  isLoading: boolean;
  refetch: () => void;
}
