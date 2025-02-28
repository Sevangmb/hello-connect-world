
import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Notification } from "./types";
import { useToast } from "@/hooks/use-toast";

export const NotificationsList = () => {
  const { notifications, isLoading, markAsRead, subscribeToNotifications, refreshNotifications } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Configure realtime subscription
  useEffect(() => {
    const unsubscribe = subscribeToNotifications((notification: Notification) => {
      // Afficher une notification toast lorsqu'une nouvelle notification arrive
      toast({
        title: "Nouvelle notification",
        description: "Vous avez reçu une nouvelle notification",
      });
    });
    
    return unsubscribe;
  }, [toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshNotifications();
      toast({
        title: "Notifications actualisées",
        description: "Vos notifications ont été mises à jour",
      });
    } catch (error) {
      console.error("Erreur lors de l'actualisation des notifications:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'actualiser les notifications",
      });
    } finally {
      // Attendre un peu pour l'animation
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications?.filter(n => !n.read) || [];
      if (unreadNotifications.length === 0) return;
      
      // Marquer toutes les notifications comme lues
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
      
      toast({
        title: "Notifications marquées comme lues",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    } catch (error) {
      console.error("Erreur lors du marquage des notifications:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer les notifications comme lues",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-facebook-primary mb-2" />
          <p className="text-sm text-muted-foreground">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out pb-4 mb-4 border-b flex justify-between items-center", 
          isRefreshing ? "opacity-50" : "opacity-100"
        )}
      >
        <button 
          onClick={handleRefresh}
          className="py-2 px-4 text-sm text-facebook-primary flex items-center justify-center gap-2 rounded-md hover:bg-gray-50 transition-colors flex-1"
          disabled={isRefreshing}
        >
          <Loader2 className={cn("h-4 w-4", isRefreshing ? "animate-spin" : "")} />
          <span>{isRefreshing ? "Actualisation..." : "Actualiser"}</span>
        </button>
        
        {(notifications?.some(n => !n.read)) && (
          <button 
            onClick={handleMarkAllAsRead}
            className="py-2 px-4 text-sm text-facebook-primary flex items-center justify-center gap-2 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isRefreshing}
          >
            <span>Tout marquer comme lu</span>
          </button>
        )}
      </div>

      {!notifications?.length ? (
        <Card className="p-8 text-center bg-gray-50/50 border border-gray-100">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-40" />
          <p className="text-muted-foreground font-medium">Aucune notification</p>
          <p className="text-xs text-muted-foreground mt-1">
            Les notifications apparaîtront ici
          </p>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};
