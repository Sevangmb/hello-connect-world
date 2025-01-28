import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import Feed from "./pages/Feed";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Profile/Settings";
import Personal from "./pages/Personal";
import Explore from "./pages/Explore";
import Community from "./pages/Community";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />

      <Route
        path="/personal"
        element={
          <PrivateRoute>
            <Personal />
          </PrivateRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <PrivateRoute>
            <Explore />
          </PrivateRoute>
        }
      />

      <Route
        path="/community"
        element={
          <PrivateRoute>
            <Community />
          </PrivateRoute>
        }
      />

      <Route
        path="/groups"
        element={
          <PrivateRoute>
            <Groups />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;