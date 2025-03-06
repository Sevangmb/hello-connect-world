import { lazy } from 'react';
import { useModules } from '@/hooks/modules/useModules';

// Définir les types
export interface ModulePage {
  path: string; 
  component: any; // Lazy component
  exact?: boolean;
  moduleCode: string;
  adminRequired?: boolean;
  auth?: boolean;
}

// Lazy loading des pages
const Home = lazy(() => import('@/pages/Home'));
const Clothes = lazy(() => import('@/pages/Clothes'));
const Outfits = lazy(() => import('@/pages/Outfits'));
const CreateOutfit = lazy(() => import('@/pages/Outfits'));

// Fonctions utilitaires
const isModuleActive = (moduleCode: string, modules: any[]): boolean => {
  const module = modules.find(m => m.code === moduleCode);
  return module?.status === 'active';
};

// Liste des pages de modules
export const getModulePages = (): ModulePage[] => {
  const { modules, isModuleActive } = useModules();
  
  const modulePages: ModulePage[] = [
    {
      path: '/',
      component: Home,
      exact: true,
      moduleCode: 'home'
    },
    {
      path: '/clothes',
      component: Clothes,
      exact: true,
      moduleCode: 'clothes',
      auth: true
    },
  
    // Pages pour le module de tenues
    {
      path: '/outfits',
      component: Outfits,
      exact: true,
      moduleCode: 'outfits',
      auth: true
    },
    {
      path: '/outfits/create',
      component: CreateOutfit,
      exact: true,
      moduleCode: 'outfits',
      auth: true
    },
    {
      path: '/outfits/:id',
      component: lazy(() => import('@/pages/OutfitDetail')),
      exact: true,
      moduleCode: 'outfits',
      auth: true
    },
    {
      path: '/outfits/edit/:id',
      component: lazy(() => import('@/pages/EditOutfit')),
      exact: true,
      moduleCode: 'outfits',
      auth: true
    },
  ];
  
  // Filtrer les pages des modules actifs
  return modulePages.filter(page => {
    // Pour les modules d'administration, toujours les inclure 
    // (ils seront protégés par AdminRoute)
    if (page.adminRequired) {
      return true;
    }
    
    // Pour les autres modules, ne les inclure que s'ils sont actifs
    return modules.some(m => m.code === page.moduleCode && m.status === 'active');
  });
};
