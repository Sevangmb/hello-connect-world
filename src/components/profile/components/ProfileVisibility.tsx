
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

interface ProfileVisibilityProps {
  visibility: "public" | "private";
  onVisibilityChange: (value: "public" | "private") => void;
}

export const ProfileVisibility = ({ visibility, onVisibilityChange }: ProfileVisibilityProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="visibility">Visibilité du profil</Label>
      <Select
        value={visibility}
        onValueChange={onVisibilityChange}
      >
        <SelectTrigger>
          <SelectValue>
            {visibility === "public" ? (
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Public
              </div>
            ) : (
              <div className="flex items-center">
                <EyeOff className="w-4 h-4 mr-2" />
                Privé
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Public
            </div>
          </SelectItem>
          <SelectItem value="private">
            <div className="flex items-center">
              <EyeOff className="w-4 h-4 mr-2" />
              Privé
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {visibility === "public" 
          ? "Votre profil est visible par tous les utilisateurs"
          : "Votre profil n'est visible que par vos amis"}
      </p>
    </div>
  );
};
