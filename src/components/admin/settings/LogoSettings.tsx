
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoSettingsProps {
  settings: any;
  isLoading: boolean;
  onSave: (key: string, value: any) => Promise<void>;
}

export function LogoSettings({ settings, isLoading, onSave }: LogoSettingsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="logo-url">URL du logo</Label>
        <Input
          id="logo-url"
          type="url"
          placeholder="https://example.com/logo.png"
          value={settings?.logo?.url || ""}
          onChange={(e) =>
            onSave("logo", {
              ...settings?.logo,
              url: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="logo-alt">Texte alternatif</Label>
        <Input
          id="logo-alt"
          type="text"
          placeholder="Description du logo"
          value={settings?.logo?.alt || ""}
          onChange={(e) =>
            onSave("logo", {
              ...settings?.logo,
              alt: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
