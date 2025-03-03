
import React, { useState } from "react";
import { useNotificationCenter } from "@/hooks/notifications/useNotificationCenter";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BellOff, Loader2, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NotificationsListProps {
  compact?: boolean;
  className?: string;
}

export function NotificationsList({ compact = false, className }: NotificationsListProps) {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    realtimeConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotificationCenter();

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtrer les notifications selon l'onglet actif
  const filteredNotifications = activeTab === "unread"
    ? notifications.filter(notification => !notification.read)
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
    <div className={cn("space-y-4", className, compact ? "p-3" : "")}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className={cn("font-medium", compact ? "text-base" : "text-lg")}>
            Vos notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8 w-8 p-0"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="sr-only">Actualiser les notifications</span>
        </Button>
      </div>

      {!realtimeConnected && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800 text-xs">
            Les notifications en temps réel ne sont pas disponibles actuellement.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "unread")}>
        <div className="flex justify-between items-center">
          <TabsList className={cn(compact ? "h-8" : "")}>
            <TabsTrigger value="all" className={cn(compact ? "text-xs px-3 h-7" : "")}>
              Toutes
            </TabsTrigger>
            <TabsTrigger value="unread" className={cn(compact ? "text-xs px-3 h-7" : "")}>
              Non lues {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
          </TabsList>
          
          {filteredNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className={cn("text-xs", compact ? "h-7 px-2" : "")}
            >
              <BellOff className="h-3 w-3 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <TabsContent value="all" className="mt-3">
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Pas de notifications"
              description="Vous n'avez pas encore de notifications."
              className={cn(compact ? "py-6" : "py-12")}
            />
          ) : (
            <div className={cn("space-y-2", compact ? "max-h-[300px]" : "max-h-[500px]", "overflow-y-auto pr-1")}>
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                  compact={compact}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="mt-3">
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title="Pas de notifications non lues"
              description="Vous avez lu toutes vos notifications."
              className={cn(compact ? "py-6" : "py-12")}
            />
          ) : (
            <div className={cn("space-y-2", compact ? "max-h-[300px]" : "max-h-[500px]", "overflow-y-auto pr-1")}>
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                  compact={compact}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {compact && (
        <div className="pt-2 border-t flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = "/notifications"}
            className="w-full text-xs"
          >
            Voir toutes les notifications
          </Button>
        </div>
      )}
    </div>
  );
}
