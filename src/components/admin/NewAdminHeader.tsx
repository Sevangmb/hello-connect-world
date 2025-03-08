
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BellIcon, Menu, MoonIcon, Search, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";

interface NewAdminHeaderProps {
  onMenuToggle?: () => void;
  className?: string;
}

export function NewAdminHeader({ onMenuToggle, className }: NewAdminHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const authService = getAuthService();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
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

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 h-16 border-b z-50 bg-card",
      "flex items-center px-4 md:px-6",
      className
    )}>
      {/* Bouton menu mobile et logo */}
      <div className="flex items-center mr-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
        <Link to="/admin/dashboard" className="flex items-center">
          <Logo size="sm" className="h-8 w-8" />
          <span className="ml-2 font-semibold text-lg hidden md:inline-block">FRING! Admin</span>
        </Link>
      </div>
      
      {/* Barre de recherche */}
      <div className="hidden md:flex flex-1 px-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-8 h-9 bg-muted/50"
          />
        </div>
      </div>
      
      {/* Actions utilisateur */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Bouton thème */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-foreground"
        >
          {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          <span className="sr-only">Changer le thème</span>
        </Button>
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute h-2 w-2 rounded-full bg-destructive top-2 right-2" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="cursor-pointer flex items-start py-2">
                <div className="rounded-full h-8 w-8 bg-primary/10 text-primary flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs font-semibold">U</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouvel utilisateur inscrit</p>
                  <p className="text-xs text-muted-foreground">il y a 5 minutes</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-start py-2">
                <div className="rounded-full h-8 w-8 bg-warning/10 text-warning flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-xs font-semibold">A</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Alerte de performance du module IA</p>
                  <p className="text-xs text-muted-foreground">il y a 2 heures</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center">
              <span className="text-sm font-medium text-primary">Voir toutes les notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Profil utilisateur */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8 border">
              <span className="font-semibold text-sm">A</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/profile">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default NewAdminHeader;
