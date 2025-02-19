
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { PublishForm } from "@/components/publications/PublishForm";
import { Card } from "@/components/ui/card";

const Personal = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Mon Espace Personnel</h1>
          
          <Card className="p-6 mb-8">
            <PublishForm />
          </Card>
          
          {/* Liste des publications à implémenter plus tard */}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Personal;
