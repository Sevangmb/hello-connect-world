import { useEffect } from 'react';
import { useModuleUsage } from './hooks/useModuleUsage';

interface Props {
  moduleCode: string;
}

export const useModuleOptimized = ({ moduleCode }: Props) => {
  const moduleUsage = useModuleUsage();

  useEffect(() => {
    moduleUsage.recordModuleUsage(moduleCode);
  }, [moduleCode, moduleUsage.recordModuleUsage]);

  return {
    // You can return any other relevant data or functions here
  };
};
