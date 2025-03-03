
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <MainSidebar />
        
        <main className="flex-1 pt-16 pb-16 md:pt-20 md:pb-8 px-4 md:pl-72 md:pr-6 lg:pr-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Paramètres du compte</h1>
            
            <Suspense fallback={
              <div className="flex items-center justify-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              <ProfileSettings />
            </Suspense>
          </div>
        </main>
      </div>
      
      <BottomNav />
    </div>
  );
}
