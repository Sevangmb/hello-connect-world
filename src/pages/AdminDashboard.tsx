import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [activeShopsCount, setActiveShopsCount] = useState(0);
  const [salesData, setSalesData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  // Utilisateurs metrics
  const [activeUsers, setActiveUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);
  const [retentionRate, setRetentionRate] = useState(0);
  const [churnRate, setChurnRate] = useState(0);
  const [avgSessionDuration, setAvgSessionDuration] = useState(0);
  const [demographicDistribution, setDemographicDistribution] = useState("N/A");
  const [premiumUsers, setPremiumUsers] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);

  // Engagement et Activité metrics
  const [outfitsCreated, setOutfitsCreated] = useState(0);
  const [looksShared, setLooksShared] = useState(0);
  const [votesCount, setVotesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [challengesCreated, setChallengesCreated] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [privateMessagesCount, setPrivateMessagesCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [productPageViews, setProductPageViews] = useState(0);
  const [wishlistAdds, setWishlistAdds] = useState(0);
  const [contentShares, setContentShares] = useState(0);

  // Vide-Dressing metrics
  const [itemsForSale, setItemsForSale] = useState(0);
  const [soldItems, setSoldItems] = useState(0);
  const [transactionVolume, setTransactionVolume] = useState(0);
  const [averageSalePrice, setAverageSalePrice] = useState(0);
  const [saleConversionRate, setSaleConversionRate] = useState(0);
  const [openDisputes, setOpenDisputes] = useState(0);
  const [resolvedDisputes, setResolvedDisputes] = useState(0);

  // Boutiques Locales metrics
  const [registeredShops, setRegisteredShops] = useState(0);
  const [itemsOnline, setItemsOnline] = useState(0);
  const [shopViewCount, setShopViewCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);
  const [shopMessages, setShopMessages] = useState(0);
  const [clickAndCollectCount, setClickAndCollectCount] = useState(0);
  const [itemReservations, setItemReservations] = useState(0);
  const [appointmentBookings, setAppointmentBookings] = useState(0);
  const [storeConversionRate, setStoreConversionRate] = useState(0);

  // Revenus et Monétisation metrics
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueBreakdown, setRevenueBreakdown] = useState("N/A");
  const [MRR, setMRR] = useState(0);
  const [ARPU, setARPU] = useState(0);
  const [ARPPU, setARPPU] = useState(0);
  const [LTV, setLTV] = useState(0);

  // Performances Techniques metrics
  const [avgLoadingTime, setAvgLoadingTime] = useState(0);
  const [errorRate, setErrorRate] = useState(0);
  const [serverResourceUsage, setServerResourceUsage] = useState("N/A");
  const [concurrentUsers, setConcurrentUsers] = useState(0);

  // Marketing metrics
  const [CAC, setCAC] = useState(0);
  const [marketingROI, setMarketingROI] = useState(0);
  const [websiteTraffic, setWebsiteTraffic] = useState(0);
  const [campaignConversionRate, setCampaignConversionRate] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { count: shopCount } = await supabase
          .from('shops')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        const { data: salesRows, error: salesError } = await supabase
          .from('sales')
          .select('amount');
        let totalSales = 0;
        if (!salesError && salesRows) {
          totalSales = salesRows.reduce((acc: number, row: any) => acc + (row.amount || 0), 0);
        }
        setUsersCount(userCount || 0);
        setActiveShopsCount(shopCount || 0);
        setSalesData(totalSales);
        // TODO: Fetch additional metrics for Utilisateurs category
        setActiveUsers(0); // Replace with actual query for MAU
        setNewUsers(0); // Replace with new users count query
        setGrowthRate(0); // Replace with user growth rate query
        setRetentionRate(0); // Replace with retention rate query
        setChurnRate(0); // Replace with churn rate query
        setAvgSessionDuration(0); // Replace with average session duration query
        setDemographicDistribution("N/A"); // Replace with demographic distribution query
        setPremiumUsers(0); // Replace with premium users count query
        setConversionRate(0); // Replace with conversion rate query

        // TODO: Fetch metrics for Engagement et Activité
        setOutfitsCreated(0);
        setLooksShared(0);
        setVotesCount(0);
        setCommentsCount(0);
        setChallengesCreated(0);
        setChallengesCompleted(0);
        setPrivateMessagesCount(0);
        setReportsCount(0);
        setTimeSpent(0);
        setProductPageViews(0);
        setWishlistAdds(0);
        setContentShares(0);

        // TODO: Fetch metrics for Vide-Dressing
        setItemsForSale(0);
        setSoldItems(0);
        setTransactionVolume(0);
        setAverageSalePrice(0);
        setSaleConversionRate(0);
        setOpenDisputes(0);
        setResolvedDisputes(0);

        // TODO: Fetch metrics for Boutiques Locales
        setRegisteredShops(0);
        setItemsOnline(0);
        setShopViewCount(0);
        setFavoritesCount(0);
        setSubscriptionsCount(0);
        setShopMessages(0);
        setClickAndCollectCount(0);
        setItemReservations(0);
        setAppointmentBookings(0);
        setStoreConversionRate(0);

        // TODO: Fetch metrics for Revenus et Monétisation
        setTotalRevenue(0);
        setRevenueBreakdown("N/A");
        setMRR(0);
        setARPU(0);
        setARPPU(0);
        setLTV(0);

        // TODO: Fetch metrics for Performances Techniques
        setAvgLoadingTime(0);
        setErrorRate(0);
        setServerResourceUsage("N/A");
        setConcurrentUsers(0);

        // TODO: Fetch metrics for Marketing
        setCAC(0);
        setMarketingROI(0);
        setWebsiteTraffic(0);
        setCampaignConversionRate(0);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

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
              <TabsList>
                <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
                <TabsTrigger value="engagement">Engagement et Activité</TabsTrigger>
                <TabsTrigger value="vide-dressing">Vide-Dressing</TabsTrigger>
                <TabsTrigger value="boutiques">Boutiques Locales</TabsTrigger>
                <TabsTrigger value="revenus">Revenus et Monétisation</TabsTrigger>
                <TabsTrigger value="techniques">Performances Techniques</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
              <TabsContent value="utilisateurs">
                <h3 className="text-lg font-semibold mb-2">Utilisateurs</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Utilisateurs inscrits:</p>
                    <p className="font-bold">{usersCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Utilisateurs actifs (MAU):</p>
                    <p className="font-bold">{activeUsers}</p>
                  </div>
                  <div>
                    <p className="text-sm">Nouveaux utilisateurs:</p>
                    <p className="font-bold">{newUsers}</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de croissance:</p>
                    <p className="font-bold">{growthRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de rétention:</p>
                    <p className="font-bold">{retentionRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de churn:</p>
                    <p className="font-bold">{churnRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm">Durée moyenne des sessions:</p>
                    <p className="font-bold">{avgSessionDuration} min</p>
                  </div>
                  <div>
                    <p className="text-sm">Répartition démographique:</p>
                    <p className="font-bold">{demographicDistribution}</p>
                  </div>
                  <div>
                    <p className="text-sm">Utilisateurs Premium:</p>
                    <p className="font-bold">{premiumUsers}</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de conversion (Gratuits -&gt; Premium):</p>
                    <p className="font-bold">{conversionRate}%</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="engagement">
                <h3 className="text-lg font-semibold mb-2">Engagement et Activité</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Nombre de tenues créées:</p>
                    <p className="font-bold">{outfitsCreated}</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre de looks partagés:</p>
                    <p className="font-bold">{looksShared}</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre de votes (likes):</p>
                    <p className="font-bold">{votesCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre de commentaires:</p>
                    <p className="font-bold">{commentsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Défis créés:</p>
                    <p className="font-bold">{challengesCreated}</p>
                  </div>
                  <div>
                    <p className="text-sm">Défis complétés:</p>
                    <p className="font-bold">{challengesCompleted}</p>
                  </div>
                  <div>
                    <p className="text-sm">Messages envoyés (privé):</p>
                    <p className="font-bold">{privateMessagesCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Signalements effectués:</p>
                    <p className="font-bold">{reportsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Temps moyen passé par utilisateur:</p>
                    <p className="font-bold">{timeSpent} min</p>
                  </div>
                  <div>
                    <p className="text-sm">Vues des pages produit:</p>
                    <p className="font-bold">{productPageViews}</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre d'ajouts à la liste de souhaits:</p>
                    <p className="font-bold">{wishlistAdds}</p>
                  </div>
                  <div>
                    <p className="text-sm">Nombre de partages de contenu:</p>
                    <p className="font-bold">{contentShares}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="vide-dressing">
                <h3 className="text-lg font-semibold mb-2">Vide-Dressing</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Articles mis en vente:</p>
                    <p className="font-bold">{itemsForSale}</p>
                  </div>
                  <div>
                    <p className="text-sm">Articles vendus:</p>
                    <p className="font-bold">{soldItems}</p>
                  </div>
                  <div>
                    <p className="text-sm">Volume des transactions:</p>
                    <p className="font-bold">{transactionVolume}</p>
                  </div>
                  <div>
                    <p className="text-sm">Prix de vente moyen:</p>
                    <p className="font-bold">{averageSalePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de conversion (mis en vente -&gt; vendus):</p>
                    <p className="font-bold">{saleConversionRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm">Litiges ouverts:</p>
                    <p className="font-bold">{openDisputes}</p>
                  </div>
                  <div>
                    <p className="text-sm">Litiges résolus:</p>
                    <p className="font-bold">{resolvedDisputes}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="boutiques">
                <h3 className="text-lg font-semibold mb-2">Boutiques Locales</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Boutiques inscrites:</p>
                    <p className="font-bold">{registeredShops}</p>
                  </div>
                  <div>
                    <p className="text-sm">Boutiques actives:</p>
                    <p className="font-bold">{activeShopsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Articles en ligne:</p>
                    <p className="font-bold">{itemsOnline}</p>
                  </div>
                  <div>
                    <p className="text-sm">Vues des vitrines:</p>
                    <p className="font-bold">{shopViewCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Favoris:</p>
                    <p className="font-bold">{favoritesCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Abonnements:</p>
                    <p className="font-bold">{subscriptionsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Messages aux boutiques:</p>
                    <p className="font-bold">{shopMessages}</p>
                  </div>
                  <div>
                    <p className="text-sm">Click-and-collect:</p>
                    <p className="font-bold">{clickAndCollectCount}</p>
                  </div>
                  <div>
                    <p className="text-sm">Réservations d'article:</p>
                    <p className="font-bold">{itemReservations}</p>
                  </div>
                  <div>
                    <p className="text-sm">Prises de rendez-vous:</p>
                    <p className="font-bold">{appointmentBookings}</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de conversion (vitrine -&gt; magasin):</p>
                    <p className="font-bold">{storeConversionRate}%</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="revenus">
                <h3 className="text-lg font-semibold mb-2">Revenus et Monétisation</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Chiffre d'affaires total:</p>
                    <p className="font-bold">{totalRevenue}</p>
                  </div>
                  <div>
                    <p className="text-sm">Répartition du chiffre d'affaires:</p>
                    <p className="font-bold">{revenueBreakdown}</p>
                  </div>
                  <div>
                    <p className="text-sm">MRR:</p>
                    <p className="font-bold">{MRR}</p>
                  </div>
                  <div>
                    <p className="text-sm">ARPU:</p>
                    <p className="font-bold">{ARPU}</p>
                  </div>
                  <div>
                    <p className="text-sm">ARPPU:</p>
                    <p className="font-bold">{ARPPU}</p>
                  </div>
                  <div>
                    <p className="text-sm">LTV:</p>
                    <p className="font-bold">{LTV}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="techniques">
                <h3 className="text-lg font-semibold mb-2">Performances Techniques</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Temps de chargement moyen:</p>
                    <p className="font-bold">{avgLoadingTime} s</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux d'erreur/crash:</p>
                    <p className="font-bold">{errorRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm">Utilisation des ressources serveur:</p>
                    <p className="font-bold">{serverResourceUsage}</p>
                  </div>
                  <div>
                    <p className="text-sm">Utilisateurs simultanés:</p>
                    <p className="font-bold">{concurrentUsers}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="marketing">
                <h3 className="text-lg font-semibold mb-2">Marketing</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm">Coût d'acquisition client (CAC):</p>
                    <p className="font-bold">{CAC}</p>
                  </div>
                  <div>
                    <p className="text-sm">ROI des campagnes marketing:</p>
                    <p className="font-bold">{marketingROI}%</p>
                  </div>
                  <div>
                    <p className="text-sm">Trafic sur le site web:</p>
                    <p className="font-bold">{websiteTraffic}</p>
                  </div>
                  <div>
                    <p className="text-sm">Taux de conversion des campagnes:</p>
                    <p className="font-bold">{campaignConversionRate}%</p>
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