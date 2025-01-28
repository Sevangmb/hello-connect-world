import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Admin } from "@/layouts/Admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { AuthLayout } from "@/layouts/Auth";
import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { ResetPassword } from "@/components/auth/ResetPassword";
import { MainLayout } from "@/layouts/Main";
import { Home } from "@/components/home/Home";
import { Profile } from "@/components/profile/Profile";
import { Settings } from "@/components/settings/Settings";
import { NotFound } from "@/components/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}