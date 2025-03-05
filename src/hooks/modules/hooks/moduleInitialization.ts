
// Exporter l'initialisation du module
export const moduleInitialization = {
  initializeModules: async () => {
    // Logique d'initialisation
    console.log('Initializing modules...');
    // Implémenter selon les besoins
    return true;
  }
};

export const initializeModuleApi = async () => {
  console.log('Initializing module API...');
  return await moduleInitialization.initializeModules();
};
