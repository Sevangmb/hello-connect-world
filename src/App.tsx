import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import Boutiques from './pages/Boutiques';
import VirtualDressing from './pages/VirtualDressing';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import ContentManagement from './pages/admin/ContentManagement';
import SiteSettings from './pages/admin/SiteSettings';
import NotFound from './pages/NotFound';
import { AdminModules } from './pages/admin';
import { AdminNotifications } from './pages/admin';
import { AdminReports } from './pages/admin';
import { AdminPayments } from './pages/admin';
import { AdminAnalytics } from './pages/admin';
import { AdminModeration } from './pages/admin';
import { AdminBackups } from './pages/admin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="boutiques" element={<Boutiques />} />
          <Route path="virtual-dressing" element={<VirtualDressing />} />
          <Route path="login" element={<Login />} />
          
          {/* Routes protégées */}
          <Route element={<PrivateRoute />}>
            {/* Ajouter d'autres routes protégées ici */}
          </Route>
          
          {/* Routes d'administration */}
          <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="modules" element={<AdminModules />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="moderation" element={<AdminModeration />} />
            <Route path="backups" element={<AdminBackups />} />
          </Route>
          
          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
