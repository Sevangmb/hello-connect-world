
import React from 'react';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { ShopSettings } from '@/components/profile/shop/ShopSettings';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const shopId = user?.id || ''; // Provide a default shopId using the user's ID

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="shop">Boutique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>
        
        <TabsContent value="shop">
          <ShopSettings shopId={shopId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
