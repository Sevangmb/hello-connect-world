import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useState } from "react";

const Profile = () => {
  const [activeSection, setActiveSection] = useState<string>("info");

  const renderContent = () => {
    switch (activeSection) {
      case "info":
        return <ProfileForm />;
      case "wardrobe":
        return <div>Ma Garde-Robe (en développement)</div>;
      case "outfits":
        return <div>Mes Tenues (en développement)</div>;
      case "looks":
        return <div>Mes Looks (en développement)</div>;
      case "favorites":
        return <div>Mes Favoris (en développement)</div>;
      case "marketplace":
        return <div>Articles en vente (en développement)</div>;
      case "add-item":
        return <div>Ajouter un article (en développement)</div>;
      case "sales-history":
        return <div>Historique des ventes (en développement)</div>;
      case "purchases":
        return <div>Mes Achats (en développement)</div>;
      case "badges":
        return <div>Mes Badges (en développement)</div>;
      case "privacy":
        return <div>Mode privé (en développement)</div>;
      default:
        return <div>Section en cours de développement</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 py-6">
            <div className="flex gap-6">
              <div className="hidden lg:block w-64 flex-shrink-0">
                <ProfileSidebar 
                  activeSection={activeSection} 
                  onSectionChange={setActiveSection} 
                />
              </div>
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