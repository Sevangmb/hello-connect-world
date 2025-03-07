
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/components/RootLayout';
import App from '@/App';
import Auth from '@/pages/Auth';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';

const MainRoutes: React.FC = () => {
  console.log("MainRoutes: Rendu des routes principales");
  
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Routes principales avec RootLayout comme wrapper */}
      <Route element={<RootLayout />}>
        <Route path="/*" element={<App />} />
      </Route>

      {/* Page 404 explicite - redondante avec le /* dans App mais utile pour le débogage */}
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
