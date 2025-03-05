
import React, { useState } from 'react';
import { ShopItem } from '@/core/shop/domain/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';

interface ShopItemsListProps {
  items: ShopItem[];
  onEdit: (item: ShopItem) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

interface FilterState {
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

export const ShopItemsList: React.FC<ShopItemsListProps> = ({
  items,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({});

  const applyFilters = (items: ShopItem[]): ShopItem[] => {
    return items.filter(item => {
      // Apply search
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && 
          !item.description?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      // Apply price filters
      if (filters.minPrice && item.price < filters.minPrice) return false;
      if (filters.maxPrice && item.price > filters.maxPrice) return false;
      
      return true;
    });
  };

  const sortItems = (items: ShopItem[]): ShopItem[] => {
    return [...items].sort((a, b) => {
      if (!filters.sort) return 0;
      
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  // Implement a handler that updates the FilterState
  const handleFilterChange = (newFilter: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilter }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default">Disponible</Badge>;
      case 'sold_out':
        return <Badge variant="secondary">Épuisé</Badge>;
      case 'archived':
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredItems = sortItems(applyFilters(items));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles ({filteredItems.length})</CardTitle>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          
          <Select 
            onValueChange={(value) => handleFilterChange({ sort: value })}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="name-asc">Nom A-Z</SelectItem>
              <SelectItem value="name-desc">Nom Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Input
            type="number"
            placeholder="Prix min"
            onChange={(e) => handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="max-w-[120px]"
          />
          <Input
            type="number"
            placeholder="Prix max"
            onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="max-w-[120px]"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <p className="text-center py-4">Chargement des articles...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center py-4">Aucun article trouvé.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{formatPrice(item.price)}</span>
                        {item.original_price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(item.original_price)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
