
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CreateSuitcaseDialog } from "@/components/suitcases/CreateSuitcaseDialog";
import { useSuitcases, SuitcaseFilters } from "@/hooks/useSuitcases";
import { 
  Loader2, Filter, Search, Calendar, LayoutGrid, 
  Archive, Trash2, RefreshCw, X, GripVertical 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SuitcaseItems } from "@/components/suitcases/SuitcaseItems";
import { SuitcaseDates } from "@/components/suitcases/components/SuitcaseDates";
import { SuitcaseActions } from "@/components/suitcases/components/SuitcaseActions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Suitcase } from "@/components/suitcases/utils/types";

const Suitcases = () => {
  const { toast } = useToast();
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

  const statusLabels = {
    active: { label: "Actives", color: "bg-emerald-500" },
    archived: { label: "Archivées", color: "bg-amber-500" },
    deleted: { label: "Supprimées", color: "bg-rose-500" },
    all: { label: "Toutes", color: "bg-blue-500" },
  };

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return "Pas de dates";
    
    return `${format(new Date(startDate), "d MMM", { locale: fr })} - ${format(new Date(endDate), "d MMM yyyy", { locale: fr })}`;
  };

  const renderSuitcaseCard = (suitcase: Suitcase) => {
    const isSelected = selectedSuitcaseId === suitcase.id;
    const startDate = suitcase.start_date ? new Date(suitcase.start_date) : undefined;
    const endDate = suitcase.end_date ? new Date(suitcase.end_date) : undefined;
    
    return (
      <Card 
        key={suitcase.id} 
        className={`group transition-all duration-200 hover:shadow-md ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold truncate">{suitcase.name}</CardTitle>
            <Badge variant={suitcase.status === "active" ? "default" : suitcase.status === "archived" ? "secondary" : "destructive"}>
              {suitcase.status === "active" ? "Active" : suitcase.status === "archived" ? "Archivée" : "Supprimée"}
            </Badge>
          </div>
          {suitcase.description && (
            <CardDescription className="line-clamp-2">
              {suitcase.description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="text-sm text-muted-foreground mb-4">
            {startDate && endDate ? (
              <div className="flex gap-1 items-center">
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange(suitcase.start_date, suitcase.end_date)}</span>
              </div>
            ) : (
              <div className="flex gap-1 items-center text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Pas de dates programmées</span>
              </div>
            )}
          </div>
          
          {isSelected && (
            <div className="pt-2 animate-fade-in">
              <SuitcaseDates
                suitcaseId={suitcase.id}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={() => {}}
                onEndDateChange={() => {}}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-2 flex flex-col gap-2">
          <Button 
            variant={isSelected ? "default" : "outline"} 
            size="sm" 
            className="w-full"
            onClick={() => setSelectedSuitcaseId(isSelected ? undefined : suitcase.id)}
          >
            {isSelected ? "Masquer les détails" : "Afficher les détails"}
          </Button>
          
          {isSelected && (
            <div className="w-full space-y-4 pt-2 animate-fade-in">
              <SuitcaseItems suitcaseId={suitcase.id} />
              
              <SuitcaseActions 
                suitcaseId={suitcase.id}
                isSelected={isSelected}
                onSelect={setSelectedSuitcaseId}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderSuitcaseListItem = (suitcase: Suitcase) => {
    const isSelected = selectedSuitcaseId === suitcase.id;
    const startDate = suitcase.start_date ? new Date(suitcase.start_date) : undefined;
    const endDate = suitcase.end_date ? new Date(suitcase.end_date) : undefined;
    
    return (
      <div 
        key={suitcase.id} 
        className={`border rounded-md mb-3 overflow-hidden transition-all duration-200 ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
      >
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setSelectedSuitcaseId(isSelected ? undefined : suitcase.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GripVertical className="text-muted-foreground h-5 w-5" />
              <div>
                <h3 className="font-medium">{suitcase.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {startDate && endDate
                    ? formatDateRange(suitcase.start_date, suitcase.end_date)
                    : "Pas de dates programmées"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={suitcase.status === "active" ? "default" : suitcase.status === "archived" ? "secondary" : "destructive"}>
                {suitcase.status === "active" ? "Active" : suitcase.status === "archived" ? "Archivée" : "Supprimée"}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSuitcaseId(isSelected ? undefined : suitcase.id);
                }}
              >
                {isSelected ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        {isSelected && (
          <div className="px-4 pb-4 pt-2 border-t animate-fade-in">
            <div className="space-y-4">
              {suitcase.description && (
                <p className="text-sm">{suitcase.description}</p>
              )}
              
              <SuitcaseDates
                suitcaseId={suitcase.id}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={() => {}}
                onEndDateChange={() => {}}
              />
              
              <SuitcaseItems suitcaseId={suitcase.id} />
              
              <SuitcaseActions 
                suitcaseId={suitcase.id}
                isSelected={isSelected}
                onSelect={setSelectedSuitcaseId}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      
      <main className="pt-24 px-4 md:pl-72 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Mes Valises</h1>
                <p className="text-muted-foreground mt-1">
                  Gérez vos valises et organisez vos vêtements pour chaque voyage
                </p>
              </div>
              
              <div className="flex gap-2">
                <CreateSuitcaseDialog />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => refetch()}
                  title="Rafraîchir"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-9 pr-9"
                  placeholder="Rechercher une valise..."
                  value={filters.search || ""}
                  onChange={handleSearchChange}
                />
                {filters.search && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
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
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  title="Vue en grille"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  title="Vue en liste"
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 mt-2 flex-wrap">
              {filters.status && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1 py-1"
                >
                  Statut: {statusLabels[filters.status as keyof typeof statusLabels]?.label || filters.status}
                  <button 
                    onClick={() => handleStatusChange("active")}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {filters.search && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1 py-1"
                >
                  Recherche: {filters.search}
                  <button 
                    onClick={clearSearch}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Chargement de vos valises...</p>
              </div>
            </div>
          ) : !suitcases?.length ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
              <div className="max-w-md mx-auto">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Filter className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Aucune valise trouvée</h3>
                <p className="text-muted-foreground mb-6">
                  {filters.status !== "active" || filters.search 
                    ? "Aucune valise ne correspond à vos critères de recherche." 
                    : "Vous n'avez pas encore créé de valise."}
                </p>
                {filters.status !== "active" || filters.search ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFilters({ status: "active" });
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                ) : (
                  <CreateSuitcaseDialog />
                )}
              </div>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : ""}>
              {suitcases.map((suitcase) => 
                viewMode === "grid" 
                  ? renderSuitcaseCard(suitcase) 
                  : renderSuitcaseListItem(suitcase)
              )}
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Suitcases;
