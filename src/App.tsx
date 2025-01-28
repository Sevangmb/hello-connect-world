import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Admin } from "@/layouts/Admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}