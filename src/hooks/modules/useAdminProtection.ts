
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook pour assurer la protection du module Admin
 * Appelle la fonction Edge toutes les heures et au démarrage de l'application
 */
export const useAdminProtection = () => {
  useEffect(() => {
    // Fonction pour appeler l'Edge Function qui protège le module Admin
    const protectAdminModule = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('protect-admin-module');
        
        if (error) {
          console.error('Erreur lors de la protection du module Admin:', error);
          return;
        }
        
        console.log('Protection du module Admin effectuée:', data);
      } catch (err) {
        console.error('Exception lors de la protection du module Admin:', err);
      }
    };
    
    // Appeler immédiatement la fonction de protection
    protectAdminModule();
    
    // Configurer un intervalle pour appeler la fonction périodiquement (toutes les heures)
    const interval = setInterval(protectAdminModule, 60 * 60 * 1000);
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []);
};
