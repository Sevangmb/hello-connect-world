
import React, { useState, useEffect, useMemo } from "react";
import { useModules } from "@/hooks/modules";
import { ModuleUnavailable } from "./ModuleUnavailable";
import { ModuleDegraded } from "./ModuleDegraded";
import { getModuleStatusFromCache } from "@/hooks/modules/api/moduleStatusCore";
import { ModuleStatus } from "@/hooks/modules/types";
import { isAdminModule } from "@/hooks/modules/api/moduleStatusCore";

interface ModuleGuardProps {
  moduleCode: string;
  children: React.ReactNode;
  fallback?: React.ReactNode; // Prop fallback optionnel
}

// Cache global en mémoire des statuts pour tous les composants ModuleGuard
const moduleStatusGlobalCache: Record<string, {active: boolean, degraded: boolean, timestamp: number}> = {};
// Durée de validité du cache global: 10 secondes
const GLOBAL_CACHE_VALIDITY_MS = 10000;

export function ModuleGuard({ moduleCode, children, fallback }: ModuleGuardProps) {
  const { isModuleActive, isModuleDegraded, refreshModules } = useModules();
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [isDegraded, setIsDegraded] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Vérification immédiate pour les modules admin
  const isAdmin = useMemo(() => isAdminModule(moduleCode), [moduleCode]);
  
  // Effet qui s'exécute immédiatement pour vérifier le cache rapide
  useEffect(() => {
    // Si c'est un module admin, on court-circuite tout le processus
    if (isAdmin) {
      setIsActive(true);
      setIsDegraded(false);
      setIsChecking(false);
      return;
    }
    
    console.log(`ModuleGuard: Vérification initiale pour ${moduleCode}`);
    
    // Vérifier d'abord le cache global
    const now = Date.now();
    const cachedStatus = moduleStatusGlobalCache[moduleCode];
    
    if (cachedStatus && (now - cachedStatus.timestamp < GLOBAL_CACHE_VALIDITY_MS)) {
      // Utiliser le cache global
      console.log(`ModuleGuard: Utilisation du cache global pour ${moduleCode}: actif=${cachedStatus.active}`);
      setIsActive(cachedStatus.active);
      setIsDegraded(cachedStatus.degraded);
      setIsChecking(false);
      return;
    }
    
    // Vérifier ensuite le cache de statut
    const moduleStatus = getModuleStatusFromCache(moduleCode);
    if (moduleStatus !== null) {
      const active = moduleStatus === 'active';
      const degraded = moduleStatus === 'degraded';
      
      console.log(`ModuleGuard: Status de ${moduleCode} depuis le cache rapide: ${moduleStatus}`);
      
      // Mettre à jour le cache global
      moduleStatusGlobalCache[moduleCode] = {
        active,
        degraded,
        timestamp: now
      };
      
      setIsActive(active);
      setIsDegraded(degraded);
      setIsChecking(false);
    }
  }, [moduleCode, isAdmin]);

  // Effet principal qui s'exécute après le premier rendu si le cache rapide n'a pas fourni de résultat
  useEffect(() => {
    // Si déjà défini par le cache rapide ou si c'est un module admin, ne pas continuer
    if (isActive !== null || isAdmin) return;
    
    const checkModuleStatus = async () => {
      setIsChecking(true);
      
      try {
        console.log(`ModuleGuard: Vérification complète pour ${moduleCode}`);
        
        // Vérifier le statut du module
        const active = isModuleActive(moduleCode);
        const degraded = isModuleDegraded(moduleCode);
        
        console.log(`ModuleGuard: Résultat pour ${moduleCode}: actif=${active}, dégradé=${degraded}`);
        
        // Mettre à jour le cache global
        moduleStatusGlobalCache[moduleCode] = {
          active,
          degraded,
          timestamp: Date.now()
        };
        
        setIsActive(active);
        setIsDegraded(degraded);
      } catch (error) {
        console.error(`Erreur lors de la vérification du module ${moduleCode}:`, error);
        // En cas d'erreur, considérer le module comme inactif pour être prudent
        setIsActive(false);
        setIsDegraded(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkModuleStatus();
    
    // Forcer une actualisation périodique du statut
    const intervalId = setInterval(() => {
      checkModuleStatus();
    }, 60000); // Vérifier toutes les minutes
    
    return () => clearInterval(intervalId);
  }, [moduleCode, isModuleActive, isModuleDegraded, isAdmin, isActive]);

  // Pendant la vérification initiale, montrer une version simplifiée
  if (isChecking && isActive === null) {
    return <div className="inline-block py-1 px-2 text-xs text-gray-400">Chargement...</div>;
  }

  // Si le module est inactif
  if (isActive === false) {
    // Utiliser le fallback personnalisé si fourni, sinon utiliser le composant par défaut
    return fallback || <ModuleUnavailable moduleCode={moduleCode} />;
  }

  // Si le module est dégradé
  if (isDegraded) {
    return (
      <>
        <ModuleDegraded moduleCode={moduleCode} />
        {children}
      </>
    );
  }

  // Si tout est bon, rendre les enfants normalement
  return <>{children}</>;
}
