
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionStatus } from "./types";

/**
 * Hook pour vérifier la connexion à Supabase
 * Inclut un timeout de sécurité pour éviter les blocages
 */
export function useConnectionChecker() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [error, setError] = useState<string | null>(null);

  // Vérifier la connexion à Supabase au démarrage
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple requête pour vérifier la connexion
        const { data, error } = await supabase
          .from('app_modules')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error("Erreur de connexion à Supabase:", error);
          setConnectionStatus('disconnected');
          setError("Problème de connexion à la base de données");
        } else {
          console.log("Connexion à Supabase établie avec succès");
          setConnectionStatus('connected');
        }
      } catch (err) {
        console.error("Exception lors de la vérification de connexion:", err);
        setConnectionStatus('disconnected');
        setError("Problème de connexion à la base de données");
      }
    };
    
    // Lancer la vérification
    checkConnection();
    
    // Définir un timeout de sécurité pour éviter les blocages
    const safetyTimer = setTimeout(() => {
      if (connectionStatus === 'checking') {
        console.warn("Timeout de vérification de connexion dépassé");
        setConnectionStatus('disconnected');
        setError("Délai de connexion dépassé");
      }
    }, 5000);
    
    return () => clearTimeout(safetyTimer);
  }, [connectionStatus]);

  return { connectionStatus, error };
}
