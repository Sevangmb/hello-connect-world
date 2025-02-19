
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { HomeSection } from "@/components/sidebar/HomeSection";
import { ExploreSection } from "@/components/sidebar/ExploreSection";
import { PersonalSection } from "@/components/sidebar/PersonalSection";
import { CommunitySection } from "@/components/sidebar/CommunitySection";
import { ProfileSection } from "@/components/sidebar/ProfileSection";
import { AdminSection } from "@/components/sidebar/AdminSection";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";

export interface MainSidebarProps {
  children?: React.ReactNode;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export default function MainSidebar({ children, isCollapsed, setIsCollapsed }: MainSidebarProps) {
  const navigate = useNavigate();
  const sidebarContext = useSidebar();
  
  // Use props if provided, otherwise fall back to context
  const collapsed = isCollapsed ?? sidebarContext.isCollapsed;
  const setCollapsed = setIsCollapsed ?? sidebarContext.setIsCollapsed;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </Button>

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-background transition-transform md:translate-x-0",
          !collapsed && "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="h-16 border-b">
            <div className="flex h-full items-center px-6">
              <h1 className="text-xl font-bold">FRING!</h1>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <HomeSection />
            <ExploreSection />
            <PersonalSection />
            <CommunitySection />
            <ProfileSection />
            <AdminSection />
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
      {children}
    </>
  );
}
