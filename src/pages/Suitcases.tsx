
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuitcases } from '../hooks/useSuitcases';
import { SuitcaseGrid } from '../components/suitcases/components/SuitcaseGrid';
import { SuitcaseList } from '../components/suitcases/components/SuitcaseList';
import { SuitcaseViewToggle } from '../components/suitcases/components/SuitcaseViewToggle';
import { SuitcaseSearchBar } from '../components/suitcases/components/SuitcaseSearchBar';
import { CreateSuitcaseDialog } from '../components/suitcases/components/CreateSuitcaseDialog';
import { EmptySuitcases } from '../components/suitcases/components/EmptySuitcases';
import { LoadingSuitcases } from '../components/suitcases/components/LoadingSuitcases';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { CreateSuitcaseData, SuitcaseFilter, SuitcaseStatus } from '../components/suitcases/types';

const Suitcases = () => {
  const navigate = useNavigate();
  const { suitcases, isLoading, error, createSuitcase, updateSuitcase, deleteSuitcase } = useSuitcases();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterValues, setFilterValues] = useState<SuitcaseFilter>({
    status: 'all',
    search: '',
    sortBy: 'date'
  });

  const handleStatusFilterChange = (status: string) => {
    setFilterValues(prev => ({
      ...prev,
      status: status as SuitcaseStatus | 'all'
    }));
  };

  const handleSearchChange = (search: string) => {
    setFilterValues(prev => ({ ...prev, search }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilterValues(prev => ({
      ...prev, 
      sortBy: sortBy as 'date' | 'name' | 'status'
    }));
  };

  const handleCreateSuitcase = (data: CreateSuitcaseData) => {
    createSuitcase.mutate(data, {
      onSuccess: (newSuitcase) => {
        setIsDialogOpen(false);
        // Rediriger vers la page de détail de la valise
        navigate(`/suitcases/${newSuitcase.id}`);
      }
    });
  };

  // Filtrer les valises en fonction des critères
  const filteredSuitcases = suitcases.filter(suitcase => {
    // Filtre par statut
    if (filterValues.status !== 'all' && suitcase.status !== filterValues.status) {
      return false;
    }
    
    // Filtre par recherche
    if (filterValues.search && !suitcase.name.toLowerCase().includes(filterValues.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Trier les valises
  const sortedSuitcases = [...filteredSuitcases].sort((a, b) => {
    if (filterValues.sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (filterValues.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (filterValues.sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Valises</h1>
          <p className="text-muted-foreground">
            Organisez vos vêtements pour chaque voyage
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle valise
        </Button>
      </div>

      {/* Filtres et barre de recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SuitcaseSearchBar 
          value={filterValues.search || ''} 
          onChange={handleSearchChange} 
        />
        <div className="flex gap-4">
          <div>
            {/* Composant SuitcaseFilters remplacé par une interface compatible */}
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select 
              value={filterValues.status}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-3 py-2 border rounded-md w-full"
            >
              <option value="all">Tous</option>
              <option value="active">Actives</option>
              <option value="completed">Terminées</option>
              <option value="archived">Archivées</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trier par</label>
            <select 
              value={filterValues.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border rounded-md w-full"
            >
              <option value="date">Date</option>
              <option value="name">Nom</option>
              <option value="status">Statut</option>
            </select>
          </div>
          <SuitcaseViewToggle 
            viewMode={viewMode} 
            onChange={(mode) => setViewMode(mode)} 
          />
        </div>
      </div>

      {/* Contenu principal */}
      {isLoading ? (
        <LoadingSuitcases />
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600">{error.message}</p>
        </div>
      ) : sortedSuitcases.length === 0 ? (
        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <div className="mx-auto w-16 h-16 mb-4 text-muted-foreground">
            {/* Icône de valise vide */}
          </div>
          <h3 className="text-lg font-medium mb-2">Aucune valise trouvée</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {(filterValues.status !== 'all' || filterValues.search !== '') 
              ? "Aucune valise ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
              : "Vous n'avez pas encore créé de valise. Commencez par en créer une pour organiser vos vêtements de voyage."}
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer une valise
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <SuitcaseGrid 
          suitcases={sortedSuitcases} 
          onEdit={(id) => navigate(`/suitcases/${id}`)}
          onDelete={(id) => deleteSuitcase.mutate(id)}
        />
      ) : (
        <SuitcaseList 
          suitcases={sortedSuitcases} 
          onEdit={(id) => navigate(`/suitcases/${id}`)}
          onDelete={(id) => deleteSuitcase.mutate(id)}
        />
      )}

      {/* Dialog de création de valise */}
      <CreateSuitcaseDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateSuitcase}
        isLoading={createSuitcase.isPending}
      />
    </div>
  );
};

export default Suitcases;
