
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  BarChart3,
  FileText,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Types pour les éléments de navigation
interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: NavSubItem[];
}

interface NavSubItem {
  label: string;
  path: string;
}

// Configuration des éléments de navigation
const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: Users,
    label: "Utilisateurs",
    path: "/admin/users",
    subItems: [
      { label: "Gestion", path: "/admin/users/manage" },
      { label: "Statistiques", path: "/admin/users/stats" },
    ]
  },
  {
    icon: Store,
    label: "Boutiques",
    path: "/admin/shops",
    subItems: [
      { label: "Gestion", path: "/admin/shops/manage" },
      { label: "Statistiques", path: "/admin/shops/stats" },
    ]
  },
  {
    icon: FileText,
    label: "Contenu",
    path: "/admin/content",
    subItems: [
      { label: "Défis", path: "/admin/content/challenges" },
      { label: "Groupes", path: "/admin/content/groups" },
      { label: "Modération", path: "/admin/content/moderation" },
    ]
  },
  {
    icon: ShoppingCart,
    label: "Marketplace",
    path: "/admin/marketplace",
    subItems: [
      { label: "Articles", path: "/admin/marketplace/items" },
      { label: "Transactions", path: "/admin/marketplace/transactions" },
      { label: "Statistiques", path: "/admin/marketplace/stats" },
    ]
  },
  {
    icon: Megaphone,
    label: "Marketing",
    path: "/admin/marketing",
    subItems: [
      { label: "Campagnes", path: "/admin/marketing/campaigns" },
      { label: "Newsletters", path: "/admin/marketing/newsletters" },
    ]
  },
  {
    icon: BarChart3,
    label: "Statistiques",
    path: "/admin/stats",
    subItems: [
      { label: "Générales", path: "/admin/stats/general" },
      { label: "Financières", path: "/admin/stats/financial" },
    ]
  },
  {
    icon: Settings,
    label: "Paramètres",
    path: "/admin/settings",
    subItems: [
      { label: "Administrateurs", path: "/admin/settings/admins" },
      { label: "Rôles", path: "/admin/settings/roles" },
      { label: "Configuration", path: "/admin/settings/config" },
    ]
  },
  {
    icon: BadgeCheck,
    label: "Modules",
    path: "/admin/modules",
  },
];

interface AdminNavigationProps {
  collapsed?: boolean;
  className?: string;
}

export function AdminNavigation({ collapsed = false, className }: AdminNavigationProps) {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  // Déterminer quelle section doit être développée au chargement initial
  React.useEffect(() => {
    // Trouver la section active basée sur le chemin actuel
    const activeSection = navItems.find(item => 
      location.pathname === item.path || 
      location.pathname.startsWith(`${item.path}/`)
    );
    
    if (activeSection) {
      setExpandedSection(activeSection.path);
    }
  }, [location.pathname]);

  // Toggle pour développer/replier une section
  const toggleSection = (path: string) => {
    if (collapsed) return;
    setExpandedSection(prev => prev === path ? null : path);
  };

  // Vérifier si un élément est actif
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Vérifier si une section est active
  const isSectionActive = (item: NavItem) => {
    return location.pathname === item.path || 
           location.pathname.startsWith(`${item.path}/`) ||
           (item.subItems?.some(subItem => location.pathname === subItem.path) ?? false);
  };

  return (
    <nav className={cn("py-2 overflow-y-auto flex-1", className)}>
      <ul className="space-y-1 px-2">
        {navItems.map((item) => {
          const active = isSectionActive(item);
          const expanded = expandedSection === item.path;
          
          return (
            <li key={item.path} className="select-none">
              {/* Élément principal */}
              {collapsed ? (
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-md",
                        "hover:bg-primary/10 transition-colors duration-200",
                        active && "bg-primary/10 text-primary",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleSection(item.path)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-md",
                    "hover:bg-primary/10 transition-colors duration-200",
                    active && "bg-primary/10 text-primary",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.subItems && item.subItems.length > 0 && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className={cn(
                        "transition-transform duration-200",
                        expanded ? "transform rotate-180" : ""
                      )}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>
              )}

              {/* Sous-éléments */}
              {!collapsed && item.subItems && item.subItems.length > 0 && expanded && (
                <ul className="mt-1 ml-8 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.path}>
                      <Link
                        to={subItem.path}
                        className={cn(
                          "block px-3 py-1.5 rounded-md text-sm",
                          "hover:bg-primary/5 transition-colors duration-200",
                          isActive(subItem.path) && "bg-primary/5 text-primary font-medium",
                        )}
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default AdminNavigation;
