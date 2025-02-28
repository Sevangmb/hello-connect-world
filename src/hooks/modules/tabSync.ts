
/**
 * This module provides cross-tab synchronization for module statuses
 * using the BroadcastChannel API.
 */

import { AppModule, ModuleStatus } from "./types";
import { cacheModuleStatuses } from "./utils";
import { triggerModuleStatusChanged } from "./events";

// Type definitions for the messages
interface ModuleStatusSyncMessage {
  type: 'MODULE_STATUS_CHANGE';
  data: {
    moduleId: string;
    newStatus: ModuleStatus;
    timestamp: number;
  };
}

interface FeatureStatusSyncMessage {
  type: 'FEATURE_STATUS_CHANGE';
  data: {
    moduleCode: string;
    featureCode: string;
    isEnabled: boolean;
    timestamp: number;
  };
}

type SyncMessage = ModuleStatusSyncMessage | FeatureStatusSyncMessage;

// Create a broadcast channel for cross-tab communication
let broadcastChannel: BroadcastChannel | null = null;

/**
 * Initialize the broadcast channel for cross-tab synchronization
 */
export const initTabSync = () => {
  // Check if BroadcastChannel is supported by the browser
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      broadcastChannel = new BroadcastChannel('module_status_sync');
      
      // Listen for messages from other tabs
      broadcastChannel.onmessage = (event: MessageEvent<SyncMessage>) => {
        const message = event.data;
        
        console.log('Received sync message from another tab:', message);
        
        if (message.type === 'MODULE_STATUS_CHANGE') {
          // Trigger module status changed event to update UI
          triggerModuleStatusChanged();
        } else if (message.type === 'FEATURE_STATUS_CHANGE') {
          // Trigger feature status changed event to update UI
          triggerModuleStatusChanged();
        }
      };
      
      console.log('Tab synchronization initialized');
      return true;
    } catch (error) {
      console.error('Error initializing tab sync:', error);
      return false;
    }
  } else {
    console.warn('BroadcastChannel API not supported by this browser. Tab synchronization disabled.');
    return false;
  }
};

/**
 * Broadcast module status change to other tabs
 */
export const broadcastModuleStatusChange = (moduleId: string, newStatus: ModuleStatus) => {
  if (broadcastChannel) {
    const message: ModuleStatusSyncMessage = {
      type: 'MODULE_STATUS_CHANGE',
      data: {
        moduleId,
        newStatus,
        timestamp: Date.now()
      }
    };
    
    broadcastChannel.postMessage(message);
    console.log('Broadcasted module status change to other tabs:', message);
  }
};

/**
 * Broadcast feature status change to other tabs
 */
export const broadcastFeatureStatusChange = (moduleCode: string, featureCode: string, isEnabled: boolean) => {
  if (broadcastChannel) {
    const message: FeatureStatusSyncMessage = {
      type: 'FEATURE_STATUS_CHANGE',
      data: {
        moduleCode,
        featureCode,
        isEnabled,
        timestamp: Date.now()
      }
    };
    
    broadcastChannel.postMessage(message);
    console.log('Broadcasted feature status change to other tabs:', message);
  }
};

/**
 * Clean up the broadcast channel
 */
export const cleanupTabSync = () => {
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
    console.log('Tab synchronization cleaned up');
  }
};

/**
 * Update local cache from sync message
 */
export const updateLocalCacheFromSync = (modules: AppModule[], message: ModuleStatusSyncMessage) => {
  const updatedModules = modules.map(module => 
    module.id === message.data.moduleId 
      ? { ...module, status: message.data.newStatus } 
      : module
  );
  
  cacheModuleStatuses(updatedModules);
  return updatedModules;
};

