
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UserCog,
  Package,
  Store,
  FileText,
  BarChart, 
  Mail,
  Settings,
  Shield,
  ChevronLeft
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdminStatus } from '@/hooks/menu/useAdminStatus';
import { eventBus } from '@/core/event-bus/EventBus';

interface AdminMenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
  children?: AdminMenuItem[];
}

interface AdminSidebarMenuProps {
  className?: string;
  onBack?: () => void;
}

export const AdminSidebarMenu: React.FC<AdminSidebarMenuProps> = ({
  className,
  onBack
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isUserAdmin, adminCheckComplete } = useAdminStatus();

  // Vérifier si l'utilisateur est sur une page d'administration
  const isAdminPage = currentPath.startsWith('/admin');
  
  // Structure des éléments du menu administratif
  const adminMenuItems: AdminMenuItem[] = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      description: 'Vue d\'ensemble'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      path: '/admin/users',
      icon: <UserCog className="h-4 w-4" />,
      description: 'Gestion des comptes',
      children: [
        {
          id: 'users-list',
          label: 'Liste des utilisateurs',
          path: '/admin/users/list',
          icon: <UserCog className="h-4 w-4" />
        },
        {
          id: 'user-roles',
          label: 'Rôles et permissions',
          path: '/admin/users/roles',
          icon: <Shield className="h-4 w-4" />
        }
      ]
    },
    {
      id: 'modules',
      label: 'Modules',
      path: '/admin/modules',
      icon: <Package className="h-4 w-4" />,
      description: 'Gestion des modules'
    },
    {
      id: 'shops',
      label: 'Boutiques',
      path: '/admin/shops',
      icon: <Store className="h-4 w-4" />,
      description: 'Gestion des boutiques'
    },
    {
      id: 'content',
      label: 'Contenu',
      path: '/admin/content',
      icon: <FileText className="h-4 w-4" />,
      description: 'Gestion du contenu'
    },
    {
      id: 'stats',
      label: 'Statistiques',
      path: '/admin/stats',
      icon: <BarChart className="h-4 w-4" />,
      description: 'Analyses et rapports'
    },
    {
      id: 'campaigns',
      label: 'Campagnes',
      path: '/admin/campaigns',
      icon: <Mail className="h-4 w-4" />,
      description: 'Marketing'
    },
    {
      id: 'settings',
      label: 'Configuration',
      path: '/admin/settings',
      icon: <Settings className="h-4 w-4" />,
      description: 'Paramètres système'
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    eventBus.publish('admin:navigation', {
      path,
      timestamp: Date.now()
    });
  };

  // Si l'utilisateur n'est pas admin, ne pas afficher le menu
  if (adminCheckComplete && !isUserAdmin) {
    return null;
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* En-tête du menu admin */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">Administration</h2>
        </div>
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            title="Retour à l'application"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <Separator className="my-2" />
      
      {/* Menu admin scrollable */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-2 space-y-1">
          {adminMenuItems.map((item) => (
            <React.Fragment key={item.id}>
              <Button
                variant={currentPath === item.path ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  currentPath === item.path ? "bg-primary/10" : ""
                )}
                onClick={() => handleNavigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
              
              {/* Sous-menu si le parent est actif */}
              {item.children && currentPath.startsWith(item.path) && (
                <div className="pl-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Button
                      key={child.id}
                      variant={currentPath === child.path ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start text-sm",
                        currentPath === child.path ? "bg-primary/10" : ""
                      )}
                      onClick={() => handleNavigate(child.path)}
                    >
                      {child.icon}
                      <span className="ml-2">{child.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
      
      {/* Pied de menu avec info */}
      <div className="px-4 py-2 text-xs text-muted-foreground">
        <p>Mode administrateur</p>
      </div>
    </div>
  );
};

export default AdminSidebarMenu;
