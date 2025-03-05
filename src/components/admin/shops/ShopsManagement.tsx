
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Trash2, X, Eye, Search, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { shopApiGateway } from '@/services/api-gateway/ShopApiGateway';
import { Shop, ShopStatus } from '@/core/shop/domain/types';

export function ShopsManagement() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    fetchShops();
  }, [filterStatus]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const shopsData = await shopApiGateway.getAllShops(filterStatus);
      setShops(shopsData);
    } catch (error: any) {
      console.error('Error fetching shops:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les boutiques',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (shopId: string, newStatus: ShopStatus) => {
    try {
      await shopApiGateway.updateShop(shopId, { status: newStatus });
      
      // Mettre à jour la liste localement
      setShops(shops.map(shop => 
        shop.id === shopId ? { ...shop, status: newStatus } : shop
      ));

      toast({
        title: 'Statut mis à jour',
        description: `La boutique a été ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}`,
        variant: newStatus === 'approved' ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error updating shop status:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
      });
    }
  };

  const handleDeleteShop = async (shopId: string) => {
    try {
      await shopApiGateway.updateShop(shopId, { status: 'suspended' });
      setShops(shops.filter(shop => shop.id !== shopId));
      
      toast({
        title: 'Boutique supprimée',
        description: 'La boutique a été supprimée avec succès',
      });
    } catch (error) {
      console.error('Error deleting shop:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer la boutique',
      });
    }
  };

  const filteredShops = searchTerm 
    ? shops.filter(shop => 
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.id.includes(searchTerm)
      )
    : shops;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle>Gestion des boutiques</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {filterStatus 
                  ? `Statut: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}` 
                  : "Tous les statuts"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                <DropdownMenuRadioItem value={undefined}>Tous</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">En attente</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="approved">Approuvées</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rejected">Rejetées</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="suspended">Suspendues</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" onClick={fetchShops} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Cette page permet aux administrateurs de visualiser et gérer les boutiques, d'approuver ou rejeter les demandes, et d'inspecter les détails de chaque boutique.</p>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Propriétaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredShops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune boutique trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredShops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell>{shop.name}</TableCell>
                  <TableCell>
                    {shop.profiles?.username || shop.profiles?.full_name || "Utilisateur inconnu"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        shop.status === "approved"
                          ? "default"
                          : shop.status === "rejected"
                          ? "destructive"
                          : shop.status === "suspended"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {shop.status === "approved"
                        ? "Approuvée"
                        : shop.status === "rejected"
                        ? "Rejetée"
                        : shop.status === "suspended"
                        ? "Suspendue"
                        : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(shop.created_at), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log('View shop details', shop.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {shop.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                          onClick={() => handleStatusChange(shop.id, "approved")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                          onClick={() => handleStatusChange(shop.id, "rejected")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette boutique ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteShop(shop.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
