import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ClothesList } from "@/components/clothes/ClothesList";
import { AddClothesForm } from "@/components/clothes/AddClothesForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Clothes = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Mes vêtements</TabsTrigger>
              <TabsTrigger value="add">Ajouter un vêtement</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <ClothesList />
            </TabsContent>
            <TabsContent value="add">
              <AddClothesForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Clothes;
