
import { useEffect, useState } from 'react';
import { useModuleApi } from './useModuleApi';

export const useModuleOptimized = (moduleCode: string) => {
  const { recordModuleUsage } = useModuleApi();
  const [hasRecorded, setHasRecorded] = useState(false);

  useEffect(() => {
    // Record module usage only once per session
    if (!hasRecorded) {
      const recordUsage = async () => {
        try {
          await recordModuleUsage(moduleCode);
          setHasRecorded(true);
        } catch (error) {
          console.error("Error recording module usage:", error);
        }
      };
      
      recordUsage();
    }
  }, [moduleCode, recordModuleUsage, hasRecorded]);

  return { moduleCode };
};
