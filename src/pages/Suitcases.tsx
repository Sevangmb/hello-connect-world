
import React, { useState, Suspense, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTransitionState } from '@/hooks/useTransitionState';
import { useSuitcases } from '@/hooks/useSuitcases';
import { SuitcaseGrid } from '@/components/suitcases/components/SuitcaseGrid';
import { LoadingState } from '@/components/ui/loading-state';
import { SuitcaseViewToggle } from '@/components/suitcases/components/SuitcaseViewToggle';
import { SuitcaseList } from '@/components/suitcases/components/SuitcaseList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SuitcaseFilter } from '@/components/suitcases/types';
import { SUITCASE_STATUSES } from '@/components/suitcases/constants/status';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Suitcases() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState<SuitcaseFilter>({ status: 'active', search: '' });
  
  const {
    suitcases,
    isLoading,
    error,
    createSuitcase,
    updateSuitcase,
    deleteSuitcase
  } = useSuitcases(filters);
  
  // Utiliser notre hook d'animation de transition pour éviter les clignotements
  const isTransitioning = useTransitionState(isLoading);

  const handleViewChange = useCallback((newView: 'list' | 'grid') => {
    setView(newView);
  }, []);

  const handleFilterChange = useCallback((key: keyof SuitcaseFilter, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSuitcaseSelect = useCallback((suitcaseId: string) => {
    console.log('Suitcase selected:', suitcaseId);
    // Ajouter la navigation vers la page de détail de la valise
  }, []);

  const handleCreateSuitcase = useCallback(async (data: any) => {
    try {
      await createSuitcase.mutateAsync(data);
      toast({
        title: "Valise créée",
        description: "Votre nouvelle valise a été créée avec succès."
      });
      setCreateDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la valise."
      });
    }
  }, [createSuitcase, toast]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">Une erreur est survenue lors du chargement des valises.</div>
        <Button onClick={() => window.location.reload()}>Rafraîchir la page</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes valises</h1>
        <div className="flex space-x-2">
          <SuitcaseViewToggle 
            currentView={view} 
            onViewChange={handleViewChange} 
          />
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle valise
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Rechercher une valise..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="mb-2"
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(SUITCASE_STATUSES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Suspense fallback={<LoadingState count={8} layout={view} />}>
        {isTransitioning ? (
          <LoadingState count={8} layout={view} />
        ) : (
          <div className="animate-fade-in">
            {suitcases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-primary-foreground p-6 rounded-full mb-4">
                  <svg
                    className="h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Aucune valise trouvée</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {filters.status !== 'all' || filters.search
                    ? "Aucune valise ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                    : "Vous n'avez pas encore créé de valise. Commencez par en créer une pour organiser vos vêtements de voyage."}
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer ma première valise
                </Button>
              </div>
            ) : view === 'grid' ? (
              <SuitcaseGrid 
                suitcases={suitcases} 
                onSelect={(suitcase) => handleSuitcaseSelect(suitcase.id)}
                loading={loading}
              />
            ) : (
              <SuitcaseList 
                suitcases={suitcases} 
                onSelect={(suitcase) => handleSuitcaseSelect(suitcase.id)}
                loading={loading}
              />
            )}
          </div>
        )}
      </Suspense>

      {/* Dialog for creating a new suitcase would go here */}
    </div>
  );
}
