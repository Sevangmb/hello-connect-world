import { Routes, Route } from "react-router-dom";
import Feed from "@/pages/Feed";
import Messages from "@/pages/Messages";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Friends from "@/pages/Friends";
import Groups from "@/pages/Groups";
import Notifications from "@/pages/Notifications";
import Challenges from "@/pages/Challenges";
import Challenge from "@/pages/Challenge";
import Admin from "@/pages/Admin";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/challenge/:id" element={<Challenge />} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    </Routes>
  );
}