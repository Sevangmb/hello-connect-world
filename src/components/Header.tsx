
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Settings, LogOut, User, Store, Package, Shield, Search, Bell, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";
import { getUserService } from "@/core/users/infrastructure/userDependencyProvider";
import { supabase } from "@/integrations/supabase/client";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { cn } from "@/lib/utils";
import { eventBus } from "@/core/event-bus/EventBus";
import { EVENTS } from "@/core/event-bus/constants";

// Propriétés du composant Header
export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const authService = getAuthService();
  const userService = getUserService();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) return;

        if (process.env.NODE_ENV === 'development') {
          const devBypass = localStorage.getItem('dev_admin_bypass');
          if (devBypass === 'true') {
            console.warn("DEV MODE: Admin bypass enabled in header");
            setIsAdmin(true);
            moduleMenuCoordinator.enableAdminAccess();
            return;
          }
        }

        const isUserAdmin = await userService.isUserAdmin(user.id);
        setIsAdmin(isUserAdmin);
        
        // Synchroniser avec le coordinateur et publier l'événement
        if (isUserAdmin) {
          moduleMenuCoordinator.enableAdminAccess();
          eventBus.publish(EVENTS.AUTH.ADMIN_STATUS_CHANGED, { isAdmin: true });
        } else {
          moduleMenuCoordinator.disableAdminAccess();
          eventBus.publish(EVENTS.AUTH.ADMIN_STATUS_CHANGED, { isAdmin: false });
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, []);

  const {
    data: settingsArray
  } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order('key');
      if (error) throw error;
      return data || [];
    }
  });

  const settings = settingsArray?.reduce((acc: {
    [key: string]: any;
  }, setting) => {
    if (setting?.key && setting?.value) {
      acc[setting.key] = setting.value;
    }
    return acc;
  }, {});

  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      eventBus.publish(EVENTS.AUTH.SIGNED_OUT, {
        timestamp: Date.now()
      });
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    eventBus.publish(EVENTS.NAVIGATION.PAGE_VIEW, {
      path,
      timestamp: Date.now()
    });
  };

  return (
    <header className={cn("fixed top-0 left-0 right-0 h-16 border-b bg-white z-50 shadow-sm", className)}>
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png" alt="FRING!" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold text-custom-rust hidden sm:inline">FRING!</span>
          </Link>
        </div>
        
        {/* Actions rapides et menu utilisateur */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex"
            onClick={() => handleNavigate("/search")}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex"
            onClick={() => handleNavigate("/notifications")}
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex"
            onClick={() => handleNavigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          
          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 border border-gray-200">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/personal")}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>Garde-robe</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/boutiques")}>
                  <Store className="mr-2 h-4 w-4" />
                  <span>Boutiques</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate("/admin/dashboard")}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Administration</span>
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate("/profile/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
