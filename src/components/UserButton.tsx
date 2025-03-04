
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useNotificationCenter } from "@/hooks/notifications/useNotificationCenter";
import { Badge } from "@/components/ui/badge";

interface UserButtonProps {
  className?: string;
}

export const UserButton: React.FC<UserButtonProps> = ({ className }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotificationCenter();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`w-full flex items-center justify-start gap-2 px-2 ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt="Avatar" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">{user?.user_metadata?.full_name || "Utilisateur"}</span>
            <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.user_metadata?.full_name || "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/profile/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
