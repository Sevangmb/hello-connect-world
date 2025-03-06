
import { AppModule } from '../types';

// Define a module definition interface
export interface ModuleDefinition {
  code: string;
  name: string;
  description?: string;
  version: string;
  is_core: boolean;
  is_admin?: boolean;
  features: Array<{
    code: string;
    name: string;
    description?: string;
    enabledByDefault?: boolean;
  }>;
}

// Convert AppModule to ModuleDefinition format for type compatibility
export function convertAppModuleToDefinition(module: AppModule): ModuleDefinition {
  // Convert the Record<string, boolean> features to the array format
  const featuresArray = Object.entries(module.features || {}).map(([code, enabled]) => ({
    code,
    name: code, // We don't have a name in the Record format, so use code
    enabledByDefault: enabled
  }));

  return {
    code: module.code,
    name: module.name,
    description: module.description,
    version: module.version || '1.0.0',
    is_core: module.is_core,
    is_admin: module.is_admin,
    features: featuresArray
  };
}

// Module definitions
export const appModules: Record<string, ModuleDefinition> = {
  // Core modules
  CORE: {
    code: 'core',
    name: 'Core System',
    description: 'Core system functionality',
    version: '1.0.0',
    is_core: true,
    features: [
      {
        code: 'settings',
        name: 'Settings',
        description: 'System settings',
        enabledByDefault: true
      }
    ]
  },
  
  // Authentication module
  AUTH: {
    code: 'auth',
    name: 'Authentication',
    description: 'User authentication and management',
    version: '1.0.0',
    is_core: true,
    features: [
      {
        code: 'register',
        name: 'Registration',
        description: 'User registration',
        enabledByDefault: true
      },
      {
        code: 'login',
        name: 'Login',
        description: 'User login',
        enabledByDefault: true
      },
      {
        code: 'reset_password',
        name: 'Reset Password',
        description: 'Password reset functionality',
        enabledByDefault: true
      }
    ]
  },
  
  // Admin module
  ADMIN: {
    code: 'admin',
    name: 'Administration',
    description: 'Administration functionality',
    version: '1.0.0',
    is_core: true,
    is_admin: true,
    features: [
      {
        code: 'dashboard',
        name: 'Admin Dashboard',
        description: 'Admin dashboard',
        enabledByDefault: true
      },
      {
        code: 'user_management',
        name: 'User Management',
        description: 'User management',
        enabledByDefault: true
      },
      {
        code: 'module_management',
        name: 'Module Management',
        description: 'Module management',
        enabledByDefault: true
      }
    ]
  },
  
  // Shop module
  SHOP: convertAppModuleToDefinition({
    id: 'shop-module-id',
    code: 'shop',
    name: 'Shop',
    description: 'E-commerce functionality',
    status: 'active',
    is_core: false,
    version: '1.0.0',
    features: {
      'product_listing': true,
      'shopping_cart': true,
      'checkout': true,
      'reviews': true
    },
    created_at: '',
    updated_at: ''
  })
};
