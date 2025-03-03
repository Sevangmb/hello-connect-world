
import React from "react";
import { Logo } from "@/components/Logo";
import { ModuleMenu } from "@/components/navigation/ModuleMenu";
import { UserButton } from "@/components/UserButton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MainSidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ 
  className,
  isMobileOpen = false,
  onMobileClose
}) => {
  return (
    <>
      {/* Version mobile avec overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col",
        "md:z-30 md:pt-20 md:translate-x-0 transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
      )}>
        {/* En-tête avec logo */}
        <div className="px-4 flex items-center justify-between md:hidden">
          <Logo size="sm" />
          
          {/* Bouton de fermeture (mobile uniquement) */}
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
        
        <Separator className="my-4 md:hidden" />
        
        {/* Menu des modules */}
        <div className="flex-1 px-3 overflow-y-auto">
          <ModuleMenu />
        </div>
        
        {/* Pied de page avec profil utilisateur */}
        <div className="px-3 mt-2 mb-1">
          <UserButton className="w-full" />
        </div>
      </aside>
    </>
  );
};

export default MainSidebar;
