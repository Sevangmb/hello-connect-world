
import { supabase } from "@/integrations/supabase/client";
import { AppModule, ModuleStatus } from "./types";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for initializing and managing app modules
 */
export class ModuleInitializer {
  /**
   * Initializes core modules if they don't exist
   */
  async initCoreModules(): Promise<void> {
    try {
      // Check if any modules exist
      const { count, error } = await supabase
        .from('app_modules')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error("Error checking modules:", error);
        return;
      }

      // If modules already exist, skip initialization
      if (count && count > 0) {
        console.log("Modules already initialized, skipping...");
        return;
      }

      // Get current timestamp
      const now = new Date().toISOString();

      // Define core modules
      const coreModules: AppModule[] = [
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "core",
          name: "Core",
          description: "Core application functionality",
          status: "active" as ModuleStatus,
          is_core: true,
          priority: 100
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "ui",
          name: "User Interface",
          description: "UI components and layout system",
          status: "active" as ModuleStatus,
          is_core: true,
          priority: 90
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "auth",
          name: "Authentication",
          description: "User authentication and authorization",
          status: "active" as ModuleStatus,
          is_core: true,
          priority: 95
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "menu",
          name: "Navigation Menu",
          description: "Application navigation system",
          status: "active" as ModuleStatus,
          is_core: true,
          priority: 85
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "admin",
          name: "Administration",
          description: "Admin panel and management tools",
          status: "active" as ModuleStatus,
          is_core: true,
          is_admin: true,
          priority: 50
        }
      ];

      // Define feature modules
      const featureModules: AppModule[] = [
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "clothes",
          name: "Clothes Management",
          description: "Manage clothing items",
          status: "active" as ModuleStatus,
          is_core: false,
          priority: 80
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "outfits",
          name: "Outfits",
          description: "Create and manage outfits",
          status: "active" as ModuleStatus,
          is_core: false,
          priority: 75
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "suitcases",
          name: "Suitcases",
          description: "Pack and organize suitcases",
          status: "active" as ModuleStatus,
          is_core: false,
          priority: 70
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "social",
          name: "Social Features",
          description: "Social interactions and sharing",
          status: "active" as ModuleStatus,
          is_core: false,
          priority: 65
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "challenges",
          name: "Challenges",
          description: "Fashion challenges and contests",
          status: "active" as ModuleStatus,
          is_core: false,
          priority: 60
        },
        {
          id: uuidv4(),
          created_at: now,
          updated_at: now,
          code: "marketplace",
          name: "Marketplace",
          description: "Buy and sell fashion items",
          status: "active" as ModuleStatus,
          is_core: false,
          priority: 55
        }
      ];

      // Combine core and feature modules
      const allModules = [...coreModules, ...featureModules];

      // Insert modules one by one to ensure proper type safety
      for (const module of allModules) {
        const { error } = await supabase
          .from('app_modules')
          .insert(module);
          
        if (error) {
          console.error(`Error inserting module ${module.code}:`, error);
        }
      }

      console.log("Core modules initialized successfully");
    } catch (error) {
      console.error("Error initializing core modules:", error);
    }
  }
}

export const moduleInitializer = new ModuleInitializer();
