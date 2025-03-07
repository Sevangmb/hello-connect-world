
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
        {/* Route par défaut qui redirige vers App */}
        <Route index element={<Navigate to="/" replace />} />
        
        {/* Routes contenues dans App */}
        <Route path="/*" element={<App />} />
      </Route>

      {/* Page 404 explicite pour les routes non gérées */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default MainRoutes;
