
/**
 * Service d'initialisation principale de l'application
 * Coordonne le chargement de tous les services nécessaires au démarrage
 */

import { eventBus } from '@/core/event-bus/EventBus';
import { moduleInitializationService } from '@/services/modules/ModuleInitializationService';
import { supabase } from '@/integrations/supabase/client';

export class AppInitializer {
  static async initialize(): Promise<boolean> {
    console.log('🚀 Initialisation de l\'application...');
    const startTime = performance.now();
    
    try {
      // Initialiser la connexion à Supabase
      await this.initializeSupabase();
      
      // Initialiser le système de modules
      await this.initializeModules();
      
      // Mesurer le temps total d'initialisation
      const endTime = performance.now();
      console.log(`✅ Application initialisée en ${Math.round(endTime - startTime)}ms`);
      
      // Publier un événement de fin d'initialisation
      eventBus.publish('app:initialized', {
        timestamp: Date.now(),
        duration: Math.round(endTime - startTime)
      });
      
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'application:', error);
      
      // Publier un événement d'erreur
      eventBus.publish('app:initialization:error', {
        error,
        timestamp: Date.now()
      });
      
      return false;
    }
  }
  
  private static async initializeSupabase(): Promise<void> {
    console.log('📦 Initialisation de la connexion Supabase...');
    
    try {
      // Vérifier la connexion à Supabase
      const { data, error } = await supabase.from('app_modules').select('count', { count: 'exact', head: true });
      
      if (error) {
        throw new Error(`Erreur de connexion à Supabase: ${error.message}`);
      }
      
      console.log('✅ Connexion Supabase établie');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de Supabase:', error);
      throw error;
    }
  }
  
  private static async initializeModules(): Promise<void> {
    console.log('📦 Initialisation des modules...');
    
    try {
      // Initialiser le système de modules
      const success = await moduleInitializationService.initialize();
      
      if (!success) {
        throw new Error('Échec de l\'initialisation des modules');
      }
      
      console.log('✅ Modules initialisés');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation des modules:', error);
      throw error;
    }
  }
}
