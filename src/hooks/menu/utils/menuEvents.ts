
import { eventBus } from '@/core/event-bus/EventBus';
import { MODULE_MENU_EVENTS } from '@/services/coordination/ModuleMenuCoordinator';

type EventHandler = () => void;

/**
 * Subscribe to menu-related events
 */
export const subscribeToMenuEvents = (handler: EventHandler): (() => void) => {
  const unsubscribeMenuUpdated = eventBus.subscribe(
    MODULE_MENU_EVENTS.MENU_UPDATED, 
    handler
  );
  
  const unsubscribeModuleStatus = eventBus.subscribe(
    MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, 
    handler
  );
  
  const unsubscribeAdminAccess = eventBus.subscribe(
    MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, 
    handler
  );
  
  const unsubscribeAdminRevoked = eventBus.subscribe(
    MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, 
    handler
  );
  
  // Return a function that unsubscribes from all events
  return () => {
    unsubscribeMenuUpdated();
    unsubscribeModuleStatus();
    unsubscribeAdminAccess();
    unsubscribeAdminRevoked();
  };
};
