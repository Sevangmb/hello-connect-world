
/**
 * Gestionnaire d'erreurs pour les opérations de récupération de menu
 */
export const handleMenuFetchError = (
  err: any,
  setError: (error: Error | null) => void,
  setMenuItems: (items: any[]) => void,
  toast?: any
): void => {
  const errorMessage = err instanceof Error ? err : new Error(String(err));
  console.error("Erreur lors du traitement des éléments de menu:", err);
  
  setError(errorMessage);
  setMenuItems([]);
  
  if (toast) {
    toast({
      title: "Erreur de chargement du menu",
      description: errorMessage.message || "Échec du traitement des éléments de menu",
      variant: "destructive"
    });
  }
};
