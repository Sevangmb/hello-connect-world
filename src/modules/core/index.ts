/**
 * Module core - Point d'entrée unique
 * Exporte tous les services, hooks et utilitaires de base
 */

// Services d'authentification
export * from '@/core/auth/application/AuthService';
export * from '@/core/auth/domain/events';
export * from '@/core/auth/domain/interfaces/IAuthRepository';
export * from '@/core/auth/domain/types';
export * from '@/core/auth/infrastructure/authDependencyProvider';
export * from '@/core/auth/infrastructure/supabaseAuthRepository';

// Services de catalogue
export * from '@/core/catalog/application/CatalogService';
export * from '@/core/catalog/domain/events';
export * from '@/core/catalog/domain/interfaces/ICatalogRepository';
export * from '@/core/catalog/domain/types';
export * from '@/core/catalog/infrastructure/SupabaseCatalogRepository';
export * from '@/core/catalog/infrastructure/catalogDependencyProvider';

// Services de commandes
export * from '@/core/orders/application/OrderService';
export * from '@/core/orders/domain/events';
export * from '@/core/orders/domain/interfaces/IOrderRepository';
export * from '@/core/orders/domain/types';
export * from '@/core/orders/infrastructure/orderDependencyProvider';
export * from '@/core/orders/infrastructure/supabaseOrderRepository';

// Bus d'événements
export * from '@/core/event-bus/EventBus';
export * from '@/core/event-bus/events';
export * from '@/core/event-bus/middleware';

// Hooks de base
export * from '@/core/hooks/useStableInit';
export { useToast } from '@/hooks/use-toast';
export { useIsMobile } from '@/hooks/use-mobile';
export { useEventBus } from '@/hooks/useEventBus';
export { useImageUpload } from '@/hooks/useImageUpload';
export { useInvoiceGenerator } from '@/hooks/useInvoiceGenerator';
export { useLabelScanner } from '@/hooks/useLabelScanner';
export { useMetrics } from '@/hooks/useMetrics';
export { useAdminMetrics } from '@/hooks/useAdminMetrics';
