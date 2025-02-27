
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CreateSuitcaseDialog } from "@/components/suitcases/CreateSuitcaseDialog";
import { SuitcaseCard } from "@/components/suitcases/SuitcaseCard";
import { useSuitcases, SuitcaseFilters } from "@/hooks/useSuitcases";
import { Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Suitcases = () => {
  const [selectedSuitcaseId, setSelectedSuitcaseId] = useState<string>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SuitcaseFilters>({});
  const { data: suitcases, isLoading } = useSuitcases(filters);

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status: status as SuitcaseFilters['status'] }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mes Valises</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary/10" : ""}
              >
                <Filter className="h-5 w-5" />
              </Button>
              <div className="w-40">
                <CreateSuitcaseDialog />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select
                    value={filters.status || "active"}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="archived">Archivées</SelectItem>
                      <SelectItem value="deleted">Supprimées</SelectItem>
                      <SelectItem value="all">Toutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recherche</label>
                  <Input
                    placeholder="Rechercher une valise..."
                    value={filters.search || ""}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          )}

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
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Suitcases;
