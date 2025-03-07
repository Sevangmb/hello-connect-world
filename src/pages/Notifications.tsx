
import React, { useState } from 'react';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Notifications = () => {
  const [filterType, setFilterType] = useState<string>('all');

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <Tabs defaultValue="all" onValueChange={setFilterType}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Toutes les notifications</TabsTrigger>
          <TabsTrigger value="unread">Non lues</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <NotificationsList />
        </TabsContent>
        
        <TabsContent value="unread">
          <NotificationsList />
        </TabsContent>
        
        <TabsContent value="preferences">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
