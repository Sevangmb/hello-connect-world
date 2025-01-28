import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { SiteSettings } from "@/components/admin/SiteSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="content" element={<ContentManagement />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;