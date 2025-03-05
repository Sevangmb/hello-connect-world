
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShop } from '@/hooks/useShop';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShopItems } from '@/components/shop/ShopItems';
import { Loader2, Heart, MapPin, Phone, Globe, Star } from 'lucide-react';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getShopById, favoriteShop, isFavorited, checkIfFavorited } = useShop();
  const { toast } = useToast();
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const shopData = await getShopById(id);
        setShop(shopData);
        
        // Check if shop is favorited
        const favorited = await checkIfFavorited(id);
        setIsFavorite(favorited);
      } catch (error) {
        console.error('Error fetching shop:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les détails de la boutique',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchShop();
  }, [id, getShopById, checkIfFavorited, toast]);

  const handleFavorite = async () => {
    if (!id) return;
    
    setFavoriteLoading(true);
    try {
      const newStatus = !isFavorite;
      await favoriteShop(id, newStatus);
      setIsFavorite(newStatus);
      
      toast({
        title: newStatus ? 'Boutique ajoutée aux favoris' : 'Boutique retirée des favoris',
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-2">Boutique non trouvée</h2>
        <p className="text-muted-foreground">Cette boutique n'existe pas ou a été supprimée.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-md">
              <AvatarImage src={shop.image_url} alt={shop.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {shop.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{shop.name}</h1>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{shop.average_rating || '0'}/5</span>
                    <span className="mx-1">•</span>
                    <span>{shop.rating_count || '0'} avis</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                >
                  {favoriteLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      {isFavorite ? 'Favoris' : 'Ajouter aux favoris'}
                    </>
                  )}
                </Button>
              </div>
              
              <p className="mt-4 text-muted-foreground">{shop.description}</p>
              
              <div className="mt-4 space-y-2">
                {shop.address && (
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{shop.address}</span>
                  </div>
                )}
                
                {shop.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{shop.phone}</span>
                  </div>
                )}
                
                {shop.website && (
                  <div className="flex items-center text-sm">
                    <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                    <a 
                      href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {shop.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="items">Articles</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <ShopItems shopId={shop.id} />
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Avis clients</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Reviews content here */}
              <p className="text-muted-foreground">Aucun avis pour le moment.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informations sur la boutique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">À propos</h3>
                <p className="text-muted-foreground">{shop.description || 'Aucune description disponible.'}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Méthodes de paiement acceptées</h3>
                <p className="text-muted-foreground">Carte bancaire, PayPal</p>
              </div>
              
              <div>
                <h3 className="font-medium">Options de livraison</h3>
                <p className="text-muted-foreground">Livraison, Retrait en magasin</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDetail;
