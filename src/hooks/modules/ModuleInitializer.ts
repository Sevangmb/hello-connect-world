
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Modules principaux de l'application
const CORE_MODULES = [
  {
    code: "core",
    name: "Core",
    description: "Fonctionnalités de base de l'application",
    status: "active",
    is_core: true,
    priority: 100
  },
  {
    code: "admin",
    name: "Administration",
    description: "Module d'administration de l'application",
    status: "active",
    is_core: true,
    is_admin: true,
    priority: 90
  },
  {
    code: "social",
    name: "Social",
    description: "Fonctionnalités sociales (défis, amis, messages)",
    status: "active",
    is_core: false,
    priority: 80
  },
  {
    code: "wardrobe",
    name: "Garde-robe",
    description: "Gestion des tenues et valises",
    status: "active",
    is_core: false,
    priority: 70
  },
  {
    code: "shop",
    name: "Boutiques",
    description: "Marketplace et boutiques de vêtements",
    status: "active",
    is_core: false,
    priority: 60
  }
];

// Fonctionnalités des modules
const MODULE_FEATURES = [
  // Core features
  {
    module_code: "core",
    feature_code: "profile",
    feature_name: "Profil utilisateur",
    is_enabled: true
  },
  {
    module_code: "core",
    feature_code: "settings",
    feature_name: "Paramètres",
    is_enabled: true
  },
  
  // Social features
  {
    module_code: "social",
    feature_code: "challenges",
    feature_name: "Défis",
    is_enabled: true
  },
  {
    module_code: "social",
    feature_code: "friends",
    feature_name: "Amis",
    is_enabled: true
  },
  {
    module_code: "social",
    feature_code: "messages",
    feature_name: "Messages",
    is_enabled: true
  },
  {
    module_code: "social",
    feature_code: "notifications",
    feature_name: "Notifications",
    is_enabled: true
  },
  
  // Wardrobe features
  {
    module_code: "wardrobe",
    feature_code: "outfits",
    feature_name: "Tenues",
    is_enabled: true
  },
  {
    module_code: "wardrobe",
    feature_code: "suitcases",
    feature_name: "Valises",
    is_enabled: true
  },
  
  // Shop features
  {
    module_code: "shop",
    feature_code: "marketplace",
    feature_name: "Marketplace",
    is_enabled: true
  },
  {
    module_code: "shop",
    feature_code: "cart",
    feature_name: "Panier",
    is_enabled: true
  },
  
  // Admin features
  {
    module_code: "admin",
    feature_code: "dashboard",
    feature_name: "Tableau de bord",
    is_enabled: true
  },
  {
    module_code: "admin",
    feature_code: "modules_management",
    feature_name: "Gestion des modules",
    is_enabled: true
  }
];

// Dépendances entre modules
const MODULE_DEPENDENCIES = [
  {
    module_code: "social",
    dependency_code: "core",
    is_required: true
  },
  {
    module_code: "wardrobe",
    dependency_code: "core",
    is_required: true
  },
  {
    module_code: "shop",
    dependency_code: "core",
    is_required: true
  },
  {
    module_code: "admin",
    dependency_code: "core",
    is_required: true
  }
];

export const initializeModules = async () => {
  try {
    // Vérifier si les modules existent déjà
    const { count, error: countError } = await supabase
      .from("app_modules")
      .select("*", { count: "exact" });
      
    if (countError) throw countError;
    
    // Si des modules existent déjà, ne pas réinitialiser
    if (count && count > 0) {
      console.log("Modules already exist, skipping initialization");
      return;
    }
    
    // 1. Insérer les modules de base
    const modulesWithIds = CORE_MODULES.map(module => ({
      ...module,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    const { error: modulesError } = await supabase
      .from("app_modules")
      .insert(modulesWithIds);
      
    if (modulesError) throw modulesError;
    
    // 2. Insérer les fonctionnalités
    const { error: featuresError } = await supabase
      .from("module_features")
      .insert(MODULE_FEATURES.map(feature => ({
        ...feature,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));
      
    if (featuresError) throw featuresError;
    
    // 3. Insérer les dépendances
    // D'abord récupérer les IDs des modules
    const { data: modules, error: modulesDataError } = await supabase
      .from("app_modules")
      .select("id, code, name, status");
      
    if (modulesDataError) throw modulesDataError;
    
    // Créer les dépendances avec les IDs corrects
    const dependencies = [];
    for (const dep of MODULE_DEPENDENCIES) {
      const moduleData = modules.find(m => m.code === dep.module_code);
      const dependencyData = modules.find(m => m.code === dep.dependency_code);
      
      if (moduleData && dependencyData) {
        dependencies.push({
          id: uuidv4(),
          module_id: moduleData.id,
          module_code: moduleData.code,
          module_name: moduleData.name,
          module_status: moduleData.status,
          dependency_id: dependencyData.id,
          dependency_code: dependencyData.code,
          dependency_name: dependencyData.name,
          dependency_status: dependencyData.status,
          is_required: dep.is_required,
          created_at: new Date().toISOString()
        });
      }
    }
    
    if (dependencies.length > 0) {
      const { error: dependenciesError } = await supabase
        .from("module_dependencies")
        .insert(dependencies);
        
      if (dependenciesError) throw dependenciesError;
    }
    
    console.log("Modules, features and dependencies initialized successfully");
  } catch (error) {
    console.error("Error initializing modules:", error);
  }
};
