
import { Suspense, lazy } from 'react';
import { Routes } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Utiliser lazy loading pour les routes principales
const MainRoutes = lazy(() => import('./routes/MainRoutes'));

export default function App() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <Routes>
        <MainRoutes />
      </Routes>
    </Suspense>
  );
}
