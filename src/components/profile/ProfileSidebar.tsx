import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User, Image, Heart, Briefcase, Settings } from "lucide-react";

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const ProfileSidebar = ({ activeSection, onSectionChange }: ProfileSidebarProps) => {
  const menuItems = [
    { id: "profile", label: "Profil", icon: User },
    { id: "looks", label: "Mes looks", icon: Image },
    { id: "favorites", label: "Favoris", icon: Heart },
    { id: "suitcases", label: "Mes valises", icon: Briefcase },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "w-full justify-start",
            activeSection === item.id && "bg-muted"
          )}
          onClick={() => onSectionChange(item.id)}
        >
          <item.icon className="h-4 w-4 mr-2" />
          {item.label}
        </Button>
      ))}
    </div>
  );
};