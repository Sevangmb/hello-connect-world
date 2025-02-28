import React, { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "./types";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Bell, BellOff } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NotificationsList() {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    realtimeStatus,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtrer les notifications selon l'onglet actif
  const filteredNotifications = activeTab === "unread"
    ? notifications?.filter(notification => !notification.read)
    : notifications;

  // Fonction pour rafraîchir manuellement les notifications
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshNotifications();
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Marquer une notification comme lue
  const handleMarkAsRead = async (notification: Notification) => {
    return Promise.resolve(markAsRead(notification.id));
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  // Supprimer une notification
  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  // Effet pour marquer automatiquement les notifications comme lues lorsqu'elles sont affichées
  useEffect(() => {
    if (activeTab === "unread" && filteredNotifications?.length > 0) {
      // Optionnel: marquer automatiquement comme lues après un délai
      const timer = setTimeout(() => {
        handleMarkAllAsRead();
      }, 5000); // 5 secondes après l'affichage

      return () => clearTimeout(timer);
    }
  }, [activeTab, filteredNotifications]);

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Vous devez être connecté pour voir vos notifications.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Une erreur est survenue lors du chargement des notifications.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-medium">Vos notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            "Actualiser"
          )}
        </Button>
      </div>

      {!realtimeStatus.connected && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            Les notifications en temps réel ne sont pas disponibles actuellement.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="unread">Non lues {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
          </TabsList>
          
          {filteredNotifications?.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <BellOff className="h-3 w-3 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <TabsContent value="all" className="mt-4">
          {filteredNotifications?.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Pas de notifications"
              description="Vous n'avez pas encore de notifications."
            />
          ) : (
            <div className="space-y-2">
              {filteredNotifications?.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification)}
                  onDelete={() => handleDeleteNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          {filteredNotifications?.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title="Pas de notifications non lues"
              description="Vous avez lu toutes vos notifications."
            />
          ) : (
            <div className="space-y-2">
              {filteredNotifications?.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification)}
                  onDelete={() => handleDeleteNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
