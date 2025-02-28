
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Cache côté client pour limiter les appels répétés
const adminStatusCache: {
  [userId: string]: {
    isAdmin: boolean;
    timestamp: number;
  }
} = {};

/**
 * Hook personnalisé pour vérifier si l'utilisateur a des droits d'administrateur
 * en utilisant l'edge function Supabase pour protection additionnelle
 */
export const useAdminProtection = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour vérifier le statut admin de l'utilisateur
  const checkAdminStatus = useCallback(async () => {
    try {
      setLoading(true);
      
      // Vérifier d'abord la session utilisateur
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        console.log("Pas de session utilisateur active");
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      const currentUserId = session.user.id;
      setUserId(currentUserId);
      
      // Vérifier le cache d'abord pour éviter des appels inutiles
      const cachedStatus = adminStatusCache[currentUserId];
      const now = Date.now();
      
      if (cachedStatus && (now - cachedStatus.timestamp < 5 * 60 * 1000)) { // Cache valide pour 5 minutes
        console.log("Utilisation du statut admin en cache");
        setIsAdmin(cachedStatus.isAdmin);
        setLoading(false);
        return;
      }
      
      // Vérifier avec la fonction Edge pour une double protection
      const { data, error } = await supabase.functions.invoke('protect-admin-module', {
        body: { userId: currentUserId }
      });
      
      if (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        throw new Error(error.message);
      }
      
      // Mettre à jour le cache
      adminStatusCache[currentUserId] = {
        isAdmin: data.isAdmin,
        timestamp: now
      };
      
      setIsAdmin(data.isAdmin);
      
      if (!data.isAdmin) {
        console.log("L'utilisateur n'est pas administrateur");
      } else {
        console.log("Utilisateur authentifié comme administrateur");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des droits admin:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Impossible de vérifier vos droits d'administrateur",
      });
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Vérifier le statut admin au chargement du composant
  useEffect(() => {
    checkAdminStatus();
    
    // Configurer un écouteur pour les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAdmin(false);
        setUserId(null);
      } else {
        checkAdminStatus();
      }
    });
    
    return () => {
      // Nettoyer les écouteurs à la destruction du composant
      authListener.subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  return {
    loading,
    isAdmin,
    userId,
    refreshAdminStatus: checkAdminStatus
  };
};

export default useAdminProtection;
