import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import UtilisateursMetrics from "@/components/UtilisateursMetrics";
import EngagementMetrics from "@/components/EngagementMetrics";
import VideDressingMetrics from "@/components/VideDressingMetrics";
import BoutiquesMetrics from "@/components/BoutiquesMetrics";
import RevenusMetrics from "@/components/RevenusMetrics";
import TechniquesMetrics from "@/components/TechniquesMetrics";
import MarketingMetrics from "@/components/MarketingMetrics";

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
                <UtilisateursMetrics 
                  usersCount={usersCount} 
                  activeUsers={activeUsers}
                  newUsers={newUsers}
                  growthRate={growthRate}
                  retentionRate={retentionRate}
                  churnRate={churnRate}
                  avgSessionDuration={avgSessionDuration}
                  demographicDistribution={demographicDistribution}
                  premiumUsers={premiumUsers}
                  conversionRate={conversionRate}
                />
              </TabsContent>
              <TabsContent value="engagement">
                <EngagementMetrics 
                  outfitsCreated={outfitsCreated}
                  looksShared={looksShared}
                  votesCount={votesCount}
                  commentsCount={commentsCount}
                  challengesCreated={challengesCreated}
                  challengesCompleted={challengesCompleted}
                  privateMessagesCount={privateMessagesCount}
                  reportsCount={reportsCount}
                  timeSpent={timeSpent}
                  productPageViews={productPageViews}
                  wishlistAdds={wishlistAdds}
                  contentShares={contentShares}
                />
              </TabsContent>
              <TabsContent value="vide-dressing">
                <VideDressingMetrics 
                  itemsForSale={itemsForSale}
                  soldItems={soldItems}
                  transactionVolume={transactionVolume}
                  averageSalePrice={averageSalePrice}
                  saleConversionRate={saleConversionRate}
                  openDisputes={openDisputes}
                  resolvedDisputes={resolvedDisputes}
                />
              </TabsContent>
              <TabsContent value="boutiques">
                <BoutiquesMetrics 
                  activeShopsCount={activeShopsCount} 
                  registeredShops={registeredShops}
                  itemsOnline={itemsOnline}
                  shopViewCount={shopViewCount}
                  favoritesCount={favoritesCount}
                  subscriptionsCount={subscriptionsCount}
                  shopMessages={shopMessages}
                  clickAndCollectCount={clickAndCollectCount}
                  itemReservations={itemReservations}
                  appointmentBookings={appointmentBookings}
                  storeConversionRate={storeConversionRate}
                />
              </TabsContent>
              <TabsContent value="revenus">
                <RevenusMetrics 
                  totalRevenue={totalRevenue}
                  revenueBreakdown={revenueBreakdown}
                  MRR={MRR}
                  ARPU={ARPU}
                  ARPPU={ARPPU}
                  LTV={LTV}
                />
              </TabsContent>
              <TabsContent value="techniques">
                <TechniquesMetrics 
                  avgLoadingTime={avgLoadingTime}
                  errorRate={errorRate}
                  serverResourceUsage={serverResourceUsage}
                  concurrentUsers={concurrentUsers}
                />
              </TabsContent>
              <TabsContent value="marketing">
                <MarketingMetrics 
                  CAC={CAC}
                  marketingROI={marketingROI}
                  websiteTraffic={websiteTraffic}
                  campaignConversionRate={campaignConversionRate}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
