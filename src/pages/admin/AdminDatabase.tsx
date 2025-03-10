
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { AlertCircle, Database, HardDrive, Network, RefreshCw, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
  
  const { data: usageStats, isLoading, error, refetch } = useQuery({
    queryKey: ['database-usage'],
    queryFn: async () => {
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
    }
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
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur s'est produite lors de la récupération des données d'utilisation.
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
            <Alert variant="default" className="mb-4 border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                Vous avez dépassé votre quota du plan gratuit dans ce cycle de facturation. 
                Mettez à niveau votre plan pour continuer à utiliser Supabase sans restrictions.
              </AlertDescription>
            </Alert>
            
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
                {usageStats?.map((stat, index) => (
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
          </CardContent>
        </Card>
      </div>
    </ModuleGuard>
  );
};

export default AdminDatabase;
