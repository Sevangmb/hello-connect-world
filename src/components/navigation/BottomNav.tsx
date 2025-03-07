
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Star, Users, User } from "lucide-react";
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
      
      <NavLink to="/personal" className={({ isActive }) => 
        cn("flex flex-col items-center gap-1 text-xs bg-primary/10 rounded-full p-1", 
          isActive ? "text-primary" : "text-gray-700")
      }>
        <Star className="h-6 w-6" />
        <span className="font-medium">Perso</span>
      </NavLink>
      
      <NavLink to="/social" className={({ isActive }) => 
        cn("flex flex-col items-center gap-1 text-xs", isActive ? "text-primary" : "text-gray-500")
      }>
        <Users className="h-5 w-5" />
        <span>Communauté</span>
      </NavLink>
      
      <NavLink to="/profile" className={({ isActive }) => 
        cn("flex flex-col items-center gap-1 text-xs", isActive ? "text-primary" : "text-gray-500")
      }>
        <User className="h-5 w-5" />
        <span>Profil</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
