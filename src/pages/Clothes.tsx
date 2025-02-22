
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClothesForm } from "@/components/clothes/ClothesForm";
import { ClothesList } from "@/components/clothes/ClothesList";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Plus, List } from "lucide-react";

const Clothes = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="space-x-2">
                <List className="h-4 w-4" />
                <span>Liste des vêtements</span>
              </TabsTrigger>
              <TabsTrigger value="add" className="space-x-2">
                <Plus className="h-4 w-4" />
                <span>Ajouter un vêtement</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Mes vêtements</h2>
              <ClothesList />
            </TabsContent>
            
            <TabsContent value="add" className="mt-6">
              <ClothesForm onSuccess={() => {
                // Rafraîchir la liste des vêtements si nécessaire
                window.location.reload();
              }} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Clothes;
