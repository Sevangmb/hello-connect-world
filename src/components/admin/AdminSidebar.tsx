
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  FileText,
  Bell,
  Database,
  BarChart3,
  Shield,
  CreditCard,
  PuzzleIcon,
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-2 rounded-lg ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    <span>{children}</span>
  </NavLink>
);

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Administration</h2>
        <nav className="space-y-2">
          <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={20} />}>
            Tableau de bord
          </SidebarLink>
          <SidebarLink to="/admin/users" icon={<Users size={20} />}>
            Utilisateurs
          </SidebarLink>
          <SidebarLink to="/admin/content" icon={<FileText size={20} />}>
            Gestion de contenu
          </SidebarLink>
          <SidebarLink to="/admin/modules" icon={<PuzzleIcon size={20} />}>
            Modules
          </SidebarLink>
          <SidebarLink to="/admin/notifications" icon={<Bell size={20} />}>
            Notifications
          </SidebarLink>
          <SidebarLink to="/admin/reports" icon={<FileText size={20} />}>
            Rapports
          </SidebarLink>
          <SidebarLink to="/admin/payments" icon={<CreditCard size={20} />}>
            Paiements
          </SidebarLink>
          <SidebarLink to="/admin/analytics" icon={<BarChart3 size={20} />}>
            Analytiques
          </SidebarLink>
          <SidebarLink to="/admin/moderation" icon={<Shield size={20} />}>
            Modération
          </SidebarLink>
          <SidebarLink to="/admin/settings" icon={<Settings size={20} />}>
            Paramètres
          </SidebarLink>
          <SidebarLink to="/admin/backups" icon={<Database size={20} />}>
            Sauvegardes
          </SidebarLink>
        </nav>
      </div>
    </aside>
  );
};
