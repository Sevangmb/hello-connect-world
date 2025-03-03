
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNotificationCenter } from "@/hooks/notifications/useNotificationCenter";
import { NotificationType } from "./types";
import { Bell, MessageSquare, Heart, UserPlus, AtSign, ShoppingBag, Award, Star, Gift, Trophy, Share2, Users } from "lucide-react";

interface NotificationTypeConfig {
  type: NotificationType;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const notificationTypes: NotificationTypeConfig[] = [
  // Interactions Sociales
  {
    type: "like",
    label: "J'aime",
    description: "Quand quelqu'un aime votre contenu",
    icon: <Heart className="h-4 w-4 text-red-500" />,
    category: "Interactions Sociales"
  },
  {
    type: "comment",
    label: "Commentaires",
    description: "Quand quelqu'un commente votre contenu",
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    category: "Interactions Sociales"
  },
  {
    type: "follow",
    label: "Nouveaux abonnés",
    description: "Quand quelqu'un commence à vous suivre",
    icon: <UserPlus className="h-4 w-4 text-green-500" />,
    category: "Interactions Sociales"
  },
  {
    type: "mention",
    label: "Mentions",
    description: "Quand quelqu'un vous mentionne dans un commentaire",
    icon: <AtSign className="h-4 w-4 text-indigo-500" />,
    category: "Interactions Sociales"
  },
  {
    type: "private_message",
    label: "Messages privés",
    description: "Quand vous recevez un message privé",
    icon: <MessageSquare className="h-4 w-4 text-cyan-500" />,
    category: "Interactions Sociales"
  },
  
  // Vide-Dressing
  {
    type: "order_update",
    label: "Mises à jour de commandes",
    description: "Mises à jour concernant vos achats ou ventes",
    icon: <ShoppingBag className="h-4 w-4 text-purple-500" />,
    category: "Vide-Dressing"
  },
  
  // Communauté
  {
    type: "badge_earned",
    label: "Badges obtenus",
    description: "Quand vous obtenez un nouveau badge",
    icon: <Award className="h-4 w-4 text-amber-500" />,
    category: "Communauté"
  },
  {
    type: "rating",
    label: "Évaluations",
    description: "Quand quelqu'un évalue votre contenu",
    icon: <Star className="h-4 w-4 text-yellow-500" />,
    category: "Communauté"
  },
  {
    type: "challenge_accepted",
    label: "Défis acceptés",
    description: "Quand quelqu'un accepte votre défi",
    icon: <Gift className="h-4 w-4 text-emerald-500" />,
    category: "Communauté"
  },
  {
    type: "challenge_won",
    label: "Défis gagnés",
    description: "Quand vous gagnez un défi",
    icon: <Trophy className="h-4 w-4 text-amber-500" />,
    category: "Communauté"
  },
  {
    type: "outfit_shared",
    label: "Tenues partagées",
    description: "Quand quelqu'un partage une tenue avec vous",
    icon: <Share2 className="h-4 w-4 text-violet-500" />,
    category: "Communauté"
  },
  {
    type: "friend_request",
    label: "Demandes d'ami",
    description: "Quand quelqu'un vous envoie une demande d'ami",
    icon: <Users className="h-4 w-4 text-blue-500" />,
    category: "Communauté"
  },
];

export const NotificationPreferences: React.FC = () => {
  const { updateNotificationPreference } = useNotificationCenter();
  const [preferences, setPreferences] = React.useState<Record<NotificationType, boolean>>({
    like: true,
    comment: true,
    follow: true,
    mention: true,
    order_update: true,
    private_message: true,
    badge_earned: true,
    rating: true,
    challenge_accepted: true,
    challenge_won: true,
    outfit_shared: true,
    friend_request: true,
    friend_accepted: true,
    system: true,
  });

  // Grouper les types de notification par catégorie
  const groupedNotifications = notificationTypes.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NotificationTypeConfig[]>);

  const handleToggle = (type: NotificationType, enabled: boolean) => {
    setPreferences(prev => ({ ...prev, [type]: enabled }));
    updateNotificationPreference(type, enabled);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Préférences de notification
        </CardTitle>
        <CardDescription>
          Personnalisez les types de notifications que vous souhaitez recevoir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedNotifications).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="font-medium text-lg">{category}</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2 font-medium">{item.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={preferences[item.type]}
                    onCheckedChange={(checked) => handleToggle(item.type, checked)}
                  />
                </div>
              ))}
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
