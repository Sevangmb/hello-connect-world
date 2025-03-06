import React, { useState, Suspense } from 'react';
import { useSuitcases } from '@/hooks/useSuitcases';
import { useAuth } from '@/hooks/useAuth';
import { SuitcaseGrid } from '@/components/suitcases/components/SuitcaseGrid';
import { LoadingState } from '@/components/ui/loading-state';
import { SuitcaseViewToggle } from '@/components/suitcases/components/SuitcaseViewToggle';
import { SuitcaseList } from '@/components/suitcases/components/SuitcaseList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Suitcases() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const { suitcases, loading, error, filters, applyFilters } = useSuitcases(user?.id || '');

  if (error) {
    return <div className="text-red-500">Une erreur est survenue.</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes valises</h1>
        <SuitcaseViewToggle currentView={view} onViewChange={setView} />
      </div>

      <Suspense fallback={<LoadingState />}>
        {loading ? (
          <LoadingState />
        ) : (
          <div className="animate-fade-in">
            {view === 'grid' ? (
              <SuitcaseGrid suitcases={suitcases} onSelect={(suitcase) => {}} />
            ) : (
              <SuitcaseList suitcases={suitcases} onSelect={(suitcase) => {}} />
            )}
          </div>
        )}
      </Suspense>
    </div>
  );
}
