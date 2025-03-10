
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Settings, Store, Package, BarChart, FileText, Mail, Database } from 'lucide-react';
import { eventBus } from '@/core/event-bus/EventBus';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';

const AdminModule = () => {
  const navigate = useNavigate();
  
  // Activer explicitement l'accès admin lors de l'accès à ce module
  useEffect(() => {
    moduleMenuCoordinator.enableAdminAccess();
    
    // Notifier que le module admin a été ouvert
    eventBus.publish('admin:module-opened', {
      timestamp: Date.now()
    });
    
    return () => {
      // Ne pas désactiver l'accès admin à la sortie du module
      // Cela sera géré par la vérification d'authentification
    };
  }, []);
  
  const adminCards = [
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      description: "Vue d'ensemble de l'application",
      text: 'Consultez les métriques et les statistiques de l\'application.',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      description: 'Gestion des utilisateurs',
      text: 'Gérez les comptes utilisateurs et leurs permissions.',
      path: '/admin/users',
      icon: <Users className="h-5 w-5 mr-2" />
    },
    {
      id: 'modules',
      title: 'Modules',
      description: 'Configuration des modules',
      text: 'Activez ou désactivez les modules de l\'application.',
      path: '/admin/modules',
      icon: <Package className="h-5 w-5 mr-2" />
    },
    {
      id: 'database',
      title: 'Base de données',
      description: 'Statistiques Supabase',
      text: 'Consultez les statistiques d\'utilisation de la base de données Supabase.',
      path: '/admin/database',
      icon: <Database className="h-5 w-5 mr-2" />
    },
    {
      id: 'shops',
      title: 'Boutiques',
      description: 'Gestion des boutiques',
      text: 'Administrez les boutiques partenaires et leurs produits.',
      path: '/admin/shops',
      icon: <Store className="h-5 w-5 mr-2" />
    },
    {
      id: 'content',
      title: 'Contenu',
      description: 'Gestion du contenu',
      text: 'Gérez le contenu, les pages et les challenges.',
      path: '/admin/content',
      icon: <FileText className="h-5 w-5 mr-2" />
    },
    {
      id: 'stats',
      title: 'Statistiques',
      description: 'Analyses et indicateurs',
      text: 'Consultez les statistiques détaillées de l\'application.',
      path: '/admin/stats',
      icon: <BarChart className="h-5 w-5 mr-2" />
    },
    {
      id: 'campaigns',
      title: 'Campagnes',
      description: 'Marketing et newsletters',
      text: 'Gérez les campagnes marketing et les newsletters.',
      path: '/admin/campaigns',
      icon: <Mail className="h-5 w-5 mr-2" />
    },
    {
      id: 'settings',
      title: 'Configuration',
      description: 'Paramètres du système',
      text: 'Configurez les paramètres généraux de l\'application.',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5 mr-2" />
    }
  ];
  
  const handleNavigate = (path: string) => {
    navigate(path);
    eventBus.publish('admin:navigation', {
      path,
      timestamp: Date.now()
    });
  };
  
  return (
    <ModuleGuard moduleCode="admin">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Module Administration</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map(card => (
            <Card key={card.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {card.icon}
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-4">{card.text}</p>
                <Button 
                  className="w-full mt-auto" 
                  onClick={() => handleNavigate(card.path)}
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ModuleGuard>
  );
};

export default AdminModule;
