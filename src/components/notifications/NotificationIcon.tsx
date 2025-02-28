
import { Bell, MessageSquare, Heart, UserPlus, Check, AtSign, ShoppingBag, Award, Star, Gift, Trophy, Share2, Users, Smile } from "lucide-react";
import { Notification } from "./types";

export class NotificationIcon {
  static getNotificationContent(notification: Notification) {
    // Utiliser le message personnalisé s'il existe
    const customMessage = notification.message;

    switch (notification.type) {
      case "like":
        return {
          icon: <Heart className="h-4 w-4 text-red-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a aimé votre publication`,
        };
      case "comment":
        return {
          icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a commenté votre publication`,
        };
      case "follow":
        return {
          icon: <UserPlus className="h-4 w-4 text-green-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} vous suit désormais`,
        };
      case "mention":
        return {
          icon: <AtSign className="h-4 w-4 text-indigo-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} vous a mentionné`,
        };
      case "order_update":
        return {
          icon: <ShoppingBag className="h-4 w-4 text-purple-500" />,
          message: customMessage || `Mise à jour de votre commande`,
        };
      case "private_message":
        return {
          icon: <MessageSquare className="h-4 w-4 text-cyan-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} vous a envoyé un message privé`,
        };
      case "badge_earned":
        return {
          icon: <Award className="h-4 w-4 text-amber-500" />,
          message: customMessage || `Vous avez obtenu un nouveau badge !`,
        };
      case "rating":
        return {
          icon: <Star className="h-4 w-4 text-yellow-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a noté votre tenue`,
        };
      case "challenge_accepted":
        return {
          icon: <Gift className="h-4 w-4 text-emerald-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a rejoint votre défi`,
        };
      case "challenge_won":
        return {
          icon: <Trophy className="h-4 w-4 text-amber-500" />,
          message: customMessage || `Vous avez gagné un défi !`,
        };
      case "outfit_shared":
        return {
          icon: <Share2 className="h-4 w-4 text-violet-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a partagé une tenue avec vous`,
        };
      case "friend_request":
        return {
          icon: <Users className="h-4 w-4 text-blue-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} souhaite vous ajouter comme ami`,
        };
      case "friend_accepted":
        return {
          icon: <Smile className="h-4 w-4 text-green-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a accepté votre demande d'ami`,
        };
      case "system":
        return {
          icon: <Bell className="h-4 w-4 text-blue-500" />,
          message: customMessage || "Message système important",
        };
      default:
        return {
          icon: <Bell className="h-4 w-4 text-gray-500" />,
          message: customMessage || "Nouvelle notification",
        };
    }
  }
}
