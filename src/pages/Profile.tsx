
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopSection } from "@/components/profile/shop/ShopSection";
import { SalesSection } from "@/components/profile/shop/SalesSection";
import { PurchasesSection } from "@/components/profile/shop/PurchasesSection";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Mon Profil</TabsTrigger>
              <TabsTrigger value="shop">Ma Boutique</TabsTrigger>
              <TabsTrigger value="sales">Mes Ventes</TabsTrigger>
              <TabsTrigger value="purchases">Mes Achats</TabsTrigger>
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
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;

