import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Image, 
  Heart, 
  Briefcase, 
  Settings,
  Camera,
  MessageCircle,
  Users,
  BadgeCheck
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const ProfileSidebar = ({ activeSection, onSectionChange }: ProfileSidebarProps) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: "profile",
      label: "Profil",
      icon: User,
      subItems: [
        { id: "info", label: "Informations", icon: User },
        { id: "photos", label: "Photos", icon: Camera },
      ]
    },
    {
      id: "content",
      label: "Contenu",
      icon: Image,
      subItems: [
        { id: "looks", label: "Mes looks", icon: Image },
        { id: "outfits", label: "Mes tenues", icon: Briefcase },
      ]
    },
    {
      id: "social",
      label: "Social",
      icon: Users,
      subItems: [
        { id: "friends", label: "Amis", icon: Users },
        { id: "messages", label: "Messages", icon: MessageCircle },
      ]
    },
    {
      id: "collections",
      label: "Collections",
      icon: Heart,
      subItems: [
        { id: "favorites", label: "Favoris", icon: Heart },
        { id: "badges", label: "Badges", icon: BadgeCheck },
      ]
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      standalone: true
    },
  ];

  return (
    <div className="space-y-2 p-4">
      {menuItems.map((item) => (
        <div key={item.id} className="space-y-1">
          {item.standalone ? (
            <Button
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
          ) : (
            <Collapsible
              open={openMenus.includes(item.id)}
              onOpenChange={() => toggleMenu(item.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                {item.subItems?.map((subItem) => (
                  <Button
                    key={subItem.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      activeSection === subItem.id && "bg-muted"
                    )}
                    onClick={() => onSectionChange(subItem.id)}
                  >
                    <subItem.icon className="h-4 w-4 mr-2" />
                    {subItem.label}
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      ))}
    </div>
  );
};