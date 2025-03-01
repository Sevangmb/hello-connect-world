
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

// Cache des statuts administratifs pour éviter des appels répétés
const adminStatusCache = {
  isAdmin: false,
  timestamp: 0,
  checked: false
};

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

  // Optimisation : vérifier si on doit recharger les modules
  const initModules = useCallback(async () => {
    // Vérifier si nous avons déjà rechargé récemment
    const now = Date.now();
    const lastRefresh = parseInt(localStorage.getItem('last_modules_refresh') || '0', 10);
    
    // Ne recharger que si le dernier rechargement date de plus de 2 minutes
    if (now - lastRefresh > 120000) {
      console.log("Rechargement des modules dans le sidebar principal");
      try {
        await refreshModules();
        localStorage.setItem('last_modules_refresh', now.toString());
      } catch (error) {
        console.error("Erreur lors du rechargement des modules:", error);
      }
    } else {
      console.log("Utilisation du cache des modules récent");
    }
  }, [refreshModules]);

  // N'initialiser qu'au montage
  useEffect(() => {
    initModules();
  }, []);

  // Vérifier si l'utilisateur est administrateur, avec mise en cache
  useEffect(() => {
    const checkAdminStatus = async () => {
      // Si déjà vérifié, ne pas revérifier
      if (adminStatusCache.checked) {
        setIsAdmin(adminStatusCache.isAdmin);
        return;
      }
      
      // Vérifier si nous avons un cache récent (moins de 30 minutes)
      const now = Date.now();
      if (now - adminStatusCache.timestamp < 30 * 60 * 1000) {
        setIsAdmin(adminStatusCache.isAdmin);
        return;
      }
      
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
            adminStatusCache.isAdmin = !!isUserAdmin;
            adminStatusCache.timestamp = now;
            adminStatusCache.checked = true;
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

        const isAdminValue = profile?.is_admin || false;
        setIsAdmin(isAdminValue);
        adminStatusCache.isAdmin = isAdminValue;
        adminStatusCache.timestamp = now;
        adminStatusCache.checked = true;
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
        adminStatusCache.checked = true;
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
