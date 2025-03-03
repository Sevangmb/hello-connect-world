
import React, { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimePicker } from "@/components/ui/time-picker";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NotificationSettings() {
  const [activeTab, setActiveTab] = useState("preferences");
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  
  // Fixed: Convert timestamp numbers to Date objects
  const [startTime, setStartTime] = useState<Date>(() => {
    const date = new Date();
    date.setHours(22, 0, 0, 0);
    return date;
  });
  
  const [endTime, setEndTime] = useState<Date>(() => {
    const date = new Date();
    date.setHours(7, 0, 0, 0);
    return date;
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Paramètres de notification</h1>
          
          <Tabs defaultValue="preferences" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="channels">Canaux de notification</TabsTrigger>
              <TabsTrigger value="schedule">Horaires</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Personnalisez les types de notifications que vous souhaitez recevoir
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationPreferences />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="channels">
              <Card>
                <CardHeader>
                  <CardTitle>Canaux de notification</CardTitle>
                  <CardDescription>
                    Choisissez comment vous souhaitez recevoir vos notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notifications push</h3>
                        <p className="text-sm text-muted-foreground">
                          Recevez des alertes sur votre appareil
                        </p>
                      </div>
                      <Switch id="push-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notifications par email</h3>
                        <p className="text-sm text-muted-foreground">
                          Recevez un résumé par email
                        </p>
                      </div>
                      <Switch id="email-notifications" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Notifications dans l'application</h3>
                        <p className="text-sm text-muted-foreground">
                          Notifications visibles dans l'application
                        </p>
                      </div>
                      <Switch id="in-app-notifications" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Horaires de notification</CardTitle>
                  <CardDescription>
                    Définissez des plages horaires pendant lesquelles vous ne souhaitez pas être dérangé
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Mode Ne pas déranger</h3>
                        <p className="text-sm text-muted-foreground">
                          Désactivez temporairement toutes les notifications
                        </p>
                      </div>
                      <Switch 
                        id="do-not-disturb" 
                        checked={doNotDisturb}
                        onCheckedChange={setDoNotDisturb}
                      />
                    </div>
                    
                    {doNotDisturb && (
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="start-time">Heure de début</Label>
                          <TimePicker 
                            date={startTime} 
                            setDate={setStartTime}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="end-time">Heure de fin</Label>
                          <TimePicker 
                            date={endTime} 
                            setDate={setEndTime}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
