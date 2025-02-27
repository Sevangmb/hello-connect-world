
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useSuitcases, SuitcaseFilters } from "@/hooks/useSuitcases";
import { SuitcaseHeader } from "@/components/suitcases/components/SuitcaseHeader";
import { SuitcaseSearchBar } from "@/components/suitcases/components/SuitcaseSearchBar";
import { SuitcaseFilters as SuitcaseFiltersComponent } from "@/components/suitcases/components/SuitcaseFilters";
import { SuitcaseViewToggle } from "@/components/suitcases/components/SuitcaseViewToggle";
import { SuitcaseGrid } from "@/components/suitcases/components/SuitcaseGrid";
import { EmptySuitcases } from "@/components/suitcases/components/EmptySuitcases";
import { LoadingSuitcases } from "@/components/suitcases/components/LoadingSuitcases";

const Suitcases = () => {
  const [selectedSuitcaseId, setSelectedSuitcaseId] = useState<string>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<SuitcaseFilters>({
    status: "active"
  });
  const { data: suitcases, isLoading, refetch } = useSuitcases(filters);

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status: status as SuitcaseFilters['status'] }));
    setSelectedSuitcaseId(undefined);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: event.target.value || undefined }));
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: undefined }));
  };

  const resetFilters = () => {
    setFilters({ status: "active" });
  };

  const statusLabels = {
    active: { label: "Actives", color: "bg-emerald-500" },
    archived: { label: "Archivées", color: "bg-amber-500" },
    deleted: { label: "Supprimées", color: "bg-rose-500" },
    all: { label: "Toutes", color: "bg-blue-500" },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      
      <main className="pt-24 px-4 md:pl-72 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SuitcaseHeader onRefresh={refetch} />

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <SuitcaseSearchBar 
                search={filters.search || ""}
                onSearchChange={handleSearchChange}
                onClearSearch={clearSearch}
              />
              
              <SuitcaseFiltersComponent
                filters={filters}
                statusLabels={statusLabels}
                onStatusChange={handleStatusChange}
                onClearSearch={clearSearch}
              />
              
              <SuitcaseViewToggle 
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>
          </div>

          {isLoading ? (
            <LoadingSuitcases />
          ) : !suitcases?.length ? (
            <EmptySuitcases 
              filters={filters}
              resetFilters={resetFilters}
            />
          ) : (
            <SuitcaseGrid
              suitcases={suitcases}
              viewMode={viewMode}
              selectedSuitcaseId={selectedSuitcaseId}
              setSelectedSuitcaseId={setSelectedSuitcaseId}
            />
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Suitcases;
