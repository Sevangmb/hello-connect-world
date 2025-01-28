import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Search,
  ShoppingBag,
  Users,
  User,
  Shield
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function MainSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: isAdmin } = await supabase.rpc('is_admin', {
          user_id: user.id
        });

        setIsAdmin(isAdmin || false);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <nav className="fixed left-0 top-0 bottom-0 hidden w-64 border-r bg-white pt-16 md:block">
      <ScrollArea className="h-full px-4 py-6">
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/",
          })}
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          Accueil
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/search",
          })}
          onClick={() => navigate("/search")}
        >
          <Search className="h-4 w-4" />
          Explorer
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/personal",
          })}
          onClick={() => navigate("/personal")}
        >
          <ShoppingBag className="h-4 w-4" />
          Mon Univers
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/community",
          })}
          onClick={() => navigate("/community")}
        >
          <Users className="h-4 w-4" />
          Communauté
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2", {
            "bg-gray-100": location.pathname === "/profile",
          })}
          onClick={() => navigate("/profile")}
        >
          <User className="h-4 w-4" />
          Profil
        </Button>
        {isAdmin && (
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/admin",
            })}
            onClick={() => navigate("/admin")}
          >
            <Shield className="h-4 w-4" />
            Administration
          </Button>
        )}
      </ScrollArea>
    </nav>
  );
}