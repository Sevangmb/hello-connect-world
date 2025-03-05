
import { AppModule, ModuleStatus } from '../../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Vérifie si un module est actif de manière asynchrone
 */
export const isModuleActiveAsync = async (moduleCode: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();
    
    if (error) {
      console.error('Error checking module status:', error);
      return false;
    }
    
    return data?.status === 'active';
  } catch (err) {
    console.error('Error in isModuleActiveAsync:', err);
    return false;
  }
};

/**
 * Vérifie si un module est en mode dégradé de manière asynchrone
 */
export const isModuleDegradedAsync = async (moduleCode: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('app_modules')
      .select('status')
      .eq('code', moduleCode)
      .single();
    
    if (error) {
      console.error('Error checking module degraded status:', error);
      return false;
    }
    
    return data?.status === 'degraded';
  } catch (err) {
    console.error('Error in isModuleDegradedAsync:', err);
    return false;
  }
};

/**
 * Vérifie si une fonctionnalité est activée de manière asynchrone
 */
export const isFeatureEnabledAsync = async (
  moduleCode: string, 
  featureCode: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('module_features')
      .select('is_enabled')
      .eq('module_code', moduleCode)
      .eq('feature_code', featureCode)
      .single();
    
    if (error) {
      console.error('Error checking feature status:', error);
      return false;
    }
    
    return data?.is_enabled === true;
  } catch (err) {
    console.error('Error in isFeatureEnabledAsync:', err);
    return false;
  }
};
