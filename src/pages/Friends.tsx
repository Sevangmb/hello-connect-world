
import React from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FriendsList } from "@/components/friends/FriendsList";
import { AddFriend } from "@/components/friends/AddFriend";
import { Users } from "lucide-react";
import { ModuleGuard } from "@/components/modules/ModuleGuard";

const Friends = () => {
  return (
    <ModuleGuard 
      moduleCode="social" 
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16 md:pb-0">
          <Header />
          <MainSidebar />
          <main className="pt-24 px-4 md:pl-72">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-blue-900 mb-4">Module social désactivé</h1>
                <p className="text-blue-700">
                  Le module social est actuellement désactivé. Contactez l'administrateur pour plus d'informations.
                </p>
              </div>
            </div>
          </main>
          <BottomNav />
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16 md:pb-0">
        <Header />
        <MainSidebar />
        <main className="pt-24 px-4 md:pl-72">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-blue-900">Amis</h1>
              </div>
              <p className="text-blue-700">
                Gérez vos amis et vos demandes d'amitié
              </p>
            </div>
            
            <AddFriend />
            <FriendsList />
          </div>
        </main>
        <BottomNav />
      </div>
    </ModuleGuard>
  );
};

export default Friends;
