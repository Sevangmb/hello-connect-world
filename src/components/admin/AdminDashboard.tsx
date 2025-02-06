import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Store, ShoppingBag, MessageSquare } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalItems: 0,
    totalPosts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching admin dashboard stats...");
        
        // Fetch total users
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (usersError) {
          console.error('Error fetching users:', usersError);
          return;
        }
        console.log("Users count:", usersCount);

        // Fetch total shops
        const { count: shopsCount, error: shopsError } = await supabase
          .from('shops')
          .select('*', { count: 'exact', head: true });
        
        if (shopsError) {
          console.error('Error fetching shops:', shopsError);
          return;
        }
        console.log("Shops count:", shopsCount);

        // Fetch total shop items
        const { count: itemsCount, error: itemsError } = await supabase
          .from('shop_items')
          .select('*', { count: 'exact', head: true });
        
        if (itemsError) {
          console.error('Error fetching items:', itemsError);
          return;
        }
        console.log("Items count:", itemsCount);

        // Fetch total posts
        const { count: postsCount, error: postsError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });
        
        if (postsError) {
          console.error('Error fetching posts:', postsError);
          return;
        }
        console.log("Posts count:", postsCount);

        setStats({
          totalUsers: usersCount || 0,
          totalShops: shopsCount || 0,
          totalItems: itemsCount || 0,
          totalPosts: postsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs inscrits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Boutiques Total</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShops}</div>
            <p className="text-xs text-muted-foreground">
              Boutiques créées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Total</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Articles en vente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Total</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Publications créées
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
