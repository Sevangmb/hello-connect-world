
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CreateSuitcaseDialog } from "@/components/suitcases/CreateSuitcaseDialog";
import { SuitcaseCard } from "@/components/suitcases/SuitcaseCard";
import { SuitcaseItems } from "@/components/suitcases/SuitcaseItems";
import { useSuitcases } from "@/hooks/useSuitcases";
import { Loader2 } from "lucide-react";

const Suitcases = () => {
  const [selectedSuitcaseId, setSelectedSuitcaseId] = useState<string>();
  const { data: suitcases, isLoading } = useSuitcases();

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mes Valises</h1>
            <div className="w-40">
              <CreateSuitcaseDialog />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !suitcases?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              Vous n'avez pas encore créé de valise
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {suitcases.map((suitcase) => (
                <SuitcaseCard
                  key={suitcase.id}
                  suitcase={suitcase}
                  onSelect={setSelectedSuitcaseId}
                  isSelected={selectedSuitcaseId === suitcase.id}
                />
              ))}
            </div>
          )}

          {selectedSuitcaseId && (
            <div className="mt-8">
              <SuitcaseItems suitcaseId={selectedSuitcaseId} />
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Suitcases;

