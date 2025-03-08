
import React from "react";
import { cn } from "@/lib/utils";
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
  collapsed?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center p-2 rounded-lg transition-colors",
        collapsed ? "justify-center" : "px-4 py-2",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-gray-700 hover:bg-gray-100"
      )
    }
  >
    <span className={collapsed ? "mr-0" : "mr-3"}>{icon}</span>
    {!collapsed && <span>{children}</span>}
  </NavLink>
);

interface AdminSidebarProps {
  collapsed?: boolean;
  className?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false, className }) => {
  return (
    <aside className={cn("bg-white h-full overflow-y-auto", className)}>
      <div className="p-4">
        {!collapsed && <div className="font-bold text-lg">Administration</div>}
        
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} collapsed={collapsed}>
                Dashboard
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/waitlist" icon={<Users size={20} />} collapsed={collapsed}>
                Liste d'attente
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/users" icon={<Users size={20} />} collapsed={collapsed}>
                Utilisateurs
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/content" icon={<FileText size={20} />} collapsed={collapsed}>
                Gestion de contenu
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/modules" icon={<PuzzleIcon size={20} />} collapsed={collapsed}>
                Modules
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/notifications" icon={<Bell size={20} />} collapsed={collapsed}>
                Notifications
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/reports" icon={<FileText size={20} />} collapsed={collapsed}>
                Rapports
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/payments" icon={<CreditCard size={20} />} collapsed={collapsed}>
                Paiements
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/analytics" icon={<BarChart3 size={20} />} collapsed={collapsed}>
                Analytiques
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/moderation" icon={<Shield size={20} />} collapsed={collapsed}>
                Modération
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/settings" icon={<Settings size={20} />} collapsed={collapsed}>
                Paramètres
              </SidebarLink>
            </li>
            
            <li>
              <SidebarLink to="/admin/backups" icon={<Database size={20} />} collapsed={collapsed}>
                Sauvegardes
              </SidebarLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};
