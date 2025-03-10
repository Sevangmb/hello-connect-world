
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@/components/UserButton";
import { cn } from "@/lib/utils";
import { X, Menu, Shield } from 'lucide-react';
import { useAdminStatus } from '@/hooks/menu/useAdminStatus';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useMainMenuItems } from '@/hooks/menu/useMainMenuItems';
import { MenuItem, VerticalMenu } from './MenuItems';

interface AdminMenuSectionProps {
  isExpanded?: boolean;
  currentPath: string;
  handleNavigate: (path: string) => void;
}

const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ 
  isExpanded = false,
  currentPath,
  handleNavigate
}) => {
  const [isOpen, setIsOpen] = useState(isExpanded);
  
  const adminItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
      active: currentPath === "/admin/dashboard"
    },
    {
      id: "users",
      label: "Utilisateurs",
      path: "/admin/users",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
      active: currentPath.startsWith("/admin/users")
    },
    {
      id: "shops",
      label: "Boutiques",
      path: "/admin/shops",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>,
      active: currentPath.startsWith("/admin/shops")
    },
    {
      id: "modules",
      label: "Modules",
      path: "/admin/modules",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></svg>,
      active: currentPath.startsWith("/admin/modules")
    },
    {
      id: "content",
      label: "Contenu",
      path: "/admin/content",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>,
      active: currentPath.startsWith("/admin/content")
    },
    {
      id: "stats",
      label: "Statistiques",
      path: "/admin/stats",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
      active: currentPath.startsWith("/admin/stats")
    },
    {
      id: "campaigns",
      label: "Campagnes",
      path: "/admin/campaigns",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="4" y="5" rx="2" /><path d="m22 5-10.5 7L1 5" /></svg>,
      active: currentPath.startsWith("/admin/campaigns")
    },
    {
      id: "settings",
      label: "Configuration",
      path: "/admin/settings",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
      active: currentPath.startsWith("/admin/settings")
    }
  ];

  return (
    <>
      <Separator className="my-4" />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between items-center text-left mb-1"
          >
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span className="font-semibold">Administration</span>
            </div>
            <Menu className={cn(
              "h-4 w-4 transition-transform", 
              isOpen ? "rotate-90" : "rotate-0"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pl-2 flex flex-col gap-1 mt-1">
            {adminItems.map((item) => (
              <MenuItem
                key={item.id}
                label={item.label}
                path={item.path}
                icon={item.icon}
                active={item.active}
                onClick={() => handleNavigate(item.path)}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

interface UnifiedRightMenuProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  currentPath?: string;
}

export const UnifiedRightMenu: React.FC<UnifiedRightMenuProps> = ({
  className,
  isMobileOpen = false,
  onMobileClose,
  currentPath: propCurrentPath
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeCurrentPath = location.pathname;
  
  const currentPath = propCurrentPath || routeCurrentPath;
  
  const { isUserAdmin } = useAdminStatus();
  const { menuStructure } = useMainMenuItems(currentPath);
  
  const menuClasses = useMemo(() => cn(
    "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col",
    "md:sticky md:pt-20 md:translate-x-0 transition-all duration-200 ease-out",
    isMobileOpen ? "translate-x-0 shadow-lg" : "-translate-x-full md:translate-x-0",
    className
  ), [isMobileOpen, className]);
  
  const overlayClasses = useMemo(() => cn(
    "fixed inset-0 bg-black/50 z-40 md:hidden",
    isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
    "transition-opacity duration-200 ease-out"
  ), [isMobileOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      <div 
        className={overlayClasses}
        onClick={onMobileClose}
      />
      
      <aside className={menuClasses}>
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer le menu</span>
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex-1 px-3 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <VerticalMenu 
              items={menuStructure}
              onItemClick={handleNavigate}
            />
            
            {isUserAdmin && (
              <AdminMenuSection 
                isExpanded={currentPath.startsWith("/admin")}
                currentPath={currentPath}
                handleNavigate={handleNavigate}
              />
            )}
          </ScrollArea>
        </div>
        
        <div className="px-3 mt-2 mb-2">
          <UserButton className="w-full" />
        </div>
      </aside>
    </>
  );
};

export default UnifiedRightMenu;
