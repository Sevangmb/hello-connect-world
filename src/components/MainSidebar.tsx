
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  ShoppingBag,
  Users,
  User,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

const MENU_ITEMS = [
  {
    label: "Accueil",
    icon: Home,
    path: "/",
    description: "Météo et suggestions"
  },
  {
    label: "Explorer",
    icon: Search,
    path: "/explore",
    description: "Recherche et tendances"
  },
  {
    label: "Mon Univers",
    icon: ShoppingBag,
    path: "/personal",
    description: "Garde-robe et tenues",
    isMain: true
  },
  {
    label: "Social",
    icon: Users,
    path: "/friends",
    description: "Amis et groupes"
  },
  {
    label: "Profil",
    icon: User,
    path: "/profile",
    description: "Mon profil et paramètres"
  }
];

export default function MainSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-background transition-transform md:translate-x-0",
          !isCollapsed && "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="h-16 border-b">
            <div className="flex h-full items-center px-6">
              <h1 className="text-xl font-bold">FRING!</h1>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {MENU_ITEMS.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  item.isMain && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => {
                  navigate(item.path);
                  setIsCollapsed(true);
                }}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Paramètres
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                // Gérer la déconnexion
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
