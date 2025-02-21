
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { OutfitsList } from "@/components/outfits/OutfitsList";
import { CreateOutfit } from "@/components/outfits/CreateOutfit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Outfits = () => {
  return (
    <div className="h-screen overflow-hidden bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="h-[calc(100vh-6rem)] pt-24 px-4 md:pl-72 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Mes tenues</TabsTrigger>
              <TabsTrigger value="create">Créer une tenue</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <OutfitsList />
            </TabsContent>
            <TabsContent value="create">
              <CreateOutfit />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Outfits;
