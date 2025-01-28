import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  User, 
  ShoppingBag, 
  Camera,
  Heart,
  Settings,
  Shirt,
  Store,
  History,
  ShoppingCart,
  Plus,
  Trophy,
  Eye,
  EyeOff
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
  const [openMenus, setOpenMenus] = useState<string[]>(["profile", "wardrobe", "marketplace"]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    {
      id: "wardrobe",
      label: "Garde-Robe",
      icon: Shirt,
      subItems: [
        { id: "wardrobe", label: "Ma Garde-Robe", icon: ShoppingBag },
        { id: "outfits", label: "Mes Tenues", icon: Shirt },
        { id: "looks", label: "Mes Looks", icon: Camera },
        { id: "favorites", label: "Mes Favoris", icon: Heart },
      ]
    },
    {
      id: "marketplace",
      label: "Vide-Dressing",
      icon: Store,
      subItems: [
        { id: "marketplace", label: "Articles en vente", icon: ShoppingBag },
        { id: "add-item", label: "Ajouter un article", icon: Plus },
        { id: "sales-history", label: "Historique des ventes", icon: History },
        { id: "purchases", label: "Mes Achats", icon: ShoppingCart },
      ]
    },
    {
      id: "achievements",
      label: "Récompenses",
      icon: Trophy,
      subItems: [
        { id: "badges", label: "Mes Badges", icon: Trophy },
      ]
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      subItems: [
        { id: "info", label: "Informations", icon: User },
        { id: "privacy", label: "Mode privé", icon: EyeOff },
      ]
    },
  ];

  return (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <div key={item.id} className="space-y-1">
          <Collapsible
            open={openMenus.includes(item.id)}
            onOpenChange={() => toggleMenu(item.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between group"
              >
                <span className="flex items-center">
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </span>
                {openMenus.includes(item.id) ? (
                  <Eye className="h-4 w-4 transition-transform" />
                ) : (
                  <EyeOff className="h-4 w-4 transition-transform" />
                )}
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
        </div>
      ))}
    </div>
  );
};