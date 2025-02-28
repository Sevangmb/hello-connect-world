
import { Bell, MessageSquare, Heart, UserPlus, Check, AtSign, ShoppingBag } from "lucide-react";
import { Notification } from "./types";

export class NotificationIcon {
  static getNotificationContent(notification: Notification) {
    switch (notification.type) {
      case "like":
        return {
          icon: <Heart className="h-4 w-4 text-red-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} a aimé votre publication`,
        };
      case "comment":
        return {
          icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} a commenté votre publication`,
        };
      case "follow":
        return {
          icon: <UserPlus className="h-4 w-4 text-green-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} vous suit désormais`,
        };
      case "mention":
        return {
          icon: <AtSign className="h-4 w-4 text-indigo-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} vous a mentionné`,
        };
      case "order_update":
        return {
          icon: <ShoppingBag className="h-4 w-4 text-purple-500" />,
          message: `Mise à jour de votre commande`,
        };
      case "private_message":
        return {
          icon: <MessageSquare className="h-4 w-4 text-cyan-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} vous a envoyé un message privé`,
        };
      default:
        return {
          icon: <Bell className="h-4 w-4" />,
          message: "Nouvelle notification",
        };
    }
  }
}
