
import { useState, useEffect, useCallback } from 'react';
import { AppModule, ModuleStatus } from './types';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { useToast } from '@/hooks/use-toast';

export function useModuleRegistry() {
  const [modules, setModules] = useState<AppModule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        const fetchedModules = await moduleApiGateway.getAllModules();
        setModules(fetchedModules);
        setInitialized(true);
      } catch (err) {
        console.error('Error loading modules:', err);
        setError('Failed to load modules');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les modules de l'application",
        });
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [toast]);

  const initializeModules = useCallback(async () => {
    try {
      setLoading(true);
      await moduleApiGateway.initialize();
      const fetchedModules = await moduleApiGateway.getAllModules();
      setModules(fetchedModules);
      setInitialized(true);
      toast({
        title: "Succès",
        description: "Modules initialisés avec succès",
      });
    } catch (err) {
      console.error('Error initializing modules:', err);
      setError('Failed to initialize modules');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de l'initialisation des modules",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshModules = useCallback(async () => {
    try {
      setLoading(true);
      const refreshedModules = await moduleApiGateway.refreshModules();
      setModules(refreshedModules);
      toast({
        title: "Succès",
        description: "Modules rafraîchis avec succès",
      });
    } catch (err) {
      console.error('Error refreshing modules:', err);
      setError('Failed to refresh modules');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rafraîchir les modules",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateFeatureStatus = useCallback(
    async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
      try {
        setLoading(true);
        await moduleApiGateway.updateFeatureStatus(moduleCode, featureCode, isEnabled);
        // Refresh modules to reflect the updated feature status
        await refreshModules();
        toast({
          title: "Succès",
          description: `Fonctionnalité ${isEnabled ? 'activée' : 'désactivée'} avec succès`,
        });
      } catch (err) {
        console.error('Error updating feature status:', err);
        setError('Failed to update feature status');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour le statut de la fonctionnalité",
        });
      } finally {
        setLoading(false);
      }
    },
    [refreshModules, toast]
  );

  const isModuleDegraded = useCallback(async (moduleId: string) => {
    try {
      return await moduleApiGateway.isModuleDegraded(moduleId);
    } catch (err) {
      console.error('Error checking module status:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier l'état du module",
      });
      return false;
    }
  }, [toast]);

  const isModuleActive = useCallback(async (moduleCode: string) => {
    try {
      return await moduleApiGateway.isModuleActive(moduleCode);
    } catch (err) {
      console.error('Error checking if module is active:', err);
      return false;
    }
  }, []);

  return {
    modules,
    loading,
    error,
    initialized,
    initializeModules,
    refreshModules,
    updateFeatureStatus,
    isModuleDegraded,
    isModuleActive
  };
}
