
import React from "react";
import { ArrowUpRight, ChevronRight, Users, ShoppingBag, CreditCard, Activity, Eye, TrendingUp, UserCheck, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend?: number;
  icon?: React.ReactNode;
  loading?: boolean;
}

const StatCard = ({ title, value, description, trend = 0, icon, loading = false }: StatCardProps) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        {icon || <Activity className="h-4 w-4" />}
      </div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="h-8 bg-muted animate-pulse rounded" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
    {!loading && trend !== 0 && (
      <CardFooter className="pt-1 pb-2 px-4">
        <Badge variant={trend > 0 ? "default" : "destructive"} className="px-1 py-0 h-5">
          <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
          <span>{Math.abs(trend)}%</span>
        </Badge>
        <span className="text-xs text-muted-foreground ml-2">vs mois précédent</span>
      </CardFooter>
    )}
  </Card>
);

const RecentActivity = () => (
  <div className="space-y-5">
    <div className="flex items-center">
      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <UserCheck className="h-5 w-5" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">Nouvel utilisateur inscrit</p>
        <p className="text-xs text-muted-foreground">Il y a 5 minutes</p>
      </div>
    </div>
    <div className="flex items-center">
      <div className="h-9 w-9 rounded-full bg-accent/10 text-accent flex items-center justify-center">
        <ShoppingBag className="h-5 w-5" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">Nouvelle vente sur la boutique Élégance</p>
        <p className="text-xs text-muted-foreground">Il y a 12 minutes</p>
      </div>
    </div>
    <div className="flex items-center">
      <div className="h-9 w-9 rounded-full bg-info/10 text-info flex items-center justify-center">
        <Calendar className="h-5 w-5" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">Nouveau défi créé: "Mode Automne"</p>
        <p className="text-xs text-muted-foreground">Il y a 30 minutes</p>
      </div>
    </div>
  </div>
);

const ModernAdminDashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenue sur votre tableau de bord administratif.</p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button variant="outline" size="sm">
            Télécharger les rapports
          </Button>
          <Button size="sm">
            Rapport complet
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground flex items-center">
            <span>Mise à jour il y a 5 minutes</span>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Statistiques principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Utilisateurs actifs" 
              value="2,420" 
              description="Utilisateurs actifs aujourd'hui"
              trend={12}
              icon={<Users className="h-4 w-4" />}
            />
            <StatCard 
              title="Boutiques" 
              value="48" 
              description="Boutiques partenaires actives"
              trend={4}
              icon={<ShoppingBag className="h-4 w-4" />}
            />
            <StatCard 
              title="Revenus" 
              value="€9,240" 
              description="Revenus du mois actuel"
              trend={-2}
              icon={<CreditCard className="h-4 w-4" />}
            />
            <StatCard 
              title="Vues" 
              value="12.5k" 
              description="Pages vues aujourd'hui"
              trend={8}
              icon={<Eye className="h-4 w-4" />}
            />
          </div>
          
          {/* Contenu additionnel */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance hebdomadaire</CardTitle>
                <CardDescription>
                  Tendances des utilisateurs et des ventes
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  [Graphique de performance]
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Dernières actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  <span>Voir toutes les activités</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Tâches et actions rapides */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Modules actifs</CardTitle>
                <CardDescription>État des modules système</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social</span>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Actif
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Boutique</span>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Actif
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IA Recommandations</span>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      Dégradé
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">OCR (Scan étiquettes)</span>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Actif
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <span>Gérer les modules</span>
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Accès direct aux fonctions principales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-xs">Gérer les utilisateurs</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <ShoppingBag className="h-5 w-5 mb-1" />
                    <span className="text-xs">Gérer les boutiques</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span className="text-xs">Voir les transactions</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Eye className="h-5 w-5 mb-1" />
                    <span className="text-xs">Voir les rapports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques</CardTitle>
              <CardDescription>
                Données détaillées sur l'utilisation de la plateforme.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                [Contenu des analytiques]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
              <CardDescription>
                Génération et gestion des rapports administratifs.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                [Contenu des rapports]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModernAdminDashboard;
