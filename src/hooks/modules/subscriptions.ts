
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionCallbacks {
  onModuleChange: () => void;
  onFeatureChange: () => void;
}

/**
 * Créer des abonnements temps réel aux tables de modules et fonctionnalités
 */
export const createModuleSubscriptions = (callbacks: SubscriptionCallbacks) => {
  const { onModuleChange, onFeatureChange } = callbacks;
  
  // Créer un canal pour les changements de modules
  const moduleChannel = supabase
    .channel('app_modules_changes')
    .on('postgres_changes', { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'app_modules' 
    }, onModuleChange)
    .subscribe();
    
  // Créer un canal pour les changements de fonctionnalités
  const featureChannel = supabase
    .channel('module_features_changes')
    .on('postgres_changes', { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'module_features' 
    }, onFeatureChange)
    .subscribe();

  // Fonction pour nettoyer les abonnements
  const cleanup = () => {
    supabase.removeChannel(moduleChannel);
    supabase.removeChannel(featureChannel);
  };

  return { cleanup, channels: [moduleChannel, featureChannel] };
};
