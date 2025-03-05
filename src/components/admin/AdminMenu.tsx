
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, ShoppingBag, BarChart2, 
  FileText, Bell, Database, Tag, Key, AlertTriangle,
  Server, HelpCircle, Settings, Menu, 
  PackageOpen, CloudUpload, Clock, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMenu } from "@/hooks/useMenu";
import { useModules } from "@/hooks/useModules";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { cn } from "@/lib/utils";

// Types pour le menu admin
interface AdminMenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
  children?: AdminMenuItem[];
}

export const AdminMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isUserAdmin, refreshMenu } = useMenu();
  const { modules } = useModules();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "core": true,  // Section principale ouverte par défaut
  });

  useEffect(() => {
    if (isUserAdmin) {
      moduleMenuCoordinator.enableAdminAccess();
      refreshMenu();
    }
  }, [isUserAdmin, refreshMenu]);

  // Vérifier si un chemin est actif
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Structurer les éléments du menu par sections
  const adminMenuSections: Record<string, AdminMenuItem[]> = {
    "core": [
      { name: "Tableau de bord", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
      { name: "Statistiques", path: "/admin/stats", icon: <BarChart2 className="h-5 w-5 mr-3" /> },
      { name: "Utilisateurs", path: "/admin/users", icon: <Users className="h-5 w-5 mr-3" /> },
    ],
    "contenu": [
      { name: "Gestion du contenu", path: "/admin/content", icon: <FileText className="h-5 w-5 mr-3" /> },
      { name: "Liste d'attente", path: "/admin/waitlist", icon: <Clock className="h-5 w-5 mr-3" /> },
    ],
    "boutique": [
      { name: "Commandes", path: "/admin/orders", icon: <ShoppingBag className="h-5 w-5 mr-3" /> },
      { name: "Boutiques", path: "/admin/shops", icon: <PackageOpen className="h-5 w-5 mr-3" /> },
      { name: "Marketplace", path: "/admin/marketplace", icon: <Tag className="h-5 w-5 mr-3" /> },
    ],
    "système": [
      { name: "Paramètres", path: "/admin/settings", icon: <Settings className="h-5 w-5 mr-3" /> },
      { name: "Modules", path: "/admin/modules", icon: <Server className="h-5 w-5 mr-3" /> },
      { name: "Notifications", path: "/admin/notifications", icon: <Bell className="h-5 w-5 mr-3" /> },
      { name: "Menus", path: "/admin/menus", icon: <Menu className="h-5 w-5 mr-3" /> },
    ],
    "outils": [
      { name: "API Keys", path: "/admin/api-keys", icon: <Key className="h-5 w-5 mr-3" /> },
      { name: "Base de données", path: "/admin/database", icon: <Database className="h-5 w-5 mr-3" /> },
      { name: "Backups", path: "/admin/backups", icon: <CloudUpload className="h-5 w-5 mr-3" /> },
      { name: "Rapports", path: "/admin/reports", icon: <AlertTriangle className="h-5 w-5 mr-3" /> },
    ],
    "aide": [
      { name: "Aide", path: "/admin/help", icon: <HelpCircle className="h-5 w-5 mr-3" /> },
    ]
  };

  // Traduire les noms de sections
  const sectionNames: Record<string, string> = {
    "core": "Principales",
    "contenu": "Contenu",
    "boutique": "Boutique",
    "système": "Système",
    "outils": "Outils avancés",
    "aide": "Support"
  };

  // Créer une liste de tous les éléments de menu pour la recherche 
  const allMenuItems = Object.values(adminMenuSections).flat();

  // Basculer l'ouverture d'une section
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Vérifier si une section contient un élément actif
  const sectionHasActiveItem = (items: AdminMenuItem[]) => {
    return items.some(item => isActive(item.path));
  };

  // Ouvrir automatiquement la section qui contient le chemin actif
  useEffect(() => {
    Object.entries(adminMenuSections).forEach(([section, items]) => {
      if (sectionHasActiveItem(items)) {
        setOpenSections(prev => ({
          ...prev,
          [section]: true
        }));
      }
    });
  }, [location.pathname]);

  // Navigation sécurisée qui gère mieux les redirections
  const handleNavigate = (path: string) => {
    console.log("Navigation vers:", path);
    navigate(path);
  };

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
        <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">
          Administration
        </h2>
        
        {Object.entries(adminMenuSections).map(([section, items]) => (
          <Collapsible
            key={section}
            open={openSections[section]}
            onOpenChange={() => toggleSection(section)}
            className="mb-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start font-medium border-l-2 pl-3",
                  sectionHasActiveItem(items) 
                    ? "border-l-primary text-primary" 
                    : "border-l-transparent"
                )}
              >
                <Layers className="h-4 w-4 mr-2" />
                {sectionNames[section]}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-1 mt-1 ml-2 pl-2 border-l">
                {items.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
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
            </CollapsibleContent>
          </Collapsible>
        ))}
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
