
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopSection } from "@/components/profile/shop/ShopSection";
import { SalesSection } from "@/components/profile/shop/SalesSection";
import { PurchasesSection } from "@/components/profile/shop/PurchasesSection";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "settings") {
      navigate("/profile/settings");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <Tabs 
            defaultValue="profile" 
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="profile">Mon Profil</TabsTrigger>
              <TabsTrigger value="shop">Ma Boutique</TabsTrigger>
              <TabsTrigger value="sales">Mes Ventes</TabsTrigger>
              <TabsTrigger value="purchases">Mes Achats</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>

            <TabsContent value="shop">
              <ShopSection />
            </TabsContent>

            <TabsContent value="sales">
              <SalesSection />
            </TabsContent>

            <TabsContent value="purchases">
              <PurchasesSection />
            </TabsContent>

            <TabsContent value="settings">
              {/* Le contenu ne sera jamais affiché car on redirige vers /profile/settings */}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
