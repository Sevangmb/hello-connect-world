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

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r h-screen overflow-y-auto">
      <div className="p-4">
        <div className="font-bold text-lg">Administration</div>
        
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin" 
                end
                className={({ isActive }) => 
                  isActive 
                    ? "flex items-center bg-gray-100 text-gray-900 px-4 py-2 rounded-md font-medium" 
                    : "flex items-center text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md"
                }
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/admin/waitlist"
                className={({ isActive }) => 
                  isActive 
                    ? "flex items-center bg-gray-100 text-gray-900 px-4 py-2 rounded-md font-medium" 
                    : "flex items-center text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-md"
                }
              >
                <Users className="h-5 w-5 mr-3" />
                Liste d'attente
              </NavLink>
            </li>
            
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
          </ul>
        </nav>
      </div>
    </aside>
  );
};
