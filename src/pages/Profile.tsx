import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useState } from "react";

const Profile = () => {
  const [activeSection, setActiveSection] = useState<string>("info");

  const renderContent = () => {
    switch (activeSection) {
      case "info":
        return <ProfileForm />;
      // Les autres sections seront implémentées plus tard
      default:
        return <div>Section en cours de développement</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <Sidebar />
      
      {/* Layout principal */}
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto">
          {/* Header du profil (scrollable) */}
          <ProfileHeader />

          <div className="px-4 py-6">
            <div className="flex gap-6">
              {/* Sidebar du profil avec sous-menus */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <ProfileSidebar 
                  activeSection={activeSection} 
                  onSectionChange={setActiveSection} 
                />
              </div>

              {/* Contenu principal */}
              <div className="flex-1 max-w-3xl">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;