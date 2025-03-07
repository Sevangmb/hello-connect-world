
import { useMenuFetcher as useMenuFetcherImplementation } from './fetcher';
import { MenuFetcherOptions, MenuFetcherResult } from './fetcher/types';

/**
 * Hook pour récupérer les éléments de menu
 * @deprecated Utiliser l'importation depuis './fetcher' à la place
 */
export const useMenuFetcher = (options: MenuFetcherOptions): MenuFetcherResult => {
  return useMenuFetcherImplementation(options);
};
