
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, ShoppingBag, Map } from 'lucide-react';

const ShopModule = () => {
  const navigate = useNavigate();
  
  return (
    <ModuleGuard moduleCode="shop">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Module Boutique</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Boutiques
              </CardTitle>
              <CardDescription>Découvrez nos boutiques partenaires</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Explorez les boutiques partenaires et leurs collections.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/boutiques')}
              >
                Voir les boutiques
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Carte des boutiques
              </CardTitle>
              <CardDescription>Localisez les boutiques près de chez vous</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Trouvez les boutiques partenaires les plus proches sur la carte.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/boutiques/map')}
              >
                Ouvrir la carte
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Panier
              </CardTitle>
              <CardDescription>Gérez vos achats</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Consultez votre panier et finalisez vos achats.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/cart')}
              >
                Voir mon panier
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleGuard>
  );
};

export default ShopModule;
