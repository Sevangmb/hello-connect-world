
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate search results
    setTimeout(() => {
      setSearchResults([
        { id: 1, type: 'clothing', name: 'T-shirt bleu', image: '/placeholder.svg' },
        { id: 2, type: 'outfit', name: 'Tenue d\'été', image: '/placeholder.svg' },
        { id: 3, type: 'profile', name: 'Jean Dupont', image: '/placeholder.svg' }
      ]);
      setIsSearching(false);
    }, 500);
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recherche</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des vêtements, des tenues, des défis..."
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <SearchIcon className="h-4 w-4 mr-2" />
            )}
            {isSearching ? 'Recherche...' : 'Rechercher'}
          </Button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg mb-3">Filtres</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Types</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Vêtements
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Tenues
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Utilisateurs
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Défis
                  </label>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveFilters({})}
                className="w-full"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-lg mb-3">Résultats</h2>
            
            {isSearching ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(result => (
                  <div key={result.id} className="border rounded-lg overflow-hidden">
                    <div className="h-40 bg-gray-200">
                      <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="text-xs uppercase text-gray-500 mb-1">{result.type}</div>
                      <h3 className="font-medium">{result.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-10 text-gray-500">
                Aucun résultat trouvé pour "{searchQuery}"
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Entrez une recherche pour afficher les résultats
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
