
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, MessageSquare } from "lucide-react";

export const ProfileStats = ({ userId }: { userId: string }) => {
  const { data: stats } = useQuery({
    queryKey: ['profile-stats', userId],
    queryFn: async () => {
      const [friendsCount, clothesCount, messagesCount] = await Promise.all([
        supabase
          .from('friendships')
          .select('*', { count: 'exact' })
          .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
          .eq('status', 'accepted')
          .then(({ count }) => count),
        supabase
          .from('clothes')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
          .then(({ count }) => count),
        supabase
          .from('private_messages')
          .select('*', { count: 'exact' })
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .then(({ count }) => count),
      ]);

      return {
        friends: friendsCount || 0,
        clothes: clothesCount || 0,
        messages: messagesCount || 0,
      };
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Amis</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.friends || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vêtements</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.clothes || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.messages || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};
