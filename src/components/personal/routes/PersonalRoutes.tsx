
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { ModuleUnavailable } from '@/components/personal/ModuleUnavailable';

// Utiliser les pages existantes au lieu des imports incorrects
const Wardrobe = React.lazy(() => import('@/pages/Wardrobe'));
const Outfits = React.lazy(() => import('@/pages/Outfits'));
const Suitcases = React.lazy(() => import('@/pages/Suitcases'));
const Favorites = React.lazy(() => import('@/pages/Favorites'));
const Profile = React.lazy(() => import('@/pages/Profile'));

const PersonalRoutes = () => {
  return (
    <Routes>
      <Route
        path="wardrobe"
        element={
          <ModuleGuard moduleCode="wardrobe" fallback={<ModuleUnavailable name="Garde-robe" />}>
            <Wardrobe />
          </ModuleGuard>
        }
      />
      <Route
        path="outfits"
        element={
          <ModuleGuard moduleCode="outfits" fallback={<ModuleUnavailable name="Tenues" />}>
            <Outfits />
          </ModuleGuard>
        }
      />
      <Route
        path="suitcases"
        element={
          <ModuleGuard moduleCode="suitcases" fallback={<ModuleUnavailable name="Valises" />}>
            <Suitcases />
          </ModuleGuard>
        }
      />
      <Route
        path="favorites"
        element={
          <ModuleGuard moduleCode="favorites" fallback={<ModuleUnavailable name="Favoris" />}>
            <Favorites />
          </ModuleGuard>
        }
      />
      <Route
        path="profile"
        element={
          <ModuleGuard moduleCode="profile" fallback={<ModuleUnavailable name="Profil" />}>
            <Profile />
          </ModuleGuard>
        }
      />
    </Routes>
  );
};

export default PersonalRoutes;
