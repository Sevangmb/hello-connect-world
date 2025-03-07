
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/components/RootLayout';
import App from '@/App';
import Auth from '@/pages/Auth';
import AdminLogin from '@/pages/AdminLogin';

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
    </Routes>
  );
};

export default MainRoutes;
