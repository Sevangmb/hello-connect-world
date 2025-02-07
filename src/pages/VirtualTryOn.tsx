
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { VirtualTryOnForm } from "@/components/clothes/VirtualTryOnForm";

const VirtualTryOn = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Essayage Virtuel</h1>
          <VirtualTryOnForm />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default VirtualTryOn;
