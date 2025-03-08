
import React from "react";
import { cn } from "@/lib/utils";
import { AdminNavigation } from "./AdminNavigation";
import { useAuth } from "@/modules/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AdminSidebarProps {
  collapsed?: boolean;
  className?: string;
}

export function NewAdminSidebar({ collapsed = false, className }: AdminSidebarProps) {
  const { user } = useAuth();
  
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
      <ScrollArea className="flex-1">
        <AdminNavigation collapsed={collapsed} />
      </ScrollArea>
      
      {/* Pied du sidebar (infos utilisateur) */}
      <div className="mt-auto px-4 py-3 border-t border-border">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "")}>
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          
          {!collapsed && (
            <div className="ml-3 truncate">
              <div className="text-sm font-medium">{user?.email?.split('@')[0] || 'Admin'}</div>
              <div className="text-xs text-muted-foreground">Administrateur</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewAdminSidebar;
