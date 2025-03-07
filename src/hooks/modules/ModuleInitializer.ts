
import { supabase } from '@/integrations/supabase/client';
import { AppModule, ModuleStatus } from './types';

// Core module data for initialization
const coreModules = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'core',
    name: 'Core System',
    description: 'Core system module with essential functionality',
    status: 'active' as ModuleStatus,
    is_core: true,
    priority: 0,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'admin',
    name: 'Administration',
    description: 'Administration module for system management',
    status: 'active' as ModuleStatus,
    is_core: true,
    is_admin: true,
    priority: 1,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'auth',
    name: 'Authentication',
    description: 'User authentication and authorization',
    status: 'active' as ModuleStatus,
    is_core: true,
    priority: 0,
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'user',
    name: 'User Management',
    description: 'User profiles and management',
    status: 'active' as ModuleStatus,
    is_core: true,
    priority: 2,
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'shop',
    name: 'Shop',
    description: 'E-commerce and shop functionality',
    status: 'active' as ModuleStatus,
    is_core: false,
    priority: 3,
  },
  {
    id: '6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'cart',
    name: 'Shopping Cart',
    description: 'Shopping cart functionality',
    status: 'active' as ModuleStatus,
    is_core: false,
    priority: 4,
  },
  {
    id: '7',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'menu',
    name: 'Menu System',
    description: 'Application menu system',
    status: 'active' as ModuleStatus,
    is_core: true,
    priority: 1,
  },
  {
    id: '8',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'clothes',
    name: 'Clothes Management',
    description: 'Clothing items management',
    status: 'active' as ModuleStatus,
    is_core: false,
    priority: 3,
  },
  {
    id: '9',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    code: 'notification',
    name: 'Notifications',
    description: 'User notifications system',
    status: 'active' as ModuleStatus,
    is_core: false,
    priority: 3,
  }
];

/**
 * Initialize core modules in the database
 * This is typically called during application bootstrap
 */
export const initializeModules = async (): Promise<AppModule[]> => {
  try {
    // Check if modules already exist
    const { data: existingModules, error: checkError } = await supabase
      .from('app_modules')
      .select('id')
      .limit(1);
      
    if (checkError) {
      throw checkError;
    }
    
    // If modules already exist, don't reinitialize
    if (existingModules && existingModules.length > 0) {
      console.log('Modules already initialized, skipping...');
      const { data } = await supabase.from('app_modules').select('*');
      return data as AppModule[];
    }
    
    console.log('Initializing core modules...');
    
    // Insert core modules
    const { data, error } = await supabase
      .from('app_modules')
      .insert(coreModules.map(module => ({
        ...module,
        status: module.status as ModuleStatus  // Explicitly cast to ensure type compatibility
      })))
      .select();
      
    if (error) {
      console.error('Error initializing modules:', error);
      throw error;
    }
    
    console.log('Core modules initialized successfully');
    return data as AppModule[];
  } catch (error) {
    console.error('Error in initializeModules:', error);
    return [];
  }
};

// Add export for any additional functions needed
export const reinitializeModules = async (): Promise<boolean> => {
  try {
    // Delete all existing modules first (use with caution!)
    const { error: deleteError } = await supabase
      .from('app_modules')
      .delete()
      .neq('id', '0');  // Safe guard to ensure we have a proper condition
      
    if (deleteError) {
      throw deleteError;
    }
    
    // Re-initialize modules
    await initializeModules();
    return true;
  } catch (error) {
    console.error('Error in reinitializeModules:', error);
    return false;
  }
};
