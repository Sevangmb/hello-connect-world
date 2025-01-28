import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Admin } from "@/layouts/Admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UsersManagement } from "@/components/admin/UsersManagement";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}