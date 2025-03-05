import { EventBus as EventBusClient } from '@/integrations/event-bus/client';
import { ModuleInitializationService } from '@/services/modules/ModuleInitializationService';
import { getAuthService } from '@/services/auth/infrastructure/authServiceProvider';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { getSettingsService } from '@/services/settings/infrastructure/settingsServiceProvider';

// Mock implementation of EventBus for compatibility
export class EventBus {
  initialize(): Promise<boolean> {
    // Implementation
    return Promise.resolve(true);
  }
  
  on(event: string, callback: Function): void {
    console.log(`Subscribed to event: ${event}`);
  }

  off(event: string, callback: Function): void {
      console.log(`Unsubscribed from event: ${event}`);
  }

  emit(event: string, ...args: any[]): void {
      console.log(`Emitting event: ${event} with args:`, args);
  }
}

export const initializeApp = async () => {
  try {
    // Initialize EventBus
    const eventBus = new EventBus();
    await eventBus.initialize();

    // Initialize Module system
    const moduleInitializationService = new ModuleInitializationService();
    await moduleInitializationService.initializeModules();

    // Initialize Auth system
    const authService = getAuthService();
    await authService.initialize();
    
    // Initialize Menu system
    const menuService = getMenuService();
    await menuService.getAdminMenuItems();

    // Initialize Settings system
    const settingsService = getSettingsService();
    await settingsService.initialize();

    console.log('App initialization completed successfully.');
    return true;
  } catch (error) {
    console.error('App initialization failed:', error);
    return false;
  }
};
