
import { supabase } from '@/integrations/supabase/client';
import { eventBus } from '@/core/event-bus/EventBus';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { moduleInitialization } from '@/hooks/modules/hooks/moduleInitialization';
import { ModuleInitializationService } from '@/services/modules/ModuleInitializationService';

export const initializeApplication = async () => {
  try {
    console.log('Initializing application...');
    
    // Initialize module API gateway
    await moduleApiGateway.initialize();
    
    // Initialize auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN') {
        eventBus.publish('auth:signed_in', { session });
      } else if (event === 'SIGNED_OUT') {
        eventBus.publish('auth:signed_out', {});
      }
    });
    
    console.log('Application initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize application:', error);
    return false;
  }
};
