
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShopById } from '@/hooks/useShop';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const { shop, loading, error, fetchShop } = useShopById();
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      fetchShop(id);
      checkIfFavorited(id);
    }
  }, [id]);
  
  const checkIfFavorited = async (shopId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('favorite_shops')
        .select('*')
        .eq('shop_id', shopId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setIsFavorited(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };
  
  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Non connecté',
          description: 'Veuillez vous connecter pour ajouter une boutique aux favoris',
          variant: 'destructive'
        });
        return;
      }
      
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_shops')
          .delete()
          .eq('shop_id', id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setIsFavorited(false);
        toast({
          title: 'Boutique retirée des favoris',
          description: `${shop?.name} a été retirée de vos favoris`
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_shops')
          .insert({
            shop_id: id,
            user_id: user.id
          });
        
        if (error) throw error;
        
        setIsFavorited(true);
        toast({
          title: 'Boutique ajoutée aux favoris',
          description: `${shop?.name} a été ajoutée à vos favoris`
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive'
      });
    }
  };
  
  if (loading) {
    return <div>Chargement de la boutique...</div>;
  }
  
  if (error || !shop) {
    return <div>Erreur lors du chargement de la boutique</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Shop Info */}
        <div className="w-full md:w-1/3">
          <div className="rounded-lg overflow-hidden bg-white shadow-md">
            <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="p-6">
              <div className="flex justify-between">
                <h1 className="text-2xl font-bold">{shop.name}</h1>
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  size="icon"
                  onClick={toggleFavorite}
                >
                  <Heart className={isFavorited ? "fill-current" : ""} />
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                {shop.description}
              </div>
              
              {shop.address && (
                <div className="mt-4">
                  <h3 className="font-semibold">Adresse</h3>
                  <p className="text-sm">{shop.address}</p>
                </div>
              )}
              
              {shop.phone && (
                <div className="mt-2">
                  <h3 className="font-semibold">Téléphone</h3>
                  <p className="text-sm">{shop.phone}</p>
                </div>
              )}
              
              {shop.website && (
                <div className="mt-2">
                  <h3 className="font-semibold">Site web</h3>
                  <a href={shop.website} className="text-sm text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    {shop.website}
                  </a>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="font-semibold">Catégories</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {shop.categories?.map(category => (
                    <span key={category} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shop Items */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-bold mb-4">Articles de la boutique</h2>
          {/* Shop items will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Map through shop items */}
          </div>
        </div>
      </div>
    </div>
  );
}
