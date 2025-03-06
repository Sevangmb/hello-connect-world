
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useSuitcases, Suitcase, SuitcaseStatus } from '@/hooks/useSuitcases';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SuitcaseGrid } from '@/components/suitcases/components/SuitcaseGrid';
import { CreateSuitcaseDialog } from '@/components/suitcases/CreateSuitcaseDialog';
import { SuitcaseFilters } from '@/components/suitcases/components/SuitcaseFilters';
import { SuitcaseViewToggle } from '@/components/suitcases/components/SuitcaseViewToggle';
import { EmptySuitcases } from '@/components/suitcases/components/EmptySuitcases';
import { LoadingSuitcases } from '@/components/suitcases/components/LoadingSuitcases';
import { useToast } from '@/hooks/use-toast';

interface SuitcaseFilter {
  status: SuitcaseStatus | 'all';
  search: string;
}

const Suitcases = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    suitcases, 
    loading, 
    error, 
    createSuitcase,
    applyFilters,
    filters
  } = useSuitcases();

  const filteredSuitcases = React.useMemo(() => {
    return suitcases.filter(suitcase => 
      suitcase.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (suitcase.description && suitcase.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [suitcases, searchQuery]);

  const handleSelectSuitcase = (id: string) => {
    navigate(`/suitcase/${id}`);
  };

  const handleCreateSuitcase = async (data: any) => {
    try {
      await createSuitcase(data);
      setIsDialogOpen(false);
      toast({
        title: "Valise créée",
        description: "Votre valise a été créée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la valise",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (status: string) => {
    applyFilters({ 
      ...filters, 
      status: status as SuitcaseStatus | 'all' 
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Mes Valises</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Valise
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher une valise..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={handleClearSearch}
            >
              &times;
            </button>
          )}
        </div>
        <SuitcaseFilters 
          filters={{
            status: filters.status,
            search: filters.search,
            date: null // Adding null date to satisfy the type
          }}
          statusLabels={{
            all: 'Toutes',
            active: 'Actives',
            archived: 'Archivées',
            completed: 'Terminées'
          }}
          onStatusChange={handleStatusChange}
          onClearSearch={handleClearSearch}
        />
        <div className="flex items-center">
          <SuitcaseViewToggle 
            currentView={viewMode} 
            onChangeView={setViewMode} 
          />
        </div>
      </div>

      <Card className="p-6">
        {loading ? (
          <LoadingSuitcases />
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Erreur lors du chargement des valises
          </div>
        ) : filteredSuitcases.length === 0 ? (
          <EmptySuitcases onCreateClick={() => setIsDialogOpen(true)} />
        ) : (
          // Converting types to match the component's expected types
          <SuitcaseGrid
            suitcases={filteredSuitcases as any} 
            onSelectSuitcase={handleSelectSuitcase}
          />
        )}
      </Card>

      <CreateSuitcaseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateSuitcase}
      />
    </div>
  );
};

export default Suitcases;
