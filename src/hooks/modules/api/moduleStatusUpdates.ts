
import { ModuleStatus } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { isAdminModule } from './moduleStatusCore';

/**
 * Met à jour le statut d'un module dans Supabase
 */
export const updateModuleStatusInDb = async (
  moduleId: string, 
  status: ModuleStatus, 
  isAdminModule: boolean
): Promise<boolean> => {
  // Bloquer la désactivation du module Admin
  if (isAdminModule && status !== 'active') {
    console.error("Le module Admin ne peut pas être désactivé");
    return false;
  }

  try {
    const { error } = await supabase
      .from('app_modules')
      .update({ 
        status: status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', moduleId);

    if (error) {
      console.error('Erreur lors de la mise à jour du statut du module:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Exception lors de la mise à jour du statut du module:', e);
    return false;
  }
};

/**
 * Met à jour le statut d'une fonctionnalité dans Supabase
 */
export const updateFeatureStatusInDb = async (
  moduleCode: string, 
  featureCode: string, 
  isEnabled: boolean,
  isAdminModule: boolean
): Promise<boolean> => {
  // Bloquer la désactivation des fonctionnalités du module Admin
  if (isAdminModule && !isEnabled) {
    console.error("Les fonctionnalités du module Admin ne peuvent pas être désactivées");
    return false;
  }

  try {
    const { error } = await supabase
      .from('module_features')
      .update({ 
        is_enabled: isEnabled, 
        updated_at: new Date().toISOString() 
      })
      .eq('module_code', moduleCode)
      .eq('feature_code', featureCode);

    if (error) {
      console.error('Erreur lors de la mise à jour du statut de la fonctionnalité:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Exception lors de la mise à jour du statut de la fonctionnalité:', e);
    return false;
  }
};
