
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialSettingsProps {
  settings: any;
  isLoading: boolean;
  onSave: (key: string, value: any) => Promise<void>;
}

export function SocialSettings({ settings, isLoading, onSave }: SocialSettingsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="facebook">Facebook</Label>
        <Input
          id="facebook"
          type="url"
          placeholder="https://facebook.com/..."
          value={settings?.social_links?.facebook || ""}
          onChange={(e) =>
            onSave("social_links", {
              ...settings?.social_links,
              facebook: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="twitter">Twitter</Label>
        <Input
          id="twitter"
          type="url"
          placeholder="https://twitter.com/..."
          value={settings?.social_links?.twitter || ""}
          onChange={(e) =>
            onSave("social_links", {
              ...settings?.social_links,
              twitter: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          type="url"
          placeholder="https://instagram.com/..."
          value={settings?.social_links?.instagram || ""}
          onChange={(e) =>
            onSave("social_links", {
              ...settings?.social_links,
              instagram: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
