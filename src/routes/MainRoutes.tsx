
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/RootLayout';
import App from '@/App';
import Auth from '@/pages/Auth';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';

const MainRoutes: React.FC = () => {
  console.log("MainRoutes: Rendu des routes principales");
  
  return (
    <Routes>
      {/* Routes d'authentification */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Routes principales avec RootLayout comme wrapper */}
      <Route element={<RootLayout />}>
        {/* App contient toutes les routes imbriquées */}
        <Route path="/*" element={<App />} />
      </Route>

      {/* Page 404 explicite pour les routes non gérées */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default MainRoutes;
