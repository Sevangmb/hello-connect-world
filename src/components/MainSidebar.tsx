
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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // N'initialiser qu'au montage
  useEffect(() => {
    refreshModules().catch(err => {
      console.error("Erreur lors du rafraîchissement des modules:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les modules. Veuillez rafraîchir la page."
      });
    });
  }, [refreshModules, toast]);

  // Vérifier si l'utilisateur est administrateur
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Mode développement: permettre l'accès admin plus facilement
        if (process.env.NODE_ENV === 'development') {
          const devBypass = localStorage.getItem('dev_admin_bypass');
          if (devBypass === 'true') {
            console.log("DEV MODE: Admin bypass enabled in sidebar");
            setIsAdmin(true);
            return;
          }
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
          // Essayer d'abord avec RPC
          const { data: isUserAdmin, error: rpcError } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (!rpcError && isUserAdmin !== undefined) {
            console.log("Admin status from RPC:", isUserAdmin);
            setIsAdmin(!!isUserAdmin);
            return;
          }
        } catch (error) {
          console.log("RPC not available, using direct query:", error);
        }

        // Fallback à la requête directe avec retry
        let retryCount = 0;
        const maxRetries = 3;
        let success = false;

        while (!success && retryCount < maxRetries) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', user.id)
              .single();

            if (!error && profile) {
              console.log("Admin status from direct query:", profile.is_admin);
              setIsAdmin(!!profile.is_admin);
              success = true;
              break;
            }
          } catch (queryError) {
            console.error(`Tentative ${retryCount + 1} échouée:`, queryError);
          }

          retryCount++;
          // Backoff exponentiel entre les tentatives
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          }
        }

        if (!success) {
          console.error("Impossible de déterminer le statut admin après plusieurs tentatives");
          
          // En dernier recours, vérifier le rôle dans localStorage
          const userRole = localStorage.getItem('user_role');
          if (userRole === 'admin') {
            console.log("Admin status from localStorage fallback");
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

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
            
            {/* Toujours afficher la section admin si l'utilisateur est admin */}
            {isAdmin && <MemoizedAdminSection />}
          </Accordion>
        </ScrollArea>
      </nav>
    </>
  );
});
