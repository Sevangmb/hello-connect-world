
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Settings, Store } from 'lucide-react';

const AdminModule = () => {
  const navigate = useNavigate();
  
  return (
    <ModuleGuard moduleCode="admin">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Module Administration</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Tableau de bord
              </CardTitle>
              <CardDescription>Vue d'ensemble de l'application</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Consultez les métriques et les statistiques de l'application.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/admin/dashboard')}
              >
                Accéder au dashboard
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Utilisateurs
              </CardTitle>
              <CardDescription>Gestion des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Gérez les comptes utilisateurs et leurs permissions.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/admin/users')}
              >
                Gérer les utilisateurs
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Modules
              </CardTitle>
              <CardDescription>Configuration des modules</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Activez ou désactivez les modules de l'application.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/admin/modules')}
              >
                Gérer les modules
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Boutiques
              </CardTitle>
              <CardDescription>Gestion des boutiques</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Administrez les boutiques partenaires et leurs produits.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/admin/shops')}
              >
                Gérer les boutiques
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleGuard>
  );
};

export default AdminModule;
