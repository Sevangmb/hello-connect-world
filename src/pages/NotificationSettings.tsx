
import React from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = React.useState(true);
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [dndEnabled, setDndEnabled] = React.useState(false);
  const [startTime, setStartTime] = React.useState<Date | undefined>(new Date().setHours(22, 0));
  const [endTime, setEndTime] = React.useState<Date | undefined>(new Date().setHours(8, 0));

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Paramètres de notification</h1>
          
          <Tabs defaultValue="preferences" className="mb-8">
            <TabsList>
              <TabsTrigger value="preferences" className="flex items-center gap-1">
                <Bell className="h-4 w-4" />
                <span>Préférences</span>
              </TabsTrigger>
              <TabsTrigger value="channels" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                <span>Canaux</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>Horaires</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="mt-6">
              <NotificationPreferences />
            </TabsContent>
            
            <TabsContent value="channels" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Canaux de notification
                  </CardTitle>
                  <CardDescription>
                    Choisissez comment vous souhaitez recevoir vos notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 text-primary" />
                        <span className="ml-2 font-medium">Notifications dans l'application</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Afficher les notifications dans l'application
                      </p>
                    </div>
                    <Switch checked disabled />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 text-green-500" />
                        <span className="ml-2 font-medium">Notifications push</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications sur votre appareil même lorsque l'application est fermée
                      </p>
                    </div>
                    <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span className="ml-2 font-medium">Notifications par email</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications importantes par email
                      </p>
                    </div>
                    <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Horaires de notification
                  </CardTitle>
                  <CardDescription>
                    Définissez quand vous souhaitez recevoir des notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dnd-mode" className="font-medium">Mode Ne pas déranger</Label>
                      <p className="text-sm text-muted-foreground">
                        Désactive temporairement les notifications push
                      </p>
                    </div>
                    <Switch 
                      id="dnd-mode" 
                      checked={dndEnabled} 
                      onCheckedChange={setDndEnabled} 
                    />
                  </div>
                  
                  {dndEnabled && (
                    <div className="space-y-4 pt-2">
                      <Separator />
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="start-time">Heure de début</Label>
                          <TimePicker 
                            id="start-time"
                            value={startTime} 
                            onChange={setStartTime as any} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-time">Heure de fin</Label>
                          <TimePicker 
                            id="end-time"
                            value={endTime} 
                            onChange={setEndTime as any} 
                          />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Les notifications push seront désactivées entre ces heures
                      </p>
                    </div>
                  )}
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
