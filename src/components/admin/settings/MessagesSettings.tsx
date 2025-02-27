
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MessagesSettingsProps {
  settings: any;
  isLoading: boolean;
  onSave: (key: string, value: any) => Promise<void>;
}

export function MessagesSettings({ settings, isLoading, onSave }: MessagesSettingsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="welcome-header">Message principal</Label>
        <Input
          id="welcome-header"
          type="text"
          placeholder="Bienvenue sur notre plateforme"
          value={settings?.welcome_messages?.header || ""}
          onChange={(e) =>
            onSave("welcome_messages", {
              ...settings?.welcome_messages,
              header: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="welcome-subheader">Message secondaire</Label>
        <Input
          id="welcome-subheader"
          type="text"
          placeholder="Découvrez la mode autrement"
          value={settings?.welcome_messages?.subheader || ""}
          onChange={(e) =>
            onSave("welcome_messages", {
              ...settings?.welcome_messages,
              subheader: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
