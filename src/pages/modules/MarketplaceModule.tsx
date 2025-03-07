
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Tag, CreditCard } from 'lucide-react';

const MarketplaceModule = () => {
  const navigate = useNavigate();
  
  return (
    <ModuleGuard moduleCode="marketplace">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Module Vide-Dressing</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Vide-Dressing
              </CardTitle>
              <CardDescription>Explorez les articles à vendre</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Parcourez les vêtements mis en vente par la communauté.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/marketplace')}
              >
                Explorer
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Vendre
              </CardTitle>
              <CardDescription>Mettez vos articles en vente</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Créez des annonces pour vendre vos vêtements que vous ne portez plus.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/marketplace/sell')}
              >
                Mettre en vente
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Mes Achats
              </CardTitle>
              <CardDescription>Suivez vos transactions</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Consultez l'historique de vos achats et ventes.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/marketplace/purchases')}
              >
                Voir mes achats
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleGuard>
  );
};

export default MarketplaceModule;
