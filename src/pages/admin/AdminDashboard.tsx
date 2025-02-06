import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";

export default function AdminDashboard() {
  const { metrics, loading } = useAdminMetrics();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de Bord</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <Tabs defaultValue="utilisateurs" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
                <TabsTrigger value="engagement">Engagement et Activité</TabsTrigger>
                <TabsTrigger value="vide-dressing">Vide-Dressing</TabsTrigger>
                <TabsTrigger value="boutiques">Boutiques Locales</TabsTrigger>
                <TabsTrigger value="revenus">Revenus et Monétisation</TabsTrigger>
                <TabsTrigger value="techniques">Performances Techniques</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>

              <TabsContent value="utilisateurs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Utilisateurs inscrits:</p>
                    <p className="text-2xl font-bold">{metrics.totalUsers}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Utilisateurs actifs (MAU):</p>
                    <p className="text-2xl font-bold">{metrics.activeUsers}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Nouveaux utilisateurs:</p>
                    <p className="text-2xl font-bold">{metrics.newUsers}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Taux de croissance:</p>
                    <p className="text-2xl font-bold">{metrics.growthRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Taux de rétention:</p>
                    <p className="text-2xl font-bold">{metrics.retentionRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Taux de churn:</p>
                    <p className="text-2xl font-bold">{metrics.churnRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Durée moyenne des sessions:</p>
                    <p className="text-2xl font-bold">{metrics.avgSessionDuration} min</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Répartition démographique:</p>
                    <p className="text-2xl font-bold">{metrics.demographicDistribution}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Utilisateurs Premium:</p>
                    <p className="text-2xl font-bold">{metrics.premiumUsers}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Taux de conversion (Gratuits {'->'} Premium):</p>
                    <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="engagement">
                <h3 className="text-lg font-semibold mb-2">Engagement et Activité</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Nombre de tenues créées:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre de looks partagés:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre de votes (likes):</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre de commentaires:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Défis créés:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Défis complétés:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Messages envoyés (privé):</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Signalements effectués:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Temps moyen passé par utilisateur:</p>
                    <p className="font-bold">0 min</p>
                  </div>
                  <div>
                    <p className="text-sm">Vues des pages produit:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre d'ajouts à la liste de souhaits:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre de partages de contenu:</p>
                    <p className="font-bold">0</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vide-dressing">
                <h3 className="text-lg font-semibold mb-2">Vide-Dressing</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Articles mis en vente:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Articles vendus:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Volume des transactions:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Prix de vente moyen:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de conversion (mis en vente {'->'} vendus):</p>
                    <p className="font-bold">0%</p>
                  </div>
                  <div>
                    <p className="text-sm">Litiges ouverts:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Litiges résolus:</p>
                    <p className="font-bold">0</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="boutiques">
                <h3 className="text-lg font-semibold mb-2">Boutiques Locales</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Boutiques inscrites:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Boutiques actives:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Articles en ligne:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Vues des vitrines:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Favoris:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Abonnements:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Messages aux boutiques:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Click-and-collect:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Réservations d'article:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Prises de rendez-vous:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de conversion (vitrine {'->'} magasin):</p>
                    <p className="font-bold">0%</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="revenus">
                <h3 className="text-lg font-semibold mb-2">Revenus et Monétisation</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Chiffre d'affaires total:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Répartition du chiffre d'affaires:</p>
                    <p className="font-bold">N/A</p>
                  </div>
                  <div>
                    <p className="text-sm">MRR:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">ARPU:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">ARPPU:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">LTV:</p>
                    <p className="font-bold">0</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="techniques">
                <h3 className="text-lg font-semibold mb-2">Performances Techniques</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Temps de chargement moyen:</p>
                    <p className="font-bold">0 s</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux d'erreur/crash:</p>
                    <p className="font-bold">0%</p>
                  </div>
                  <div>
                    <p className="text-sm">Utilisation des ressources serveur:</p>
                    <p className="font-bold">N/A</p>
                  </div>
                  <div>
                    <p className="text-sm">Utilisateurs simultanés:</p>
                    <p className="font-bold">0</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="marketing">
                <h3 className="text-lg font-semibold mb-2">Marketing</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Coût d'acquisition client (CAC):</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">ROI des campagnes marketing:</p>
                    <p className="font-bold">0%</p>
                  </div>
                  <div>
                    <p className="text-sm">Trafic sur le site web:</p>
                    <p className="font-bold">0</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de conversion des campagnes:</p>
                    <p className="font-bold">0%</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
