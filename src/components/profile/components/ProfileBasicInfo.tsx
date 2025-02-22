
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Globe, MapPin } from "lucide-react";

interface ProfileBasicInfoProps {
  username: string;
  fullName: string;
  phone: string;
  address: string;
  preferredLanguage: string;
  onFieldChange: (field: string, value: string) => void;
}

export const ProfileBasicInfo = ({
  username,
  fullName,
  phone,
  address,
  preferredLanguage,
  onFieldChange,
}: ProfileBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-500">
              <User className="w-4 h-4" />
            </div>
            <Input
              id="username"
              value={username}
              onChange={(e) => onFieldChange("username", e.target.value)}
              placeholder="Votre nom d'utilisateur"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Nom complet</Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-500">
              <User className="w-4 h-4" />
            </div>
            <Input
              id="full_name"
              value={fullName}
              onChange={(e) => onFieldChange("full_name", e.target.value)}
              placeholder="Votre nom complet"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-500">
              <Phone className="w-4 h-4" />
            </div>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="Votre numéro de téléphone"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Langue préférée</Label>
          <Select
            value={preferredLanguage}
            onValueChange={(value) => onFieldChange("preferred_language", value)}
          >
            <SelectTrigger>
              <SelectValue>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  {preferredLanguage === "fr" ? "Français" : "English"}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Français
                </div>
              </SelectItem>
              <SelectItem value="en">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  English
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <div className="relative">
          <div className="absolute left-3 top-3 text-gray-500">
            <MapPin className="w-4 h-4" />
          </div>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => onFieldChange("address", e.target.value)}
            placeholder="Votre adresse complète"
            className="min-h-[100px] pl-9"
          />
        </div>
      </div>
    </div>
  );
};
