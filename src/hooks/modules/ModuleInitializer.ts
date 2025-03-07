
import { supabase } from '@/integrations/supabase/client';
import { AppModule, ModuleStatus } from './types';

export const initializeModules = async (): Promise<boolean> => {
  try {
    console.log('Initializing modules...');
    
    // Vérifier si des modules existent déjà
    const { count, error: countError } = await supabase
      .from('app_modules')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error checking modules:', countError);
      return false;
    }
    
    // Si des modules existent déjà, ne rien faire
    if (count && count > 0) {
      console.log(`${count} modules already exist, skipping initialization.`);
      return true;
    }
    
    // Définir les modules de base
    const coreModules: AppModule[] = [
      {
        id: '1',
        name: 'Core',
        code: 'core',
        description: 'Module de base de l\'application',
        status: 'active' as ModuleStatus,
        is_core: true,
        priority: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Administration',
        code: 'admin',
        description: 'Module d\'administration',
        status: 'active' as ModuleStatus,
        is_core: true,
        is_admin: true,
        priority: 90,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Garde-robe',
        code: 'wardrobe',
        description: 'Module de gestion des vêtements',
        status: 'active' as ModuleStatus,
        is_core: true,
        priority: 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Social',
        code: 'social',
        description: 'Module social',
        status: 'active' as ModuleStatus,
        is_core: false,
        priority: 70,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Marketplace',
        code: 'marketplace',
        description: 'Module de marché',
        status: 'active' as ModuleStatus,
        is_core: false,
        priority: 60,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    // Insérer les modules un par un
    for (const module of coreModules) {
      const { error } = await supabase
        .from('app_modules')
        .insert({
          id: module.id,
          name: module.name,
          code: module.code,
          description: module.description,
          status: module.status,
          is_core: module.is_core,
          is_admin: module.is_admin || false,
          priority: module.priority,
          created_at: module.created_at,
          updated_at: module.updated_at
        });
        
      if (error) {
        console.error(`Error inserting module ${module.name}:`, error);
        return false;
      }
    }
    
    console.log(`${coreModules.length} modules initialized successfully.`);
    return true;
  } catch (error) {
    console.error('Error initializing modules:', error);
    return false;
  }
};

export default initializeModules;
