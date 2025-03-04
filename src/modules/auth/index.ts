
/**
 * Module d'authentification - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés à l'authentification
 */

// Hooks
export { useAuth } from './hooks/useAuth';
export { useProfile } from './hooks/useProfile';
export { useAdminStatus } from './hooks/useAdminStatus';

// Composants
export { PrivateRoute } from './components/PrivateRoute';
export { AdminRoute } from './components/AdminRoute';
export { AdminCheck } from './components/AdminCheck';
export { AuthStatus } from './components/AuthStatus';
export { UserButton } from './components/UserButton';
export { Login } from './components/Login';

// Pages
export { Auth } from './pages/Auth';
export { AdminLogin } from './pages/AdminLogin';

// Services et Core (généralement utilisés uniquement en interne)
export { getAuthService } from './services/authDependencyProvider';

// Types
export type { User, AuthError, AuthResult, SignUpMetadata } from './types';
