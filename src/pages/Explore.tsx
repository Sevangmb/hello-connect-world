
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { useEffect, useState } from "react";

const ExploreContent = () => (
  <>
    <h1 className="text-2xl font-bold mb-4">Explorer</h1>
    {/* Contenu de la page Explorer */}
  </>
);

// Composant fallback léger qui n'aura pas d'impact sur les performances
const ExploreFallback = () => (
  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
    <h2 className="text-xl font-semibold text-amber-800">Module Explorer indisponible</h2>
    <p className="text-amber-700 mt-2">
      Le module Explorer est actuellement désactivé. Veuillez réessayer ultérieurement.
    </p>
  </div>
);

const Explore = () => {
  const [isClient, setIsClient] = useState(false);

  // Utiliser useEffect pour éviter les problèmes d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          {isClient ? (
            <ModuleGuard 
              moduleCode="explore"
              fallback={<ExploreFallback />}
            >
              <ExploreContent />
            </ModuleGuard>
          ) : (
            <div className="animate-pulse bg-gray-200 h-24 rounded w-full"></div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Explore;
