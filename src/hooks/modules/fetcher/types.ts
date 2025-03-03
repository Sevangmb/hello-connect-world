
// Types for data fetching
import { AppModule, ModuleDependency } from "../types";

export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

export interface ModuleDataFetcherReturn {
  modules: AppModule[];
  setModules: React.Dispatch<React.SetStateAction<AppModule[]>>;
  dependencies: ModuleDependency[];
  setDependencies: React.Dispatch<React.SetStateAction<ModuleDependency[]>>;
  features: Record<string, Record<string, boolean>>;
  setFeatures: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  loading: boolean;
  error: string | null;
  fetchModules: () => Promise<AppModule[]>;
  fetchDependencies: () => Promise<ModuleDependency[]>;
  fetchFeatures: () => Promise<Record<string, Record<string, boolean>>>;
  connectionStatus: ConnectionStatus;
}
