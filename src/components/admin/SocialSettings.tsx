import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialSettingsProps {
  settings: any;
  isLoading: boolean;
  handleSave: (key: string, value: any) => void;
}

export default function SocialSettings({ settings, isLoading, handleSave }: SocialSettingsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="facebook">
          <img src="/icons/facebook.svg" alt="Facebook" className="inline-block mr-2 w-4 h-4" />
          Facebook
        </Label>
        <Input
          id="facebook"
          type="url"
          placeholder="https://facebook.com/..."
          value={settings?.social_links?.facebook || ""}
          onChange={(e) =>
            handleSave("social_links", {
              ...settings?.social_links,
              facebook: e.target.value,
            })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="twitter">
          <img src="/icons/twitter.svg" alt="Twitter" className="inline-block mr-2 w-4 h-4" />
          Twitter
        </Label>
        <Input
          id="twitter"
          type="url"
          placeholder="https://twitter.com/..."
          value={settings?.social_links?.twitter || ""}
          onChange={(e) =>
            handleSave("social_links", {
              ...settings?.social_links,
              twitter: e.target.value,
            })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="instagram">
          <img src="/icons/instagram.svg" alt="Instagram" className="inline-block mr-2 w-4 h-4" />
          Instagram
        </Label>
        <Input
          id="instagram"
          type="url"
          placeholder="https://instagram.com/..."
          value={settings?.social_links?.instagram || ""}
          onChange={(e) =>
            handleSave("social_links", {
              ...settings?.social_links,
              instagram: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}