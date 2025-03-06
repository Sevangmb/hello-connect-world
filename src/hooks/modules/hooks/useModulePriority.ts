
import { useState, useCallback, useMemo } from 'react';
import { AppModule } from '../types';
import { CORE_PRIORITY, HIGH_PRIORITY, NORMAL_PRIORITY, LOW_PRIORITY } from '../constants';

/**
 * Hook for managing module priority
 */
export const useModulePriority = () => {
  const [sortByPriority, setSortByPriority] = useState(true);
  
  /**
   * Sort modules by priority
   */
  const sortModulesByPriority = useCallback((modules: AppModule[]): AppModule[] => {
    if (!modules || modules.length === 0) return [];
    
    const priorityMap = {
      [CORE_PRIORITY]: 1,
      [HIGH_PRIORITY]: 2,
      [NORMAL_PRIORITY]: 3,
      [LOW_PRIORITY]: 4
    };
    
    // Sort first by priority, then by name
    return [...modules].sort((a, b) => {
      const aPriority = a.priority !== undefined ? priorityMap[a.priority] || 5 : 5;
      const bPriority = b.priority !== undefined ? priorityMap[b.priority] || 5 : 5;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Sort alphabetically by name if priority is the same
      return (a.name || '').localeCompare(b.name || '');
    });
  }, []);
  
  const toggleSortByPriority = useCallback(() => {
    setSortByPriority(prev => !prev);
  }, []);
  
  // This is a no-op function to satisfy the interface
  const preloadPriorityModules = useCallback(() => {
    console.log('Preloading priority modules...');
    // Implementation would go here if needed
  }, []);
  
  const priorityUtils = useMemo(() => ({
    sortByPriority,
    sortModulesByPriority,
    toggleSortByPriority,
    preloadPriorityModules
  }), [sortByPriority, sortModulesByPriority, toggleSortByPriority, preloadPriorityModules]);
  
  return priorityUtils;
};
