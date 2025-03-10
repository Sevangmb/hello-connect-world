
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { AlertCircle, Database, HardDrive, Network, RefreshCw, Shield, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface UsageStat {
  name: string;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
  icon: React.ReactNode;
}

const AdminDatabase: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  const { data: usageStats, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['database-usage'],
    queryFn: async () => {
      try {
        // Dans une application réelle, nous récupérerions ces données via l'API Supabase Admin
        // Pour l'instant, nous allons simuler les données basées sur les valeurs fournies
        
        const mockStats: UsageStat[] = [
          {
            name: 'Egress',
            current: 16.465,
            limit: 5,
            unit: 'GB',
            percentage: 329,
            icon: <Network className="h-5 w-5 text-primary" />
          },
          {
            name: 'Database Size',
            current: 0.077,
            limit: 0.5,
            unit: 'GB',
            percentage: 15,
            icon: <Database className="h-5 w-5 text-primary" />
          },
          {
            name: 'Storage Size',
            current: 0.013,
            limit: 1,
            unit: 'GB',
            percentage: 1,
            icon: <HardDrive className="h-5 w-5 text-primary" />
          },
          {
            name: 'Realtime Concurrent Peak Connections',
            current: 2,
            limit: 200,
            unit: '',
            percentage: 1,
            icon: <Network className="h-5 w-5 text-primary" />
          },
          {
            name: 'Realtime Messages',
            current: 19554,
            limit: 2000000,
            unit: '',
            percentage: 1,
            icon: <RefreshCw className="h-5 w-5 text-primary" />
          },
          {
            name: 'Edge Function Invocations',
            current: 1244,
            limit: 500000,
            unit: '',
            percentage: 1,
            icon: <RefreshCw className="h-5 w-5 text-primary" />
          },
          {
            name: 'Monthly Active Users',
            current: 7,
            limit: 50000,
            unit: 'MAU',
            percentage: 1,
            icon: <Users className="h-5 w-5 text-primary" />
          },
          {
            name: 'Monthly Active Third-Party Users',
            current: 0,
            limit: 50,
            unit: 'MAU',
            percentage: 0,
            icon: <Users className="h-5 w-5 text-primary" />
          }
        ];
        
        return mockStats;
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques d'utilisation:", err);
        throw new Error("Impossible de récupérer les statistiques d'utilisation");
      }
    },
    retry: 2,
    refetchOnWindowFocus: false
  });
  
  const handleRefresh = () => {
    refetch();
    setLastRefresh(new Date());
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-primary';
  };
  
  // Rendu pour l'état de chargement
  if (isLoading) {
    return (
      <ModuleGuard moduleCode="admin">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Statistiques de base de données</h1>
          </div>
          <Card className="w-full">
            <CardContent className="py-10">
              <div className="flex flex-col items-center justify-center w-full">
                <LoadingSpinner size="lg" className="mb-4" />
                <p className="text-muted-foreground">Chargement des statistiques d'utilisation...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModuleGuard>
    );
  }
  
  return (
    <ModuleGuard moduleCode="admin">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Statistiques de base de données</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Dernière mise à jour : {lastRefresh.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
        
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur s'est produite lors de la récupération des données d'utilisation.
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Utilisation de Supabase</CardTitle>
            <CardDescription>
              Résumé de l'utilisation actuelle par rapport aux limites du plan gratuit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usageStats?.some(stat => stat.percentage >= 100) && (
              <Alert variant="default" className="mb-4 border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>
                  Vous avez dépassé votre quota du plan gratuit dans ce cycle de facturation. 
                  Mettez à niveau votre plan pour continuer à utiliser Supabase sans restrictions.
                </AlertDescription>
              </Alert>
            )}
            
            {usageStats && usageStats.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ressource</TableHead>
                    <TableHead>Utilisation actuelle</TableHead>
                    <TableHead>Limite</TableHead>
                    <TableHead>Pourcentage</TableHead>
                    <TableHead>Progression</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {stat.icon}
                          {stat.name}
                        </div>
                      </TableCell>
                      <TableCell>{stat.current.toLocaleString()} {stat.unit}</TableCell>
                      <TableCell>{stat.limit.toLocaleString()} {stat.unit}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stat.percentage >= 100 ? 'bg-destructive/20 text-destructive' : 
                            stat.percentage >= 80 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400' : 
                            'bg-primary/20 text-primary'
                          }`}
                        >
                          {stat.percentage}%
                        </span>
                      </TableCell>
                      <TableCell className="w-[30%]">
                        <Progress 
                          value={Math.min(stat.percentage, 100)} 
                          max={100}
                          className={`h-2 ${getProgressColor(stat.percentage)}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : !isLoading && !isError ? (
              <div className="py-8 text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune donnée d'utilisation disponible</h3>
                <p className="text-muted-foreground">Les statistiques d'utilisation ne sont pas disponibles pour le moment.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </ModuleGuard>
  );
};

export default AdminDatabase;
