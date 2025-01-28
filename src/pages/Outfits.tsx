import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { OutfitsList } from "@/components/outfits/OutfitsList";

const Outfits = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <OutfitsList />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Outfits;