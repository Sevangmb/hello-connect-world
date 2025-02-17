
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ThemeSettingsProps {
  localTheme: { primary: string; secondary: string; accent: string; background: string; text: string; };
  setLocalTheme: React.Dispatch<React.SetStateAction<{ primary: string; secondary: string; accent: string; background: string; text: string; }>>;
  isLoading: boolean;
  handleSave: (key: string, value: any) => void;
}

export default function ThemeSettings({ localTheme, setLocalTheme, isLoading, handleSave }: ThemeSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="primary">Couleur primaire</Label>
          <Input
            id="primary"
            type="color"
            value={localTheme.primary}
            onChange={(e) => setLocalTheme({ ...localTheme, primary: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="secondary">Couleur secondaire</Label>
          <Input
            id="secondary"
            type="color"
            value={localTheme.secondary}
            onChange={(e) => setLocalTheme({ ...localTheme, secondary: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="accent">Couleur d'accent</Label>
          <Input
            id="accent"
            type="color"
            value={localTheme.accent}
            onChange={(e) => setLocalTheme({ ...localTheme, accent: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="background">Couleur de fond</Label>
          <Input
            id="background"
            type="color"
            value={localTheme.background}
            onChange={(e) => setLocalTheme({ ...localTheme, background: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="text">Couleur du texte</Label>
          <Input
            id="text"
            type="color"
            value={localTheme.text}
            onChange={(e) => setLocalTheme({ ...localTheme, text: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={() => handleSave("theme", localTheme)} disabled={isLoading}>
        Valider les couleurs
      </Button>
    </div>
  );
}