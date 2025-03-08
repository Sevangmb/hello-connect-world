
import React from "react";
import { cn } from "@/lib/utils";
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
  PuzzleIcon 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed?: boolean;
}

const NavItem = ({ icon, label, href, collapsed }: NavItemProps) => (
  <NavLink
    to={href}
    className={({ isActive }) =>
      cn(
        "flex items-center py-2 px-3 rounded-md group transition-colors",
        collapsed ? "justify-center" : "",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )
    }
  >
    <div className={cn("flex items-center", collapsed ? "mx-0" : "mr-2")}>
      {React.cloneElement(icon as React.ReactElement, {
        className: cn("h-5 w-5", collapsed ? "mx-0" : "mr-2"),
      })}
    </div>
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

interface AdminSidebarProps {
  collapsed?: boolean;
  className?: string;
}

export function NewAdminSidebar({ collapsed = false, className }: AdminSidebarProps) {
  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* En-tête du sidebar */}
      <div className={cn("px-4 py-3", collapsed ? "items-center justify-center" : "")}>
        <div className={cn("font-semibold", collapsed ? "sr-only" : "text-lg")}>
          Administration
        </div>
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            Gestion de la plateforme FRING!
          </div>
        )}
      </div>
      
      <Separator className="mb-2" />
      
      {/* Menu de navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          <NavItem 
            href="/admin/dashboard" 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/users" 
            icon={<Users />} 
            label="Utilisateurs" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/waitlist" 
            icon={<Users />} 
            label="Liste d'attente" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/content" 
            icon={<FileText />} 
            label="Contenu" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/modules" 
            icon={<PuzzleIcon />} 
            label="Modules" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/notifications" 
            icon={<Bell />} 
            label="Notifications" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/reports" 
            icon={<FileText />} 
            label="Rapports" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/payments" 
            icon={<CreditCard />} 
            label="Paiements" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/analytics" 
            icon={<BarChart3 />} 
            label="Analytiques" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/moderation" 
            icon={<Shield />} 
            label="Modération" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/settings" 
            icon={<Settings />} 
            label="Paramètres" 
            collapsed={collapsed} 
          />
          <NavItem 
            href="/admin/backups" 
            icon={<Database />} 
            label="Sauvegardes" 
            collapsed={collapsed} 
          />
        </div>
      </ScrollArea>
      
      {/* Pied du sidebar */}
      <div className="mt-auto px-4 py-3 border-t border-border">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "")}>
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            A
          </div>
          
          {!collapsed && (
            <div className="ml-3 truncate">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-muted-foreground">Administrateur</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
