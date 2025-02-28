
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook pour assurer la protection du module Admin
 * Appelle la fonction Edge toutes les heures et au démarrage de l'application
 */
export const useAdminProtection = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Fonction pour appeler l'Edge Function qui protège le module Admin
    const protectAdminModule = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('protect-admin-module');
        
        if (error) {
          console.error('Erreur lors de la protection du module Admin:', error);
          
          // Afficher un toast d'erreur uniquement pour les administrateurs
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', user.id)
              .single();
              
            if (profile?.is_admin) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de vérifier la protection du module Admin",
              });
            }
          }
          
          return;
        }
        
        console.log('Protection du module Admin effectuée:', data);
        
        // Si le module a été réactivé, afficher un toast uniquement pour les administrateurs
        if (data && data.message && data.message.includes('réactivé')) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', user.id)
              .single();
              
            if (profile?.is_admin) {
              toast({
                title: "Module Admin protégé",
                description: data.message,
              });
            }
          }
        }
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
  }, [toast]);
};
