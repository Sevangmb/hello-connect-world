
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

interface ChallengeParticipationSettingsProps {
  participationType: "virtual" | "photo";
  isVotingEnabled: boolean;
  onParticipationTypeChange: (value: "virtual" | "photo") => void;
  onVotingEnabledChange: (value: boolean) => void;
}

export function ChallengeParticipationSettings({
  participationType,
  isVotingEnabled,
  onParticipationTypeChange,
  onVotingEnabledChange,
}: ChallengeParticipationSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type de participation</Label>
        <RadioGroup 
          value={participationType} 
          onValueChange={onParticipationTypeChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="virtual" id="virtual" />
            <Label htmlFor="virtual">Tenue virtuelle</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="photo" id="photo" />
            <Label htmlFor="photo">Photo</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={isVotingEnabled}
          onCheckedChange={onVotingEnabledChange}
          id="voting"
        />
        <Label htmlFor="voting">Activer les votes</Label>
      </div>
    </div>
  );
}
