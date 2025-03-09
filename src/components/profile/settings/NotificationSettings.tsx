
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/core/users/domain/types";

interface NotificationSettingsProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => void;
}

export const NotificationSettings = ({ profile, onUpdate }: NotificationSettingsProps) => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(profile.email_notifications);
  const [pushNotifications, setPushNotifications] = useState(profile.push_notifications ?? true);
  const [marketingEmails, setMarketingEmails] = useState(profile.marketing_emails ?? false);
  const [isSaving, setIsSaving] = useState(false);

  const saveNotificationSettings = async () => {
    try {
      setIsSaving(true);
      
      const updatedSettings = {
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        marketing_emails: marketingEmails
      };
      
      onUpdate(updatedSettings);
      
      toast({
        title: "Préférences enregistrées",
        description: "Vos préférences de notification ont été mises à jour"
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des notifications:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <p className="font-medium">Préférences de notification</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notifications par email</p>
            <p className="text-sm text-muted-foreground">
              Recevez des notifications par email
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notifications push</p>
            <p className="text-sm text-muted-foreground">
              Recevez des notifications sur votre appareil
            </p>
          </div>
          <Switch
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Emails marketing</p>
            <p className="text-sm text-muted-foreground">
              Recevez des offres et conseils personnalisés
            </p>
          </div>
          <Switch
            checked={marketingEmails}
            onCheckedChange={setMarketingEmails}
          />
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          variant="outline" 
          onClick={saveNotificationSettings}
          disabled={isSaving}
          size="sm"
        >
          Enregistrer les préférences
        </Button>
      </div>
    </div>
  );
};
