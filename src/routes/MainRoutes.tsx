
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RootLayout } from '@/components/RootLayout';
import App from '@/App';
import Auth from '@/pages/Auth';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';

const MainRoutes: React.FC = () => {
  console.log("MainRoutes: Rendu des routes principales");
  
  return (
    <Routes>
      {/* Routes d'authentification qui ne sont pas dans le layout principal */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Routes principales avec RootLayout comme wrapper */}
      <Route element={<RootLayout />}>
        {/* Route racine explicite pour Home */}
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        
        {/* App contient toutes les routes imbriquées de l'application */}
        <Route path="/*" element={<App />} />
      </Route>

      {/* Route 404 explicite */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
