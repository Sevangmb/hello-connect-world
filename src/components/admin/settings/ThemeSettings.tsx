
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface ThemeSettingsProps {
  settings: any;
  isLoading: boolean;
  onSave: (key: string, value: any) => Promise<void>;
}

export function ThemeSettings({ settings, isLoading, onSave }: ThemeSettingsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="primary">Couleur primaire</Label>
        <Input
          id="primary"
          type="color"
          value={settings?.theme?.primary || "#69d2e7"}
          onChange={(e) =>
            onSave("theme", {
              ...settings?.theme,
              primary: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="secondary">Couleur secondaire</Label>
        <Input
          id="secondary"
          type="color"
          value={settings?.theme?.secondary || "#a7dbd8"}
          onChange={(e) =>
            onSave("theme", {
              ...settings?.theme,
              secondary: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="accent">Couleur d'accent</Label>
        <Input
          id="accent"
          type="color"
          value={settings?.theme?.accent || "#f38630"}
          onChange={(e) =>
            onSave("theme", {
              ...settings?.theme,
              accent: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="background">Couleur de fond</Label>
        <Input
          id="background"
          type="color"
          value={settings?.theme?.background || "#ffffff"}
          onChange={(e) =>
            onSave("theme", {
              ...settings?.theme,
              background: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="text">Couleur du texte</Label>
        <Input
          id="text"
          type="color"
          value={settings?.theme?.text || "#333333"}
          onChange={(e) =>
            onSave("theme", {
              ...settings?.theme,
              text: e.target.value,
            })
          }
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
