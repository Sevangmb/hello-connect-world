
/**
 * Gestionnaire d'erreurs pour les opérations de récupération de menu
 */
export const handleMenuFetchError = (
  err: any,
  setError: (error: string | null) => void,
  setMenuItems: (items: any[]) => void,
  toast?: any
): void => {
  const errorMessage = err.message || "Échec du traitement des éléments de menu";
  console.error("Erreur lors du traitement des éléments de menu:", err);
  
  setError(errorMessage);
  setMenuItems([]);
  
  if (toast) {
    toast({
      title: "Erreur de chargement du menu",
      description: errorMessage,
      variant: "destructive"
    });
  }
};
