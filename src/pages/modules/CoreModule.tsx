
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CoreModule = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Module de base</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentification</CardTitle>
            <CardDescription>Gérer les connexions et inscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Le module de base contient les fonctionnalités essentielles au fonctionnement de l'application.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profil utilisateur</CardTitle>
            <CardDescription>Gérer les informations de profil</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Permet aux utilisateurs de gérer leurs informations personnelles et préférences.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoreModule;
