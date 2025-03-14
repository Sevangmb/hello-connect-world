
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionStatus } from "./types";

/**
 * Hook qui vérifie l'état de la connexion à Supabase
 */
export function useConnectionChecker() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let checkCount = 0;
    const maxChecks = 3;

    const checkConnection = async () => {
      try {
        // Augmenter le compteur de vérifications
        checkCount++;
        
        // Si nous avons dépassé le nombre maximum de vérifications, arrêter
        if (checkCount > maxChecks) {
          console.log("Nombre maximum de vérifications atteint, supposer connecté");
          if (isMounted) {
            setConnectionStatus('connected');
            setError(null);
          }
          return;
        }

        // Tenter une requête simple pour vérifier la connexion
        // Utiliser la table app_modules au lieu de health_checks qui n'existe pas
        const { data, error } = await supabase
          .from('app_modules')
          .select('*')
          .limit(1)
          .maybeSingle();

        // En cas d'erreur, vérifier si c'est une erreur de connexion
        if (error) {
          // Si c'est une erreur d'autorisation, nous sommes connectés mais pas autorisés
          if (error.code === '42501' || error.code === 'PGRST301') {
            if (isMounted) {
              console.log("Erreur d'autorisation, mais la connexion est OK");
              setConnectionStatus('connected');
              setError(null);
            }
          } else {
            // Autre type d'erreur
            if (isMounted) {
              console.error("Erreur de connexion:", error);
              setConnectionStatus('disconnected');
              setError(error.message);
            }
          }
        } else {
          // Pas d'erreur, nous sommes connectés
          if (isMounted) {
            console.log("Connexion à Supabase établie avec succès");
            setConnectionStatus('connected');
            setError(null);
          }
        }
      } catch (err: any) {
        // Erreur inattendue
        if (isMounted) {
          console.error("Erreur lors de la vérification de la connexion:", err);
          setConnectionStatus('disconnected');
          setError(err.message || "Erreur de connexion inconnue");
        }
      }
    };

    // Vérification initiale
    checkConnection();

    // Force une connexion après un délai pour ne pas bloquer l'interface
    const timer = setTimeout(() => {
      if (isMounted && connectionStatus === 'checking') {
        console.log("Timeout de vérification de connexion, supposer connecté");
        setConnectionStatus('connected');
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [connectionStatus]);

  return { connectionStatus, error };
}
