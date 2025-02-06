import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";

const Personal = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Mon Espace Personnel</h1>
          {/* Contenu de la page Personal */}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Personal;
