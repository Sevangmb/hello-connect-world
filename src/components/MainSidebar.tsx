
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { HomeSection } from "./sidebar/HomeSection";
import { ExploreSection } from "./sidebar/ExploreSection";
import { PersonalSection } from "./sidebar/PersonalSection";
import { CommunitySection } from "./sidebar/CommunitySection";
import { ProfileSection } from "./sidebar/ProfileSection";
import { AdminSection } from "./sidebar/AdminSection";
import { useModules } from "@/hooks/useModules";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface MainSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function MainSidebar({ isOpen = false, onClose }: MainSidebarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const { isModuleActive } = useModules();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

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
            <HomeSection />
            {isModuleActive('explore') && <ExploreSection />}
            {isModuleActive('wardrobe') && <PersonalSection />}
            {isModuleActive('community') && <CommunitySection />}
            {isModuleActive('profile') && <ProfileSection />}
            {isAdmin && <AdminSection />}
          </Accordion>
        </ScrollArea>
      </nav>
    </>
  );
}
