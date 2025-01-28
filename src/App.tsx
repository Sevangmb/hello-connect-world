import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ContentManagement } from "@/components/admin/ContentManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="content" element={<ContentManagement />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="shops" element={<ShopManagement />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
          {/* Add other existing routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
