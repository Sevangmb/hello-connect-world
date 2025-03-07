
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AppInitializer } from './components/AppInitializer';

// Configuration optimisée de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,              // Réduire les tentatives pour économiser des requêtes
      refetchOnWindowFocus: false, // Désactiver le rechargement auto lors du retour sur l'onglet
      staleTime: 5 * 60 * 1000,    // Données fraîches pendant 5 minutes au lieu de 2
      gcTime: 15 * 60 * 1000,      // Conserver en cache 15 minutes au lieu de 10
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Supprimer StrictMode en production pour éviter les doubles rendus
  process.env.NODE_ENV === 'production' ? (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInitializer>
          <App />
          <Toaster />
        </AppInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  ) : (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppInitializer>
            <App />
            <Toaster />
          </AppInitializer>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  ),
);
