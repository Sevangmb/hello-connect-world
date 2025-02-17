
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MessagesSettingsProps {
  settings: any;
  isLoading: boolean;
  handleSave: (key: string, value: any) => void;
}

export default function MessagesSettings({ settings, isLoading, handleSave }: MessagesSettingsProps) {
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
            handleSave("welcome_messages", {
              ...settings?.welcome_messages,
              header: e.target.value,
            })
          }
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
            handleSave("welcome_messages", {
              ...settings?.welcome_messages,
              subheader: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}