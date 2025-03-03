
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Settings, Users, ShoppingBag, BarChart2, 
  FileText, Bell, Database, Tag, Key, AlertTriangle,
  Server, HelpCircle, LayoutDashboard, Menu, 
  PackageOpen, CloudUpload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMenu } from "@/hooks/useMenu";
import { useModules } from "@/hooks/useModules";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { cn } from "@/lib/utils";

export const AdminMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isUserAdmin, refreshMenu } = useMenu();
  const { modules } = useModules();

  useEffect(() => {
    if (isUserAdmin) {
      moduleMenuCoordinator.enableAdminAccess();
      refreshMenu();
    }
  }, [isUserAdmin, refreshMenu]);

  // Check if a route is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Admin menu items with icons and routes
  const adminMenuItems = [
    { name: "Tableau de bord", path: "/admin", icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
    { name: "Statistiques", path: "/admin/stats", icon: <BarChart2 className="h-5 w-5 mr-3" /> },
    { name: "Utilisateurs", path: "/admin/users", icon: <Users className="h-5 w-5 mr-3" /> },
    { name: "Commandes", path: "/admin/orders", icon: <ShoppingBag className="h-5 w-5 mr-3" /> },
    { name: "Contenu", path: "/admin/content", icon: <FileText className="h-5 w-5 mr-3" /> },
    { name: "Paramètres", path: "/admin/settings", icon: <Settings className="h-5 w-5 mr-3" /> },
    { name: "Modules", path: "/admin/modules", icon: <Server className="h-5 w-5 mr-3" /> },
    { name: "Boutiques", path: "/admin/shops", icon: <PackageOpen className="h-5 w-5 mr-3" /> },
    { name: "Notifications", path: "/admin/notifications", icon: <Bell className="h-5 w-5 mr-3" /> },
    { name: "Rapports", path: "/admin/reports", icon: <AlertTriangle className="h-5 w-5 mr-3" /> },
    { name: "API Keys", path: "/admin/api-keys", icon: <Key className="h-5 w-5 mr-3" /> },
    { name: "Marketplace", path: "/admin/marketplace", icon: <Tag className="h-5 w-5 mr-3" /> },
    { name: "Marketing", path: "/admin/marketing", icon: <Menu className="h-5 w-5 mr-3" /> },
    { name: "Menus", path: "/admin/menus", icon: <Menu className="h-5 w-5 mr-3" /> },
    { name: "Backups", path: "/admin/backups", icon: <CloudUpload className="h-5 w-5 mr-3" /> },
    { name: "Base de données", path: "/admin/database", icon: <Database className="h-5 w-5 mr-3" /> },
    { name: "Aide", path: "/admin/help", icon: <HelpCircle className="h-5 w-5 mr-3" /> },
  ];

  if (!isUserAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Accès administrateur requis</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-6rem)] py-2">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Administration
        </h2>
        <div className="space-y-1">
          {adminMenuItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive(item.path)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="bg-muted/40 p-4 mx-3 my-2 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Statut du système</h3>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs text-muted-foreground">Tous les services actifs</span>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AdminMenu;
