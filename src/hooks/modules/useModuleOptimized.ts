import { useEffect } from 'react';
import { useModuleUsage } from './hooks/useModuleUsage';

interface Props {
  moduleCode: string;
}

export const useModuleOptimized = ({ moduleCode }: Props) => {
  const moduleUsage = useModuleUsage(moduleCode);

  useEffect(() => {
    moduleUsage.trackUsage();
  }, [moduleCode, moduleUsage.trackUsage]);

  return {
    trackUsage: () => {
      if (moduleUsage) {
        moduleUsage.trackUsage();
      }
    }
  };
};
