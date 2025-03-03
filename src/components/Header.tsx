
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Menu, Settings, LogOut, User, Store, Package, Shield, Search, Bell, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Vérifier si l'utilisateur est administrateur
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Essayer d'abord avec RPC si disponible
        try {
          const { data: isUserAdmin } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (isUserAdmin !== undefined) {
            setIsAdmin(!!isUserAdmin);
            return;
          }
        } catch (error) {
          console.log("RPC not available, using direct query");
        }

        // Fallback à la requête directe
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.is_admin || false);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    // Mode développement: permettre l'accès admin plus facilement
    if (process.env.NODE_ENV === 'development') {
      const devBypass = localStorage.getItem('dev_admin_bypass');
      if (devBypass === 'true') {
        console.warn("DEV MODE: Admin bypass enabled in header");
        setIsAdmin(true);
        return;
      }
    }

    checkAdminStatus();
  }, []);

  const {
    data: settingsArray
  } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("site_settings").select("*").order('key');
      if (error) throw error;
      return data || [];
    }
  });

  // Convert array to object for easier access
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
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
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
  
  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white z-50 shadow-sm">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png" alt="FRING!" className="h-10 w-10 rounded-full" />
            <span className="text-xl font-bold text-custom-rust hidden sm:inline">FRING!</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Accueil</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/explore">Explorer</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/personal">Mon Univers</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/boutiques">Boutiques</Link>
          </Button>
          
          {isAdmin && (
            <Button variant="outline" size="sm" className="ml-2 border-primary text-primary" asChild>
              <Link to="/admin/dashboard">
                <Shield className="mr-1 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 border border-gray-200">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/personal" className="cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Garde-robe</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/boutiques" className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  <span>Boutiques</span>
                </Link>
              </DropdownMenuItem>
              
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Administration</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="container py-4 space-y-3">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Accueil
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/explore" onClick={() => setMenuOpen(false)}>
                Explorer
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/personal" onClick={() => setMenuOpen(false)}>
                Mon Univers
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/boutiques" onClick={() => setMenuOpen(false)}>
                Boutiques
              </Link>
            </Button>
            
            <div className="pt-2 border-t grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="justify-center" asChild>
                <Link to="/search" onClick={() => setMenuOpen(false)}>
                  <Search className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="justify-center" asChild>
                <Link to="/notifications" onClick={() => setMenuOpen(false)}>
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="justify-center" asChild>
                <Link to="/cart" onClick={() => setMenuOpen(false)}>
                  <ShoppingCart className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {isAdmin && (
              <Button variant="outline" className="w-full justify-center mt-2 border-primary text-primary" asChild>
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                  <Shield className="mr-2 h-4 w-4" />
                  Administration
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
