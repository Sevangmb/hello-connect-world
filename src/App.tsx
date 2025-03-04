import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import Landing from './pages/Landing';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminShops from './pages/admin/AdminShops';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMarketplace from './pages/admin/AdminMarketplace';
import AdminContent from './pages/admin/AdminContent';
import AdminStats from './pages/admin/AdminStats';
import AdminMarketing from './pages/admin/AdminMarketing';
import AdminModules from './pages/admin/AdminModules';
import AdminSettings from './pages/admin/AdminSettings';
import AdminHelp from './pages/admin/AdminHelp';
import AdminReports from './pages/admin/AdminReports';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminModeration from './pages/admin/AdminModeration';
import AdminApiKeys from './pages/admin/AdminApiKeys';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminBackup from './pages/admin/AdminBackup';
import { AdminWaitlist } from "./pages/admin";
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { PrelaunchRedirect } from './components/auth/PrelaunchRedirect';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PrelaunchRedirect>
            <Routes>
              <Route path="/landing" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/login" element={<Auth />} />
              <Route path="/auth/admin" element={<AdminLogin />} />
              
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Index />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="shops" element={<AdminShops />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="marketplace" element={<AdminMarketplace />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="stats" element={<AdminStats />} />
                <Route path="marketing" element={<AdminMarketing />} />
                <Route path="modules" element={<AdminModules />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="help" element={<AdminHelp />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="moderation" element={<AdminModeration />} />
                <Route path="api-keys" element={<AdminApiKeys />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="backup" element={<AdminBackup />} />
                <Route path="waitlist" element={<AdminWaitlist />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PrelaunchRedirect>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </div>
  );
}

export default App;
