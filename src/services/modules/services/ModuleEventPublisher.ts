
export class ModuleEventPublisher {
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.listeners.set('moduleStatusChanged', []);
    this.listeners.set('featureStatusChanged', []);
  }

  subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback);
    
    return () => {
      const eventListeners = this.listeners.get(event) || [];
      const index = eventListeners.indexOf(callback);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    };
  }

  publishModuleStatusChanged(moduleId: string, status: string): void {
    const listeners = this.listeners.get('moduleStatusChanged') || [];
    listeners.forEach(callback => callback(moduleId, status));
  }

  publishFeatureStatusChanged(moduleCode: string, featureCode: string, isEnabled: boolean): void {
    const listeners = this.listeners.get('featureStatusChanged') || [];
    listeners.forEach(callback => callback(moduleCode, featureCode, isEnabled));
  }
}

export const moduleEventPublisher = new ModuleEventPublisher();
