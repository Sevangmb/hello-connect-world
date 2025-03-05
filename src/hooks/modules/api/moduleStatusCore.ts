
import { ModuleStatus } from '../types';

export const isActiveStatus = (status: ModuleStatus): boolean => {
  return status === 'active';
};

export const isDegradedStatus = (status: ModuleStatus): boolean => {
  return status === 'degraded';
};

export const isInactiveStatus = (status: ModuleStatus): boolean => {
  return status === 'inactive';
};

export const isMaintenanceStatus = (status: ModuleStatus): boolean => {
  return status === 'maintenance';
};

export const getEffectiveStatus = (status: ModuleStatus, hasMissingDependencies: boolean): ModuleStatus => {
  if (status === 'active' && hasMissingDependencies) {
    return 'degraded';
  }
  return status;
};
