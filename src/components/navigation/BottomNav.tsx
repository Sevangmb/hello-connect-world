
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, User, Menu, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  className?: string;
  onMenuClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className, onMenuClick }) => {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 border-t bg-white z-30 h-16 flex items-center justify-around px-1",
      className
    )}>
      <NavLink to="/" className={({ isActive }) => 
        cn("flex flex-col items-center gap-1 text-xs", isActive ? "text-primary" : "text-gray-500")
      }>
        <Home className="h-5 w-5" />
        <span>Accueil</span>
      </NavLink>
      
      <NavLink to="/explore" className={({ isActive }) => 
        cn("flex flex-col items-center gap-1 text-xs", isActive ? "text-primary" : "text-gray-500")
      }>
        <Search className="h-5 w-5" />
        <span>Explorer</span>
      </NavLink>
      
      <NavLink to="/shop" className={({ isActive }) => 
        cn("flex flex-col items-center gap-1 text-xs", isActive ? "text-primary" : "text-gray-500")
      }>
        <ShoppingBag className="h-5 w-5" />
        <span>Boutique</span>
      </NavLink>
      
      <NavLink to="/profile" className={({ isActive }) => 
        cn("flex flex-col items-center gap-1 text-xs", isActive ? "text-primary" : "text-gray-500")
      }>
        <User className="h-5 w-5" />
        <span>Profil</span>
      </NavLink>
      
      <a 
        href="#" 
        className="flex flex-col items-center gap-1 text-xs text-gray-500"
        onClick={handleMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span>Menu</span>
      </a>
    </div>
  );
};
