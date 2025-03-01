
import { useEffect, useState, useCallback, memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { HomeSection } from "./sidebar/HomeSection";
import { ExploreSection } from "./sidebar/ExploreSection";
import { PersonalSection } from "./sidebar/PersonalSection";
import { CommunitySection } from "./sidebar/CommunitySection";
import { ProfileSection } from "./sidebar/ProfileSection";
import { AdminSection } from "./sidebar/AdminSection";
import { useModules } from "@/hooks/modules";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ModuleGuard } from "./modules/ModuleGuard";

interface MainSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Mémorisation des composants de sections pour éviter des rendus inutiles
const MemoizedHomeSection = memo(HomeSection);
const MemoizedExploreSection = memo(ExploreSection);
const MemoizedPersonalSection = memo(PersonalSection); 
const MemoizedCommunitySection = memo(CommunitySection);
const MemoizedProfileSection = memo(ProfileSection);
const MemoizedAdminSection = memo(AdminSection);

// Composant principal du sidebar mémorisé
export default memo(function MainSidebar({ isOpen = false, onClose }: MainSidebarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const { refreshModules } = useModules();

  // N'initialiser qu'au montage
  useEffect(() => {
    refreshModules();
  }, []);

  // Vérifier si l'utilisateur est administrateur
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          // Essayer d'abord avec RPC
          const { data: isUserAdmin } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (isUserAdmin !== undefined) {
            setIsAdmin(!!isUserAdmin);
            return;
          }
        } catch (error) {
          console.log("RPC not available, using direct query:", error);
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
        console.warn("DEV MODE: Admin bypass enabled in sidebar");
        setIsAdmin(true);
        return;
      }
    }

    checkAdminStatus();
  }, []);

  return (
    <>
      {/* Overlay sur mobile */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <nav 
        className={`fixed left-0 top-0 bottom-0 w-64 border-r bg-white pt-16 z-50 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {onClose && (
          <div className="flex justify-end p-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <ScrollArea className="h-full px-4 py-6">
          <Accordion type="single" collapsible defaultValue="personal">
            <MemoizedHomeSection />
            
            <ModuleGuard moduleCode="explore">
              <MemoizedExploreSection />
            </ModuleGuard>
            
            <ModuleGuard moduleCode="wardrobe">
              <MemoizedPersonalSection />
            </ModuleGuard>
            
            <ModuleGuard moduleCode="community">
              <MemoizedCommunitySection />
            </ModuleGuard>
            
            <ModuleGuard moduleCode="profile">
              <MemoizedProfileSection />
            </ModuleGuard>
            
            {isAdmin && <MemoizedAdminSection />}
          </Accordion>
        </ScrollArea>
      </nav>
    </>
  );
});
