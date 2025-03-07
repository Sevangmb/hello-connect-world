
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleGuard } from '@/components/modules/ModuleGuard';

const WardrobeModule = () => {
  return (
    <ModuleGuard moduleCode="wardrobe">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Module Garde-robe</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ma Garde-robe</CardTitle>
              <CardDescription>Gérer vos vêtements</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Ajoutez, modifiez et organisez vos vêtements dans votre garde-robe virtuelle.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mes Tenues</CardTitle>
              <CardDescription>Créez et gérez vos tenues</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Combinez vos vêtements pour créer des tenues complètes et les sauvegarder.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mes Valises</CardTitle>
              <CardDescription>Préparez vos voyages</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Créez des valises pour vos voyages en sélectionnant les vêtements à emporter.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleGuard>
  );
};

export default WardrobeModule;
