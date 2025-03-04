
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import { RootLayout } from '@/components/RootLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Routes
import { AdminRoute } from '@/components/auth/AdminRoute';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { PrelaunchRedirect } from '@/components/home/PrelaunchRedirect';

// Pages
import Home from '@/pages/Home';
import Landing from '@/pages/Landing';
import Waitlist from '@/pages/Waitlist';
import Auth from '@/pages/Auth';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminWaitlist from '@/pages/admin/AdminWaitlist';
import AdminContent from '@/pages/admin/AdminContent';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminShops from '@/pages/admin/AdminShops';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminStats from '@/pages/admin/AdminStats';
import AdminModules from '@/pages/admin/AdminModules';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminReports from '@/pages/admin/AdminReports';
import AdminApiKeys from '@/pages/admin/AdminApiKeys';
import AdminMarketplace from '@/pages/admin/AdminMarketplace';
import AdminMarketing from '@/pages/admin/AdminMarketing';
import AdminMenus from '@/pages/admin/AdminMenus';
import AdminBackups from '@/pages/admin/AdminBackups';
import AdminHelp from '@/pages/admin/AdminHelp';
import NotFound from '@/pages/NotFound';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PrelaunchRedirect>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<RootLayout />}>
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/app" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/app/*" element={<PrivateRoute><Home /></PrivateRoute>} />
            </Route>
            
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/waitlist" element={<AdminWaitlist />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/shops" element={<AdminShops />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/stats" element={<AdminStats />} />
              <Route path="/admin/modules" element={<AdminModules />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/api-keys" element={<AdminApiKeys />} />
              <Route path="/admin/marketplace" element={<AdminMarketplace />} />
              <Route path="/admin/marketing" element={<AdminMarketing />} />
              <Route path="/admin/menus" element={<AdminMenus />} />
              <Route path="/admin/backups" element={<AdminBackups />} />
              <Route path="/admin/help" element={<AdminHelp />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PrelaunchRedirect>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
