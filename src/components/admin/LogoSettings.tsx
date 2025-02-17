
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoSettingsProps {
  settings: any;
  isLoading: boolean;
  handleSave: (key: string, value: any) => void;
}

export default function LogoSettings({ settings, isLoading, handleSave }: LogoSettingsProps) {
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
            handleSave("logo", {
              ...settings?.logo,
              url: e.target.value,
            })
          }
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
            handleSave("logo", {
              ...settings?.logo,
              alt: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}