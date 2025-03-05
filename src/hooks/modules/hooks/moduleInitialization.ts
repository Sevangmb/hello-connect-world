
// Exporter l'initialisation du module
export const moduleInitialization = {
  initializeModules: async () => {
    // Logique d'initialisation
    console.log('Initializing modules...');
    // Implémenter selon les besoins
    return true;
  }
};

export const initializeModuleApi = async (
  isInitialized: boolean,
  setIsInitialized: (value: boolean) => void,
  setInternalModules: any,
  setFeatures: any,
  setLoading: (value: boolean) => void,
  refreshModules: () => Promise<any>,
  refreshFeatures: () => Promise<any>
) => {
  if (!isInitialized) {
    setLoading(true);
    try {
      // Initialize modules
      await moduleInitialization.initializeModules();
      
      // Load modules and features
      await Promise.all([
        refreshModules(),
        refreshFeatures()
      ]);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing module API:', error);
    } finally {
      setLoading(false);
    }
  }
  
  // Return a promise that resolves to true for cleanup
  return Promise.resolve(true);
};
