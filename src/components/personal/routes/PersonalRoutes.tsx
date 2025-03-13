
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { ModuleUnavailable } from '@/components/personal/ModuleUnavailable';

// Ajoutez les pages importées pour chaque section
const Wardrobe = React.lazy(() => import('@/pages/personal/Wardrobe'));
const Outfits = React.lazy(() => import('@/pages/personal/Outfits'));
const Suitcases = React.lazy(() => import('@/pages/personal/Suitcases'));
const Favorites = React.lazy(() => import('@/pages/personal/Favorites'));
const Profile = React.lazy(() => import('@/pages/personal/Profile'));

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
