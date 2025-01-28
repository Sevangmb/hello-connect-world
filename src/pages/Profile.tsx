import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useState } from "react";

const Profile = () => {
  const [activeSection, setActiveSection] = useState<string>("profile");

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <Sidebar />
      
      {/* Header persistant du profil */}
      <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-sm md:left-64">
        <ProfileHeader />
      </div>

      {/* Layout principal */}
      <div className="pt-48 px-4 md:pl-72">
        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Sidebar du profil (visible sur desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProfileSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>

          {/* Contenu principal */}
          <div className="flex-1 max-w-3xl">
            <ProfileForm />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;